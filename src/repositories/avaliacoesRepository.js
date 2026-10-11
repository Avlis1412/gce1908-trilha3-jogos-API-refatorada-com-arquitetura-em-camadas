// src/repositories/avaliacoesRepository.js

const prisma = require('../config/prisma');

module.exports = {
  async registrar({ usuarioId, jogoId, nota, comentario }) {
    // Transação: valida usuário e jogo, depois faz UPSERT
    return prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.findFirst({
        where: { id: Number(usuarioId), deletedAt: null },
      });
      if (!usuario) {
        const err = new Error('Usuário não encontrado');
        err.statusCode = 404;
        throw err;
      }

      const jogo = await tx.jogo.findFirst({
        where: { id: Number(jogoId), deletedAt: null },
      });
      if (!jogo) {
        const err = new Error('Jogo não encontrado');
        err.statusCode = 404;
        throw err;
      }

      return tx.avaliacao.upsert({
        where: {
          usuarioId_jogoId: {
            usuarioId: Number(usuarioId),
            jogoId: Number(jogoId),
          },
        },
        update: { nota, comentario, deletedAt: null },
        create: { usuarioId: Number(usuarioId), jogoId: Number(jogoId), nota, comentario },
        include: {
          usuario: { select: { id: true, nome: true } },
          jogo: { select: { id: true, titulo: true } },
        },
      });
    });
  },

  async listarPorJogo(jogoId) {
    return prisma.avaliacao.findMany({
      where: { jogoId: Number(jogoId), deletedAt: null },
      include: {
        usuario: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};