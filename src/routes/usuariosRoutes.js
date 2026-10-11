// src/routes/usuariosRoutes.js

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/', usuariosController.listarTodos);
router.post('/', usuariosController.criar);
router.get('/:id', usuariosController.buscarPorId);
router.get('/:id/biblioteca', usuariosController.biblioteca);   // ← adicionada
router.put('/:id', usuariosController.atualizar);
router.delete('/:id', usuariosController.deletar);

module.exports = router;