// src/routes/jogosRoutes.js

const express = require('express');
const router = express.Router();
const jogosController = require('../controllers/jogosController');

// ⚠️ Rotas fixas ANTES das parametrizadas
router.get('/top-avaliados', jogosController.topAvaliados);

router.get('/', jogosController.listarTodos);
router.post('/', jogosController.criar);
router.get('/:id', jogosController.buscarPorId);
router.put('/:id', jogosController.atualizar);
router.delete('/:id', jogosController.deletar);

module.exports = router;