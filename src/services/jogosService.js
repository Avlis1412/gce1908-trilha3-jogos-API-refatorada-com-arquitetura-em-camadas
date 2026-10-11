// src/services/jogosService.js

const JogoDTO = require('../models/dto/JogoDTO');
const Validators = require('../utils/validators');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { REGRAS, MENSAGENS } = require('../utils/constants');

class JogosService {
  constructor(jogosRepository) {
    this.jogosRepository = jogosRepository;
  }

  async criar(body) {
    const dados = JogoDTO.toRequest(body);

    if (!Validators.isNotEmpty(dados.titulo)) {
      throw new ValidationError('Título é obrigatório');
    }
    if (!Validators.isNaoNegativo(dados.preco)) {
      throw new ValidationError('Preço não pode ser negativo');
    }
    if (!Validators.isDescontoValido(dados.desconto)) {
      throw new ValidationError(
        `Desconto deve estar entre ${REGRAS.DESCONTO_MINIMO} e ${REGRAS.DESCONTO_MAXIMO}%`,
      );
    }

    const jogo = await this.jogosRepository.criar(dados);
    return JogoDTO.toResponse(jogo);
  }

  async listarTodos() {
    const jogos = await this.jogosRepository.listarTodos();
    return JogoDTO.toResponseList(jogos);
  }

  async buscarPorId(id) {
    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      throw new ValidationError('ID inválido');
    }
    const jogo = await this.jogosRepository.buscarPorId(idNum);
    if (!jogo) {
      throw new NotFoundError('Jogo não encontrado');
    }
    return JogoDTO.toResponse(jogo);
  }

  async atualizar(id, body) {
    await this.buscarPorId(id);
    const dados = JogoDTO.toRequest(body);

    if (!Validators.isNotEmpty(dados.titulo)) {
      throw new ValidationError('Título é obrigatório');
    }
    if (!Validators.isNaoNegativo(dados.preco)) {
      throw new ValidationError('Preço não pode ser negativo');
    }
    if (!Validators.isDescontoValido(dados.desconto)) {
      throw new ValidationError(
        `Desconto deve estar entre ${REGRAS.DESCONTO_MINIMO} e ${REGRAS.DESCONTO_MAXIMO}%`,
      );
    }

    const jogo = await this.jogosRepository.atualizar(id, dados);
    return JogoDTO.toResponse(jogo);
  }

  async deletar(id) {
    await this.buscarPorId(id);
    await this.jogosRepository.deletar(id);
    return { mensagem: MENSAGENS.DELETADO_SUCESSO };
  }

  async topAvaliados(limite = 5) {
    return this.jogosRepository.topAvaliados(limite);
  }
}

module.exports = JogosService;