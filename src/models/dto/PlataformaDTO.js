// src/models/dto/PlataformaDTO.js

class PlataformaDTO {
  static toRequest(body) {
    return {
      nome: body.nome?.trim(),
    };
  }

  static toResponse(plataforma) {
    if (!plataforma) return null;

    return {
      id: plataforma.id,
      nome: plataforma.nome,
    };
  }

  static toResponseList(plataformas) {
    return plataformas.map((p) => PlataformaDTO.toResponse(p));
  }
}

module.exports = PlataformaDTO;