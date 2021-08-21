'use strict';

const { execFile } = require('child_process');
const pc = require('picocolors');
const PluginError = require('plugin-error');
const through = require('through2');
const vnuJar = require('vnu-jar');
const winston = require('winston');

const defaultOptions = {
  'errors-only': false,
  'format': 'gnu',
  'html': false,
  'no-stream': false,
  'verbose': false
};

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
        switch (options.level) {
          case 'error': {
            levelType = pc.red('error: ');
            break;
          }

          case 'info': {
            levelType = pc.yellow('warning: ');
            break;
          }

          case 'success': {
            return `${pc.green(options.message) + pc.underline(pc.bold(options.meta.path))}\n`;
          }

          default: {
            return pc.bold('non-document-error: ') + options.message;
          }
        }

        return levelType + pc.underline(pc.bold(options.meta.url)) + '\n' +
          pc.bold(options.meta.lastLine + ':' + options.meta.firstColumn) + '\t' + options.message + '\n' +
          'source: ' + options.meta.extract + '\n';
      }
    })
  ]
});

const handleJsonError = (error, messages, path) => {
  const parsedMessages = JSON.parse(messages).messages;

  if (error === null && parsedMessages.length === 0) {
    return logger.log('success', 'Document is valid: ', { path });
  }

  return parsedMessages.map(message => logger.log(message.type, message.message, message));
};

module.exports = options => {
  const vnuArgs = ['-Xss1024k', '-jar', `"${vnuJar}"`];
  const mergedOptions = { ...defaultOptions, ...options };

  // Set options
  for (const [key, value] of Object.entries(mergedOptions)) {
    if (key === 'format' && value !== 'gnu') {
      vnuArgs.push('--format', value);
    }

    if (value === true) {
      vnuArgs.push(`--${key}`);
    }
  }

  return through.obj((file, enc, cb) => {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new PluginError('gulp-html', 'Streaming not supported'));
    }

    vnuArgs.push(file.history.map(f => `"${f}"`));

    execFile('java', vnuArgs, { shell: true }, (error, stdout, stderr) => {
      if (mergedOptions.format === 'json') {
        return cb(handleJsonError(error, stderr, file.history[0]));
      }

      return error === null ?
        cb(null, file) :
        cb(new PluginError('gulp-html', stderr));
    });
  });
};
