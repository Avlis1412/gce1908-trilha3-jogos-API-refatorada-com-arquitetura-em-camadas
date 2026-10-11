// src/models/dto/GeneroDTO.js

class GeneroDTO {
  static toRequest(body) {
    return {
      nome: body.nome?.trim(),
    };
  }

  static toResponse(genero) {
    if (!genero) return null;

    return {
      id: genero.id,
      nome: genero.nome,
    };
  }

  static toResponseList(generos) {
    return generos.map((g) => GeneroDTO.toResponse(g));
  }
}

module.exports = GeneroDTO;