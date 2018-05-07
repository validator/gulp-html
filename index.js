const exec = require("child_process").exec,
      vnuJar = require("vnu-jar");

module.exports = async function(filepath, opt) {
  const options = Object.assign({
    "errors-only": false,
    html: false,
    "no-stream": false,
  }, opt);
  let vnuCmd = `java -Xss1024k -jar ${vnuJar} `;

  // Set options
  for (const [ key, val ] of Object.entries(options)) {
    if (key === "format" || key === "exit-zero-always" || key === "verbose") {
      console.warn(`WARNING: ${key} option is ignored in this module.`);
      continue;
    }
    if (val === true) {
      vnuCmd += `--${key} `;
    }
  }

  vnuCmd += `--format json ${filepath}`;

  return new Promise((resolve, reject) => {
    exec(vnuCmd, (err, stdout, stderr) => {
      // Don't reject when Nu HTML Checker return 1 as return code (It returns 1 when HTML is not valid)
      if (err && !err.message.startsWith("Command failed:")) {
        return reject(err);
      }

      console.log(stdout);

      return resolve(JSON.parse(stderr).messages);
    });
  });
};
