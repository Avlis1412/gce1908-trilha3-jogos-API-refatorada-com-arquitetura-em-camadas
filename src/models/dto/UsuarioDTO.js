// src/models/dto/UsuarioDTO.js

class UsuarioDTO {
  /**
   * Converte os dados de entrada (request) em objeto de domínio
   */
  static toRequest(body) {
    return {
      nome: body.nome?.trim(),
      email: body.email?.trim().toLowerCase(),
      senha: body.senha,
      dataNascimento: body.dataNascimento ? new Date(body.dataNascimento) : null,
    };
  }

  /**
   * Converte o resultado do banco em resposta segura (sem senha)
   */
  static toResponse(usuario) {
    if (!usuario) return null;

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      dataNascimento: usuario.dataNascimento,
      criadoEm: usuario.criadoEm,
      atualizadoEm: usuario.atualizadoEm,
      // ⚠️ NUNCA retornar senha
    };
  }

  /**
   * Converte lista de usuários
   */
  static toResponseList(usuarios) {
    return usuarios.map((u) => UsuarioDTO.toResponse(u));
  }
}

module.exports = UsuarioDTO;