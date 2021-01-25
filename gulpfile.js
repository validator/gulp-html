'use strict';

const gulp = require('gulp');
const validator = require('.');

const ok = () => {
  let status = true;
  return gulp.src('./test/ok.html')
    .pipe(validator())
    .on('error', () => {
      status = false;
    })
    .on('end', () => {
      if (status === true) {
        return;
      }

      throw new Error('ok.html isn\'t ok');
    });
};

const ng = () => {
  let status = true;
  try {
    return gulp.src('./test/ng.html')
      .pipe(validator())
      .on('error', () => {
        status = false;
      })
      .on('end', () => {
        if (status === false) {
          return;
        }

        throw new Error('ng.html isn\'t ng');
      });
  } catch {}
};

gulp.task('test', gulp.parallel(ok, ng));
