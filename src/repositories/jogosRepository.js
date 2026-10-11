// src/repositories/jogosRepository.js

const prisma = require('../config/prisma');

class JogosRepository {
  async criar(dados) {
    return prisma.jogo.create({
      data: {
        titulo: dados.titulo,
        anoLancamento: dados.anoLancamento,
        preco: dados.preco,
        descricao: dados.descricao,
        desconto: dados.desconto ?? 0,
        desenvolvedoraId: dados.desenvolvedoraId,
        generos: {
          create: (dados.generos || []).map((generoId) => ({ generoId })),
        },
        plataformas: {
          create: (dados.plataformas || []).map((plataformaId) => ({ plataformaId })),
        },
      },
      include: {
        desenvolvedora: true,
        generos: { include: { genero: true } },
        plataformas: { include: { plataforma: true } },
      },
    });
  }

  async listarTodos() {
    return prisma.jogo.findMany({
      where: { deletedAt: null },
      include: {
        desenvolvedora: true,
        generos: { include: { genero: true } },
        plataformas: { include: { plataforma: true } },
      },
      orderBy: { titulo: 'asc' },
    });
  }

  async buscarPorId(id) {
    return prisma.jogo.findFirst({
      where: { id: Number(id), deletedAt: null },
      include: {
        desenvolvedora: true,
        generos: { include: { genero: true } },
        plataformas: { include: { plataforma: true } },
        avaliacoes: {
          where: { deletedAt: null },
          select: { nota: true },
        },
      },
    });
  }

  async atualizar(id, dados) {
    const jogoId = Number(id);

    return prisma.$transaction(async (tx) => {
      // Recria as relações N:N
      await tx.jogoGenero.deleteMany({ where: { jogoId } });
      await tx.jogoPlataforma.deleteMany({ where: { jogoId } });

      return tx.jogo.update({
        where: { id: jogoId },
        data: {
          titulo: dados.titulo,
          anoLancamento: dados.anoLancamento,
          preco: dados.preco,
          descricao: dados.descricao,
          desconto: dados.desconto ?? 0,
          desenvolvedoraId: dados.desenvolvedoraId,
          generos: {
            create: (dados.generos || []).map((generoId) => ({ generoId })),
          },
          plataformas: {
            create: (dados.plataformas || []).map((plataformaId) => ({ plataformaId })),
          },
        },
        include: {
          desenvolvedora: true,
          generos: { include: { genero: true } },
          plataformas: { include: { plataforma: true } },
        },
      });
    });
  }

  async deletar(id) {
    // Soft delete
    return prisma.jogo.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  }

  async topAvaliados(limite = 5) {
    const jogos = await prisma.jogo.findMany({
      where: { deletedAt: null },
      include: {
        avaliacoes: {
          where: { deletedAt: null },
          select: { nota: true },
        },
      },
    });

    return jogos
      .map((j) => {
        const notas = j.avaliacoes.map((a) => a.nota);
        const total = notas.length;
        const media = total > 0 ? notas.reduce((s, n) => s + n, 0) / total : 0;
        return {
          id: j.id,
          titulo: j.titulo,
          mediaNota: Number(media.toFixed(2)),
          totalAvaliacoes: total,
        };
      })
      .filter((j) => j.totalAvaliacoes >= 1)
      .sort((a, b) => b.mediaNota - a.mediaNota || b.totalAvaliacoes - a.totalAvaliacoes)
      .slice(0, limite);
  }
}

module.exports = new JogosRepository();