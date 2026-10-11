// src/controllers/avaliacoesController.js

const ServiceFactory = require('../factories/ServiceFactory');

class AvaliacoesController {
  constructor() {
    this.avaliacoesService = ServiceFactory.criarAvaliacoesService();
  }

  registrar = async (req, res, next) => {
    try {
      const avaliacao = await this.avaliacoesService.registrar(req.body);
      return res.status(201).json(avaliacao);
    } catch (error) {
      next(error);
    }
  };

  listarPorJogo = async (req, res, next) => {
    try {
      const avaliacoes = await this.avaliacoesService.listarPorJogo(req.params.jogoId);
      return res.json(avaliacoes);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AvaliacoesController();