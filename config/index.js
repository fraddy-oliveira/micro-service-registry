const bunyan = require('bunyan');

// Load package.json and Get some meta info from the package.json
const { name, version } = require('../package.json');

// Set up a logger
const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

// Configuration options
module.exports = {
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3000,
  name,
  version,
  serviceTimeout: process.env.SERVICE_TIMEOUT,
  log: () => getLogger(name, version, process.env.LOG_LEVEL),
};
