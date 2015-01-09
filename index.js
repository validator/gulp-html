var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

module.exports = function() {
  var stream  = through.obj(function() {
  });

  return stream;
});
