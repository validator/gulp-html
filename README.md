# gulp-html

[![npm version](https://img.shields.io/npm/v/gulp-html?logo=npm&logoColor=fff)](https://www.npmjs.com/package/gulp-html)
[![Build Status](https://img.shields.io/github/actions/workflow/status/validator/gulp-html/test.yml?branch=main&label=Tests&logo=github)](https://github.com/validator/gulp-html/actions/workflows/test.yml?query=branch%3Amain)

gulp plugin for HTML validation, using the [Nu Html Checker (v.Nu)](https://validator.github.io/validator/)

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

The options object supports the same options as Nu Html Checker.

See also <https://validator.github.io/validator/#options>.

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

This software is released under the MIT License. See [LICENSE](https://github.com/validator/gulp-html/blob/main/LICENSE).
