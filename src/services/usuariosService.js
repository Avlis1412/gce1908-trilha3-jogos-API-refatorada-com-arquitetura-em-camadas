// src/services/usuariosService.js

const UsuarioDTO = require('../models/dto/UsuarioDTO');
const Validators = require('../utils/validators');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { MENSAGENS } = require('../utils/constants');

class UsuariosService {
  constructor(usuariosRepository) {
    this.usuariosRepository = usuariosRepository;
  }

  async criar(body) {
    const dados = UsuarioDTO.toRequest(body);
    if (!Validators.isNotEmpty(dados.nome)) {
      throw new ValidationError('Nome é obrigatório');
    }
    if (!Validators.isEmail(dados.email)) {
      throw new ValidationError('E-mail inválido');
    }
    const usuario = await this.usuariosRepository.criar({
      nome: dados.nome,
      email: dados.email,
    });
    return UsuarioDTO.toResponse(usuario);
  }

  async listarTodos() {
    const usuarios = await this.usuariosRepository.listar();
    return UsuarioDTO.toResponseList(usuarios);
  }

  async buscarPorId(id) {
    const usuario = await this.usuariosRepository.buscarPorId(id);
    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }
    return UsuarioDTO.toResponse(usuario);
  }

  async atualizar(id, body) {
    await this.buscarPorId(id);
    const dados = UsuarioDTO.toRequest(body);
    if (!Validators.isNotEmpty(dados.nome)) {
      throw new ValidationError('Nome é obrigatório');
    }
    if (!Validators.isEmail(dados.email)) {
      throw new ValidationError('E-mail inválido');
    }
    const usuario = await this.usuariosRepository.atualizar(id, {
      nome: dados.nome,
      email: dados.email,
    });
    return UsuarioDTO.toResponse(usuario);
  }

  async deletar(id) {
    await this.buscarPorId(id);
    await this.usuariosRepository.remover(id);
    return { mensagem: MENSAGENS.DELETADO_SUCESSO };
  }

  async biblioteca(id) {
    await this.buscarPorId(id);
    return this.usuariosRepository.biblioteca(id);
  }
}

module.exports = UsuariosService;