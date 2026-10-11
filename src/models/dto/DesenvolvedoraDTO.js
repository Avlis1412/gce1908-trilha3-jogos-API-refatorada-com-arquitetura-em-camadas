// src/models/dto/DesenvolvedoraDTO.js

class DesenvolvedoraDTO {
  static toRequest(body) {
    return {
      nome: body.nome?.trim(),
      pais: body.pais?.trim(),
    };
  }

  static toResponse(desenvolvedora) {
    if (!desenvolvedora) return null;

    return {
      id: desenvolvedora.id,
      nome: desenvolvedora.nome,
      pais: desenvolvedora.pais,
    };
  }

  static toResponseList(desenvolvedoras) {
    return desenvolvedoras.map((d) => DesenvolvedoraDTO.toResponse(d));
  }
}

module.exports = DesenvolvedoraDTO;