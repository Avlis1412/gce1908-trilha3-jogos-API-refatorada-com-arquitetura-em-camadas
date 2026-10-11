// src/services/avaliacoesService.js

class AvaliacoesService {
  constructor(avaliacoesRepository, jogosRepository) {
    this.avaliacoesRepository = avaliacoesRepository;
    this.jogosRepository = jogosRepository;
  }

  async registrar(dados) {
    return this.avaliacoesRepository.registrar(dados);
  }

  async listarPorJogo(jogoId) {
    return this.avaliacoesRepository.listarPorJogo(jogoId);
  }
}

module.exports = AvaliacoesService;