// src/factories/ServiceFactory.js

const JogosRepository = require('../repositories/jogosRepository');
const UsuariosRepository = require('../repositories/usuariosRepository');
const AvaliacoesRepository = require('../repositories/avaliacoesRepository');

const JogosService = require('../services/jogosService');
const UsuariosService = require('../services/usuariosService');
const AvaliacoesService = require('../services/avaliacoesService');

class ServiceFactory {
  static criarJogosService() {
    return new JogosService(JogosRepository);
  }

  static criarUsuariosService() {
    return new UsuariosService(UsuariosRepository);
  }

  static criarAvaliacoesService() {
    return new AvaliacoesService(AvaliacoesRepository, JogosRepository);
  }
}

module.exports = ServiceFactory;