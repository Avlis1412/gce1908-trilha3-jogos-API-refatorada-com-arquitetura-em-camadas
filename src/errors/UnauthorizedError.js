// src/errors/UnauthorizedError.js

const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message = 'Acesso não autorizado') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;