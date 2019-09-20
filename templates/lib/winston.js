const winston = require('winston');
const fs = require('fs');

const LOG_CONFIG = JSON.parse(fs.readFileSync('./config/log.json', 'utf8'));
// const Rollbar = require('winston-transport-rollbar-3'); // if you want add log repository

// instantiate a new Winston Logger with the settings defined above
const option = [
  new winston.transports.File(LOG_CONFIG.winston_options.file_app),
  new winston.transports.Console(LOG_CONFIG.winston_options.console)
];
// new Rollbar(LOG_CONFIG.rollbar_option  // if you want add log repository

const logger = winston.createLogger({
  transports: option,
  exitOnError: false // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by 'morgan'
logger.stream = {
  write(message, encoding) {
    // use the 'info' log level so the output will be picked up
    // by both transports (file and console)
    logger.info(message);
  }
};

module.exports = logger;
