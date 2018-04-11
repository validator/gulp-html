const exec = require("child_process").exec,
      through = require("through2"),
      gutil = require("gulp-util"),
      PluginError = gutil.PluginError,
      vnuJar = require("vnu-jar");

module.exports = function(opt) {
  const options = Object.assign({
    "errors-only": false,
    format: "gnu",
    html: false,
    "no-stream": false,
    verbose: false,
  }, opt);
  let vnuCmd = "java -Xss1024k -jar " + vnuJar + " ";

  // Set options
  for (const [ key, val ] of Object.entries(options)) {
    if (key === "format" && val !== "gnu") {
      vnuCmd += "--format " + val + " ";
    }
    if (val === true) {
      vnuCmd += "--" + key + " ";
    }
  }

  const stream = through.obj((file, enc, cb) => {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError("gulp-html", "Streaming not supported"));
    }

    exec(vnuCmd + file.history, (err, stdout, stderr) => {
      if (err === null) {
        return cb(null, file);
      }

      return cb(new PluginError("gulp-html", stderr || stdout));
    });
  });

  return stream;
};
