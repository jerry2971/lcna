var winston = require('winston');
var fs = require('fs');

let log_config =JSON.parse(fs.readFileSync('./config/log_config.json', 'utf8'));
// let Rollbar = require('winston-transport-rollbar-3');

log_config.rollbar_option.rollbarConfig.payload={'fingerprint':'main_info'};

// instantiate a new Winston Logger with the settings defined above
let option =[new winston.transports.File(log_config.winston_options.file_app),
             new winston.transports.Console(log_config.winston_options.console)];
//             new Rollbar(log_config.rollbar_option

let logger = winston.createLogger({
  transports:option,
  exitOnError: false // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by 'morgan'
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

module.exports = logger;
