var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var exec = require('child_process').exec;
var vnu = 'java -jar vnu.jar -';

module.exports = function() {
  var stream  = through.obj(function(file, enc, cb) {
    this.push(file);
    if (file.isNull()) {
      // Do nothing if no contents
    }

    if (file.isBuffer()) {
      var str = file.contents.toString('utf8');
      exec("echo '" + str + "' | " + vnu, function (err, stdout, stderr) {
        if (err === null) {
          return cb();
        }
        cb(new PluginError('gulp-html', stderr));
        return;
      });
    }

    if (file.isStream()) {
      cb(new PluginError('gulp-html', 'Only Buffers are supported'));
      return;
    }
  });

  return stream;
};
