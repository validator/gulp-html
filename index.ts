import { exec } from "child_process";
import { existsSync, writeFileSync } from "fs";
import { file } from "tmp-promise";
import * as vnuJar from "vnu-jar";

// For Node.js 8.x
import { URL } from "url";

interface NuOptions {
  "errors-only"?: boolean;
  filterfile?: string;
  filterpattern?: string;
  "skip-non-css"?: boolean;
  css?: boolean;
  "skip-non-svg"?: boolean;
  svg?: boolean;
  "skip-non-html"?: boolean;
  html?: boolean;
  "no-stream"?: boolean;
  "also-check-css"?: boolean;
  "also-check-svg"?: boolean;
  "user-agent"?: string;
  "no-langdetect"?: boolean;
}

interface NuResult {
  type: "error" | "info";
  subType?: "warning";
  url?: string;
  firstLine?: number;
  firstColumn?: number;
  lastLine: number;
  lastColumn: number;
  hiliteStart: number;
  hiliteLength: number;
  message: string;
  extract: string;
}

/**
 * Check if given string is URL.
 *
 * @param {string} str - String to check if it is an URL string.
 * @returns {boolean} - True if given string is URL string, otherwise false.
 */
function isURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (err) {
    if (err.code === "ERR_INVALID_URL") {
      return false;
    } else {
      throw err;
    }
  }
}

/**
 * Validate HTML with Nu HTML Checker.
 *
 * @param {string} target - URL, file path or HTML string to validate.
 * @param {object} opt - Options to pass Nu HTML Checker. See https://validator.github.io/validator/#options for details.
 * @returns {object[]} - Objects of detected errors and warnings. Empty array if there are no errors and warnings detected.
 */
export async function vnu(target: string, opt: NuOptions = {}): Promise<NuResult[]> {
  let mode: ("url" | "html") = "url";
  let cleanupTmp = (): void => { /* By default do nothing */ };

  if (isURL(target) || existsSync(target)) {
    mode = "url";
  } else {
    mode = "html";
  }

  const options = Object.assign({
    "errors-only": false,
    html: false,
    "no-stream": false,
  }, opt);
  let vnuCmd = `java -Xss1024k -jar ${vnuJar} `;

  // Set options
  for (const [ key, val ] of Object.entries(options)) {
    if ( // Unsupported options
      key === "format" ||
      key === "exit-zero-always" ||
      key === "help" ||
      key === "verbose" ||
      key === "version" ||
      key === "Werror"
    ) {
      console.warn(`WARNING: ${key} option is ignored in this module.`);
      continue;
    } else if ( // String options
      key === "filterfile" ||
      key === "filterpattern" ||
      key === "user-agent"
    ) {
      vnuCmd += `--${key} "${val}" `;
    } else if (val === true) { // Boolean options, and true is set
      vnuCmd += `--${key} `;
    }
  }

  vnuCmd += "--format json ";

  if (mode === "url") {
    vnuCmd += target;
  } else { // mode === "html"
    if (process.platform === "win32") {
      const { fd, path, cleanup } = await file();

      cleanupTmp = cleanup;
      writeFileSync(fd, target); // write file content to tmp file

      vnuCmd = `${vnuCmd}${path}`;
    } else {
      vnuCmd = `cat << _EOF_ | ${vnuCmd}-
${target}
_EOF_`;
    }
  }

  return await new Promise((resolve, reject) => {
    exec(vnuCmd, (err, stdout, stderr) => {
      // Don't reject when Nu HTML Checker return 1 as return code (It returns 1 when HTML is not valid)
      if (err && !err.message.startsWith("Command failed:")) {
        return reject(err);
      }

      if (stdout) {
        console.log(stdout);
      }

      let messages: NuResult[] = JSON.parse(stderr).messages;

      if (process.platform === "win32" && mode === "html") {
        cleanupTmp();

        messages = messages.map(message => {
          delete message.url;
          return message;
        });
      }

      return resolve(messages);
    });
  }) as NuResult[];
};
