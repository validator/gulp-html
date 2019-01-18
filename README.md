# gulp-html

[![Build Status](https://img.shields.io/travis/validator/gulp-html/master.svg)](https://travis-ci.org/validator/gulp-html)
[![dependencies Status](https://img.shields.io/david/validator/gulp-html.svg)](https://david-dm.org/validator/gulp-html)
[![devDependencies Status](https://img.shields.io/david/dev/validator/gulp-html.svg)](https://david-dm.org/validator/gulp-html?type=dev)

gulp plugin for HTML validation, using the [Nu Html Checker (v.Nu)](https://validator.github.io/)

## Install

Run `npm install gulp-html -D`.

## Usage

```js
const gulp = require('gulp');
const validator = require('gulp-html');

const html = () => {
  return gulp.src('src/index.html')
    .pipe(validator())
    .pipe(gulp.dest('dist/'));
};
```

## Options

The options object supports the same options as the standard The Nu Markup Checker.

See also: <https://validator.github.io/validator/#options>

### errors-only

* Type: `Boolean`
* Default: `false`

### format

* Type: `String`
* Default: `"gnu"`

### html

* Type: `Boolean`
* Default: `false`

### no-stream

* Type: `Boolean`
* Default: `false`

### verbose

* Type: `Boolean`
* Default: `false`

## License

Copyright 2015 Daijiro Wachi

This software is released under the MIT License. See [LICENSE](/LICENSE).
