// src/middlewares/errorHandler.js

const AppError = require('../errors/AppError');
const { HTTP, MENSAGENS } = require('../utils/constants');

function errorHandler(err, req, res, next) {
  // Log SEMPRE — ajuda a diagnosticar em qualquer ambiente
  console.error('❌ Erro capturado:', err);
  console.error('❌ Stack:', err.stack);

  // Erros customizados da aplicação
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      tipo: err.name,
      message: err.message,
    });
  }

  // Erros do Prisma
  if (err.code === 'P2002') {
    return res.status(HTTP.CONFLICT).json({
      status: 'error',
      tipo: 'ConflictError',
      message: 'Registro duplicado. Já existe um registro com esses dados.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(HTTP.NOT_FOUND).json({
      status: 'error',
      tipo: 'NotFoundError',
      message: 'Registro não encontrado.',
    });
  }

  if (err.code === 'P2003') {
    return res.status(HTTP.BAD_REQUEST).json({
      status: 'error',
      tipo: 'ForeignKeyError',
      message: 'Referência inválida. Verifique os IDs informados.',
    });
  }

  // Erro genérico
  return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    tipo: 'InternalServerError',
    message: MENSAGENS.ERRO_INTERNO,
    stack: err.stack,
  });
}

module.exports = errorHandler;