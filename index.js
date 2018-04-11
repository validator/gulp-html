const exec = require("child_process").exec,
      vnuJar = require("vnu-jar");

module.exports = async function(filepath, opt) {
  const options = Object.assign({
    "errors-only": false,
    html: false,
    "no-stream": false,
    verbose: false,
  }, opt);
  let vnuCmd = `java -Xss1024k -jar ${vnuJar} `;

  // Set options
  for (const [ key, val ] of Object.entries(options)) {
    if (key === "format") {
      throw new Error("Error: format option is forbidden in this module.");
    }
    if (val === true) {
      vnuCmd += `--${key} `;
    }
  }

  vnuCmd += `--format json ${filepath}`;

  return new Promise((resolve, reject) => {
    exec(vnuCmd, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      console.log(stdout);

      return resolve(JSON.parse(stderr).messages);
    });
  });
};
