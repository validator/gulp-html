import { exec } from "child_process";
import * as vnuJar from "vnu-jar";

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
  url: string;
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
 * Validate HTML with Nu HTML Checker.
 *
 * @param {string} filepath - File path or URL of the HTML to validate.
 * @param {object} opt - Options to pass Nu HTML Checker. See https://validator.github.io/validator/#options for details.
 * @returns {object[]} - Objects of detected errors and warnings. Empty array if there are no errors and warnings detected.
 */
export async function vnu(filepath: string, opt: NuOptions = {}): Promise<NuResult[]> {
  const options = Object.assign({
    "errors-only": false,
    html: false,
    "no-stream": false,
  }, opt);
  let vnuCmd = `java -Xss1024k -jar ${vnuJar} `;

  // Set options
  for (const [ key, val ] of Object.entries(options)) {
    if (
      key === "format" ||
      key === "exit-zero-always" ||
      key === "help" ||
      key === "verbose" ||
      key === "version" ||
      key === "Werror"
    ) {
      console.warn(`WARNING: ${key} option is ignored in this module.`);
      continue;
    }
    if (val === true) {
      vnuCmd += `--${key} `;
    }
  }

  vnuCmd += `--format json ${filepath}`;

  return await new Promise((resolve, reject) => {
    exec(vnuCmd, (err, stdout, stderr) => {
      // Don't reject when Nu HTML Checker return 1 as return code (It returns 1 when HTML is not valid)
      if (err && !err.message.startsWith("Command failed:")) {
        return reject(err);
      }

      console.log(stdout);

      return resolve(JSON.parse(stderr).messages);
    });
  }) as NuResult[];
};
