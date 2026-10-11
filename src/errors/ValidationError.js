// src/errors/ValidationError.js

const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(message = 'Dados inválidos') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;