const bunyan = require('bunyan');

const BunyanLogger = bunyan;

BunyanLogger.buildLogger = (options = {}) => {
  const { name } = (options); //  Logger name

  if (typeof name !== 'string') {
    throw new Error('Logger name is should be string');
  } else if (String(name).trim() === '') {
    throw new Error('Logger name is required');
  }

  return bunyan.createLogger(options);
};

module.exports = BunyanLogger;
