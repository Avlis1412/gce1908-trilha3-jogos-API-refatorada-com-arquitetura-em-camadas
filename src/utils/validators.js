// src/utils/validators.js

class Validators {
  /**
   * Valida formato de email
   */
  static isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Valida CPF (formato e dígitos verificadores)
   */
  static isCPF(cpf) {
    if (!cpf) {return false;}
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {return false;}
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {return false;}

    let soma = 0;
    for (let i = 0; i < 9; i++) {soma += parseInt(cpfLimpo[i]) * (10 - i);}
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {resto = 0;}
    if (resto !== parseInt(cpfLimpo[9])) {return false;}

    soma = 0;
    for (let i = 0; i < 10; i++) {soma += parseInt(cpfLimpo[i]) * (11 - i);}
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {resto = 0;}
    if (resto !== parseInt(cpfLimpo[10])) {return false;}

    return true;
  }

  /**
   * Valida se é número positivo
   */
  static isPositivo(valor) {
    return typeof valor === 'number' && valor > 0;
  }

  /**
   * Valida se é número não-negativo (≥ 0)
   */
  static isNaoNegativo(valor) {
    return typeof valor === 'number' && valor >= 0;
  }

  /**
   * Valida se string não está vazia
   */
  static isNotEmpty(texto) {
    return typeof texto === 'string' && texto.trim().length > 0;
  }

  /**
   * Valida nota (0 a 10)
   */
  static isNotaValida(nota) {
    return Number.isInteger(nota) && nota >= 0 && nota <= 10;
  }

  /**
   * Valida desconto (0 a 100)
   */
  static isDescontoValido(desconto) {
    return typeof desconto === 'number' && desconto >= 0 && desconto <= 100;
  }
}

module.exports = Validators;