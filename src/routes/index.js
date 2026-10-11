// src/routes/index.js

const { Router } = require('express');

const jogosRoutes = require('./jogosRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const avaliacoesRoutes = require('./avaliacoesRoutes');

const router = Router();

// Rota raiz (health check)
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    mensagem: 'API gce1908-trilha3-jogos está no ar 🎮',
    versao: '2.0.0 (MVC)',
    endpoints: {
      jogos: '/api/jogos',
      usuarios: '/api/usuarios',
      avaliacoes: '/api/avaliacoes',
    },
  });
});

// Rotas da aplicação
router.use('/jogos', jogosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/avaliacoes', avaliacoesRoutes);

module.exports = router;