// src/models/dto/BibliotecaDTO.js

class BibliotecaDTO {
  static toRequest(body) {
    return {
      usuarioId: parseInt(body.usuarioId),
      jogoId: parseInt(body.jogoId),
    };
  }

  static toResponse(biblioteca) {
    if (!biblioteca) return null;

    return {
      id: biblioteca.id,
      usuario: biblioteca.usuario?.nome || null,
      jogo: biblioteca.jogo?.titulo || null,
      adquiridoEm: biblioteca.adquiridoEm,
    };
  }

  static toResponseList(itens) {
    return itens.map((i) => BibliotecaDTO.toResponse(i));
  }
}

module.exports = BibliotecaDTO;