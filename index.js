var exec = require('child_process').exec;
var through = require('through2');
var gutil = require('gulp-util');
var merge = require('merge');
var PluginError = gutil.PluginError;
var vnu = 'java -jar vnu.jar ';

module.exports = function(opt) {
  var stream  = through.obj(function(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) {
      return cb(new PluginError('gulp-html', 'Streaming not supported'));
    }
    var str = file.contents.toString('utf8');
    var options = merge({
      'errors-only': false,
      'format': 'gnu',
      'html': false,
      'no-stream': false,
      'verbose': false,
    }, opt);

    // Set options
    Object.keys(options).forEach(function (key) {
      var val = options[key];
      if (key === 'format' && val !== 'gnu') vnu += '--format ' + val + ' ';
      if (val === true) vnu += '--' + key + ' ';
    });

    exec("echo '" + str + "' | " + vnu + '-', function (err, stdout, stderr) {
      if (err === null) return cb(null, file);
      return cb(new PluginError('gulp-html', stderr));
    });
  });

  return stream;
};
