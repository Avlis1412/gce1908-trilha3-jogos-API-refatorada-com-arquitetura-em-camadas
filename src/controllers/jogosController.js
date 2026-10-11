// src/controllers/jogosController.js

const ServiceFactory = require('../factories/ServiceFactory');

class JogosController {
  constructor() {
    this.jogosService = ServiceFactory.criarJogosService();
  }

  criar = async (req, res, next) => {
    try {
      const jogo = await this.jogosService.criar(req.body);
      return res.status(201).json(jogo);
    } catch (error) {
      next(error);
    }
  };

  listarTodos = async (req, res, next) => {
    try {
      const jogos = await this.jogosService.listarTodos();
      return res.json(jogos);
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const jogo = await this.jogosService.buscarPorId(req.params.id);
      return res.json(jogo);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req, res, next) => {
    try {
      const jogo = await this.jogosService.atualizar(req.params.id, req.body);
      return res.json(jogo);
    } catch (error) {
      next(error);
    }
  };

  deletar = async (req, res, next) => {
    try {
      const resultado = await this.jogosService.deletar(req.params.id);
      return res.json(resultado);
    } catch (error) {
      next(error);
    }
  };

  topAvaliados = async (req, res, next) => {
    try {
      const limite = req.query.limit ? Number(req.query.limit) : 5;
      const jogos = await this.jogosService.topAvaliados(limite);
      return res.json(jogos);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new JogosController();