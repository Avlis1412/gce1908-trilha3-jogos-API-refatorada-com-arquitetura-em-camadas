// src/models/dto/AvaliacaoDTO.js

class AvaliacaoDTO {
  static toRequest(body) {
    return {
      nota: parseInt(body.nota),
      comentario: body.comentario?.trim(),
      usuarioId: parseInt(body.usuarioId),
      jogoId: parseInt(body.jogoId),
    };
  }

  static toResponse(avaliacao) {
    if (!avaliacao) return null;

    return {
      id: avaliacao.id,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      usuario: avaliacao.usuario?.nome || null,
      jogo: avaliacao.jogo?.titulo || null,
      criadoEm: avaliacao.criadoEm,
    };
  }

  static toResponseList(avaliacoes) {
    return avaliacoes.map((a) => AvaliacaoDTO.toResponse(a));
  }
}

module.exports = AvaliacaoDTO;