const bunyan = require('bunyan');

const { name, version, logLevel } = require('../../config');

const createLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

const logger = () => createLogger(name, version, logLevel);

module.exports = { logger };
