// src/app.js
// Configuração do Express (middlewares, rotas, tratamento de erros)
// NÃO inicia o servidor — isso é responsabilidade do server.js

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  /**
   * Middlewares globais (executados em toda requisição)
   */
  middlewares() {
    // Habilita CORS (permite requisições de outros domínios)
    this.server.use(cors());

    // Habilita parsing de JSON no body das requisições
    this.server.use(express.json());

    // Habilita parsing de dados de formulário (urlencoded)
    this.server.use(express.urlencoded({ extended: true }));

    // Log simples de requisições (útil em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      this.server.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
      });
    }
  }

  /**
   * Rotas da aplicação (todas prefixadas com /api)
   */
  routes() {
    this.server.use('/api', routes);
  }

  /**
   * Tratamento de erros (deve ser o ÚLTIMO middleware)
   */
  errorHandling() {
    this.server.use(errorHandler);
  }
}

module.exports = new App().server;