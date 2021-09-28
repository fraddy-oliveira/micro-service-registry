/**
 * Class representing a Logger.
 * @class
 */
class Logger {
  /**
   * Create a point.
   * @param {object} logger - reference to low level logger implementation.
   */
  constructor(logger) {
    if (!logger) {
      throw new Error('Logger needs implementation object.');
    }

    this.logger = logger;
  }
}

module.exports = Logger;
