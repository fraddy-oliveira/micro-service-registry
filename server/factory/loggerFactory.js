const BunyanLogger = require('../lib/BunyanLogger');

const Logger = require('../lib/Logger');

const { name, version, logLevel } = require('../../config/app');

function createProxy(abstractObj = {}, lowerLevelObj = {}, options = { handler: {} }) {
  let handler = options && options.handler ? options.handler : {};

  handler = {
    get: (target, props) => {
      if (lowerLevelObj[props]) {
        return lowerLevelObj[props];
      }
      return target[props];
    },
    set(target, propertyKey, value, receiver) {
      return Reflect.set(target, propertyKey, value, receiver);
    },
  };

  return new Proxy(abstractObj, handler);
}

class LoggerFactory {
  static createLogger() {
    const loggerName = `${name}:${version}`;

    const bunyan = BunyanLogger.buildLogger({ name: loggerName, level: logLevel });

    const logger = new Logger(bunyan);

    return createProxy(logger, bunyan);
  }
}

module.exports = LoggerFactory;
