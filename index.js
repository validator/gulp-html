var exec = require('child_process').exec;
var through = require('through2');
var gutil = require('gulp-util');
var merge = require('merge');
var PluginError = gutil.PluginError;
const chalk = require('chalk');
var winston = require('winston');

var vnuErrorLevels = {
    levels: {
        'success': 0,
        'error': 1,
        'info': 2,
        'non-document-error': 3,
    },
    colors: {
        'success': 'green',
        'error': 'red',
        'info': 'yellow',
        'non-document-error': 'black'
    }
};

const logger = new (winston.Logger)({
    levels: vnuErrorLevels.levels,
    transports: [
        new (winston.transports.Console)({
            formatter: function(options) {
                var levelType = '';
                // Return string will be passed to logger.
                if(options.level === 'error') {
                    levelType = chalk.red('error: ');
                }
                else if(options.level === 'info') {
                    levelType = chalk.yellow('warning: ');
                }
                else if(options.level === 'success') {
                    return chalk.green(options.message) + chalk.underline.bold(options.meta.path) + '\n';
                }
                else {
                    return chalk.bold('non-document-error: ') + options.message;
                }

                return  levelType + chalk.underline.bold(options.meta.url) + '\n' +
                    chalk.bold(options.meta.lastLine + ':' + options.meta.firstColumn) + '\t' + options.message + '\n' +
                    'source: ' + options.meta.extract + '\n';
            }
        })
    ]
});

module.exports = function(opt) {
    var vnu = 'java -jar ' + __dirname + '/vnu/vnu.jar ';

    var options = merge({
        'errors-only': false,
        'format': 'gnu',
        'html': false,
        'no-stream': false,
        'verbose': false,
    }, opt);

    // Set options
    Object.keys(options).forEach(function (key) {
        var val = options[key];
        if (key === 'format' && val !== 'gnu') vnu += '--format ' + val + ' ';
        if (val === true) vnu += '--' + key + ' ';
    });

    function handleError (error, messages, path) {
        var parsedMessages = JSON.parse(messages).messages;

        if(error === null && !parsedMessages.length) {

            logger.log('success', 'Document is valid: ', {path: path});
        }
        else {
            parsedMessages.map(function(msg) {
                logger.log(msg.type, msg.message, msg);
            });
        }
    }

    var stream  = through.obj(function(file, enc, cb) {
        if (file.isNull()) return cb(null, file);
        if (file.isStream()) {
            return cb(new PluginError('gulp-html', 'Streaming not supported'));
        }

        exec(vnu + file.history, function (err, stdout, stderr) {
            return cb(handleError(err, stderr, file.history[0]));
        });
    });

    return stream;
};
