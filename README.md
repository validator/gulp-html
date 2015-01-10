# gulp-html [![Build Status](https://travis-ci.org/watilde/gulp-html.svg)](https://travis-ci.org/watilde/gulp-html) [![NPM Version](http://img.shields.io/npm/v/gulp-html.svg)](https://www.npmjs.org/package/gulp-html) [![Dependency Status](https://gemnasium.com/watilde/gulp-html.svg)](https://gemnasium.com/watilde/gulp-html)

gulp plugin for HTML validation, using the [vnu.jar](https://validator.github.io/)

## Install
Run `npm install gulp-html`.

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

## Options
The options object supports the same options as the standard The Nu Markup Checker.

See also: http://validator.github.io/validator/#options

### errors-only
Type: `Boolean`

Default: `false`

### format
Type: `String`

Default: `"gnu"`

### html
Type: `Boolean`

Default: `false`

### no-stream
Type: `Boolean`

Default: `false`

### verbose
Type: `Boolean`

Default: `false`

## License
Copyright 2015 Daijiro Wachi

This software is released under the MIT License. See [LICENSE](/LICENSE).
