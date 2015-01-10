var gulp   = require('gulp');
var validator = require('./');

gulp.task('ok', function() {
  return gulp.src('./test/ok.html')
  .pipe(validator());
});

gulp.task('ng', function() {
  return gulp.src('./test/ng.html')
  .pipe(validator());
});
