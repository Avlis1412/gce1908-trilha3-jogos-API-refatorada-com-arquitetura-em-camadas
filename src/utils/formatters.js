// src/utils/formatters.js

class Formatters {
  /**
   * Formata valor numérico como moeda brasileira
   */
  static moeda(valor) {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  /**
   * Formata data no padrão brasileiro
   */
  static data(data) {
    if (!data) return null;
    return new Date(data).toLocaleDateString('pt-BR');
  }

  /**
   * Formata data e hora
   */
  static dataHora(data) {
    if (!data) return null;
    return new Date(data).toLocaleString('pt-BR');
  }

  /**
   * Trunca texto longo
   */
  static truncar(texto, tamanho = 100) {
    if (!texto) return '';
    return texto.length > tamanho ? texto.substring(0, tamanho) + '...' : texto;
  }

  /**
   * Remove acentos de uma string
   */
  static removerAcentos(texto) {
    if (!texto) return '';
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}

module.exports = Formatters;