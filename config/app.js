// Load package.json and Get some meta info from the package.json
const { name, version } = require('../package.json');

// Configuration options
module.exports = {
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3000,
  name,
  version,
  logLevel: process.env.LOG_LEVEL,
};
