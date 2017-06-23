var exec = require('child_process').exec;
var through = require('through2');
var gutil = require('gulp-util');
var merge = require('merge');
var PluginError = gutil.PluginError;
var vnuJar = require('vnu-jar');

module.exports = function(opt) {
  var vnuCmd = 'java -Xss1024k -jar ' + vnuJar + ' ';

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
    if (key === 'format' && val !== 'gnu') vnuCmd += '--format ' + val + ' ';
    if (val === true) vnuCmd += '--' + key + ' ';
  });

  var stream  = through.obj(function(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) {
      return cb(new PluginError('gulp-html', 'Streaming not supported'));
    }

    exec(vnuCmd + file.history, function (err, stdout, stderr) {
      if (err === null) return cb(null, file);
      return cb(new PluginError('gulp-html', stderr || stdout));
    });
  });

  return stream;
};
