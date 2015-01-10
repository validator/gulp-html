# gulp-html
gulp plugin for html validation


## Usage

```js
var gulp   = require('gulp');
var validator = require('gulp-html');

gulp.task('html', function() {
  return gulp.src('src/index.html')
  .pipe(validator())
  .pipe(gulp.dest('dist/'));
});
```
