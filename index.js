'use strict';

const { exec } = require('child_process');
const chalk = require('chalk');
const PluginError = require('plugin-error');
const through = require('through2');
const vnuJar = require('vnu-jar');
const winston = require('winston');

const vnuErrorLevels = {
  levels: {
    'success': 0,
    'error': 1,
    'info': 2,
    'non-document-error': 3
  },
  colors: {
    'success': 'green',
    'error': 'red',
    'info': 'yellow',
    'non-document-error': 'black'
  }
};

const logger = winston.createLogger({
  levels: vnuErrorLevels.levels,
  transports: [
    new (winston.transports.Console)({
      formatter(options) {
        let levelType = '';
        // Return string will be passed to logger.
        if (options.level === 'error') {
          levelType = chalk.red('error: ');
        } else if (options.level === 'info') {
          levelType = chalk.yellow('warning: ');
        } else if (options.level === 'success') {
          return `${chalk.green(options.message) + chalk.underline.bold(options.meta.path)}\n`;
        } else {
          return chalk.bold('non-document-error: ') + options.message;
        }

        return levelType + chalk.underline.bold(options.meta.url) + '\n' +
          chalk.bold(options.meta.lastLine + ':' + options.meta.firstColumn) + '\t' + options.message + '\n' +
          'source: ' + options.meta.extract + '\n';
      }
    })
  ]
});

module.exports = opts => {
  let vnuCmd = `java -Xss1024k -jar ${vnuJar} `;

  const defaultOptions = {
    'errors-only': false,
    'format': 'gnu',
    'html': false,
    'no-stream': false,
    'verbose': false
  };

  const options = Object.assign(defaultOptions, opts);

  // Set options
  Object.keys(options).forEach(key => {
    const val = options[key];
    if (key === 'format' && val !== 'gnu') {
      vnuCmd += `--format ${val} `;
    }

    if (val === true) {
      vnuCmd += `--${key} `;
    }
  });

  function handleError(error, messages, path) {
    const parsedMessages = JSON.parse(messages).messages;

    if (error === null && parsedMessages.length === 0) {
      logger.log('success', 'Document is valid: ', { path });
    } else {
      parsedMessages.map(msg => {
        return logger.log(msg.type, msg.message, msg);
      });
    }
  }

  const stream = through.obj((file, enc, cb) => {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new PluginError('gulp-html', 'Streaming not supported'));
    }

    exec(vnuCmd + file.history, (err, stdout, stderr) => {
      if (options.format === 'json') {
        return cb(handleError(err, stderr, file.history[0]));
      }

      if (err === null) {
        return cb(null, file);
      }

      return cb(new PluginError('gulp-html', stderr));
    });
  });

  return stream;
};
