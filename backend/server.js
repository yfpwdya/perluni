require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const { connectDB, getDbMeta } = require('./src/config/database');
const { syncModels } = require('./src/models');
const { seedMembersFromExcelIfEmpty } = require('./src/services/memberImport.service');

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Perluni API',
    version: '2.0.0',
    documentation: '/api/health',
    database: getDbMeta(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await syncModels();
  await seedMembersFromExcelIfEmpty();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
