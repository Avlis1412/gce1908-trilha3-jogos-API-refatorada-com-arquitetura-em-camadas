// src/utils/constants.js

module.exports = {
  // HTTP Status Codes
  HTTP: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Regras de negócio
  REGRAS: {
    NOTA_MINIMA: 0,
    NOTA_MAXIMA: 10,
    DESCONTO_MINIMO: 0,
    DESCONTO_MAXIMO: 90,
    PRECO_MINIMO: 0,
    SENHA_MINIMA: 6,
  },

  // Mensagens padronizadas
  MENSAGENS: {
    NAO_ENCONTRADO: 'Recurso não encontrado',
    DADOS_INVALIDOS: 'Dados inválidos',
    NAO_AUTORIZADO: 'Acesso não autorizado',
    ERRO_INTERNO: 'Erro interno do servidor',
    CRIADO_SUCESSO: 'Recurso criado com sucesso',
    ATUALIZADO_SUCESSO: 'Recurso atualizado com sucesso',
    DELETADO_SUCESSO: 'Recurso removido com sucesso',
  },
};