// src/config/prisma.js
// Padrão Singleton: garante instância única do Prisma Client

const { PrismaClient } = require('@prisma/client');

let instancia = null;

class PrismaSingleton {
  static getInstance() {
    if (!instancia) {
      instancia = new PrismaClient({
        log: process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
      });
    }
    return instancia;
  }

  /**
   * Fecha a conexão (usar em shutdown gracioso)
   */
  static async disconnect() {
    if (instancia) {
      await instancia.$disconnect();
      instancia = null;
    }
  }
}

module.exports = PrismaSingleton.getInstance();