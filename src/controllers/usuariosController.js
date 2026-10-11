// src/controllers/usuariosController.js

const ServiceFactory = require('../factories/ServiceFactory');

class UsuariosController {
  constructor() {
    this.usuariosService = ServiceFactory.criarUsuariosService();
  }

  criar = async (req, res, next) => {
    try {
      const usuario = await this.usuariosService.criar(req.body);
      return res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  listarTodos = async (req, res, next) => {
    try {
      const usuarios = await this.usuariosService.listarTodos();
      return res.json(usuarios);
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const usuario = await this.usuariosService.buscarPorId(req.params.id);
      return res.json(usuario);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req, res, next) => {
    try {
      const usuario = await this.usuariosService.atualizar(req.params.id, req.body);
      return res.json(usuario);
    } catch (error) {
      next(error);
    }
  };

  deletar = async (req, res, next) => {
    try {
      const resultado = await this.usuariosService.deletar(req.params.id);
      return res.json(resultado);
    } catch (error) {
      next(error);
    }
  };

  biblioteca = async (req, res, next) => {
    try {
      const itens = await this.usuariosService.biblioteca(req.params.id);
      return res.json(itens);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new UsuariosController();