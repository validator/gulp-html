'use strict';

const { execFile } = require('child_process');
const pc = require('picocolors');
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

module.exports = opts => {
  let vnuArgs = ['-Xss1024k', `-jar ${vnuJar}`];

  const defaultOptions = {
    'errors-only': false,
    'format': 'gnu',
    'html': false,
    'no-stream': false,
    'verbose': false
  };

  const options = { ...defaultOptions, ...opts };

  // Set options
  for (const key of Object.keys(options)) {
    const value = options[key];
    if (key === 'format' && value !== 'gnu') {
      vnuArgs = [...vnuArgs, `--format ${value}`];
    }

    if (value === true) {
      vnuArgs = [...vnuArgs, `--${key}`];
    }
  }

  function handleError(error, messages, path) {
    const parsedMessages = JSON.parse(messages).messages;

    if (error === null && parsedMessages.length === 0) {
      return logger.log('success', 'Document is valid: ', { path });
    }

    parsedMessages.map(message => {
      return logger.log(message.type, message.message, message);
    });
  }

  const stream = through.obj((file, enc, cb) => {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new PluginError('gulp-html', 'Streaming not supported'));
    }

    vnuArgs = [...vnuArgs, file.history];

    execFile('java', vnuArgs, { shell: true }, (err, stdout, stderr) => {
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
