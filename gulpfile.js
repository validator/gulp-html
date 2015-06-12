var gulp   = require('gulp');
var validator = require('./');

gulp.task('ok', function () {
  var status = true;
  return gulp.src('./test/ok.html')
  .pipe(validator())
  .on('error', function () {
    status = false;
  })
  .on('end', function () {
    if (status === true) return;
    throw new Error("ok.html isn't ok");
  });
});

gulp.task('ng', function () {
  var status = true;
  try {
    return gulp.src('./test/ng.html')
      .pipe(validator())
      .on('error', function () {
        status = false;
      })
      .on('end', function () {
        if (status === false) return;
        throw new Error("ng.html isn't ng");
      });
  } catch (e) {}
});

gulp.task('test', ['ok']);
