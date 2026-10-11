// src/server.js
// Apenas inicia o servidor. A configuração do Express está em app.js

require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('===============================================================');
  console.log('  🎮 API gce1908-trilha3-jogos (MVC)');
  console.log('===============================================================');
  console.log(`  🚀 Servidor rodando na porta ${PORT}`);
  console.log(`  🔗 http://localhost:${PORT}/api`);
  console.log(`  🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('===============================================================');
  console.log('');
});

// ------------------------------------------------------------
// Shutdown gracioso (fechar conexões ao encerrar)
// ------------------------------------------------------------
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM recebido. Encerrando...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});

module.exports = server;