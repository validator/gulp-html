const exec = require("child_process").exec,
      vnuJar = require("vnu-jar");

module.exports = async function(filepath, opt) {
  const options = Object.assign({
    "errors-only": false,
    format: "gnu",
    html: false,
    "no-stream": false,
    verbose: false,
  }, opt);
  let vnuCmd = `java -Xss1024k -jar ${vnuJar} `;

  // Set options
  for (const [ key, val ] of Object.entries(options)) {
    if (key === "format" && val !== "gnu") {
      vnuCmd += `--format ${val} `;
    }
    if (val === true) {
      vnuCmd += `--${key} `;
    }
  }

  vnuCmd += filepath;

  return new Promise((resolve, reject) => {
    exec(vnuCmd, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      return resolve(filepath);
    });
  });
};
