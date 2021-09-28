class Logger {
  constructor(logger) {
    if (!logger) {
      throw new Error('Logger needs implementation object.');
    }

    this.logger = logger;
  }
}

module.exports = Logger;
