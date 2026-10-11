// src/models/dto/JogoDTO.js

class JogoDTO {
  static toRequest(body) {
    return {
      titulo: body.titulo?.trim(),
      descricao: body.descricao?.trim(),
      preco: parseFloat(body.preco) || 0,
      desconto: parseFloat(body.desconto) || 0,
      desenvolvedoraId: body.desenvolvedoraId ? parseInt(body.desenvolvedoraId) : null,
      generos: Array.isArray(body.generos) ? body.generos.map(Number) : [],
      plataformas: Array.isArray(body.plataformas) ? body.plataformas.map(Number) : [],
    };
  }

  static toResponse(jogo) {
    if (!jogo) {return null;}

    const precoFinal = jogo.preco - (jogo.preco * jogo.desconto) / 100;

    return {
      id: jogo.id,
      titulo: jogo.titulo,
      descricao: jogo.descricao,
      preco: jogo.preco,
      desconto: jogo.desconto,
      precoFinal: parseFloat(precoFinal.toFixed(2)),
      desenvolvedora: jogo.desenvolvedora?.nome || null,
      generos: jogo.generos?.map((g) => g.genero?.nome) || [],
      plataformas: jogo.plataformas?.map((p) => p.plataforma?.nome) || [],
      criadoEm: jogo.criadoEm,
      atualizadoEm: jogo.atualizadoEm,
    };
  }

  static toResponseList(jogos) {
    return jogos.map((j) => JogoDTO.toResponse(j));
  }
}

module.exports = JogoDTO;