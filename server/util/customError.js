/** This class manages custom errors */
class ValidationError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.kind = 'ValidationError';
  }
}

module.exports = {
  ValidationError,
};
