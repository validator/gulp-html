var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var exec = require('child_process').exec;
var command = 'java -jar ~/vnu.jar -';

module.exports = function() {
  var stream  = through.obj(function(file, enc, callback) {
    if (file.isNull()) {
      // Do nothing if no contents
    }

    if (file.isBuffer()) {
      var str = file.contents.toString('utf8');
    }

    if (file.isStream()) {
      file.contens.pipe(function () {
        var str = file.contents;
      });
    }

    return callback();
  });

  return stream;
};
