require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./src/routes');
const { connectDB, getDbMeta } = require('./src/config/database');
const { syncModels } = require('./src/models');
const { seedMembersFromExcelIfEmpty } = require('./src/services/memberImport.service');
const {
  globalLimiter,
  securityHeaders,
  sanitizeInput,
  hppMiddleware,
} = require('./src/middleware/security');

const app = express();

const allowedOrigins = String(process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

app.set('trust proxy', 1);

app.use(securityHeaders);
app.use(globalLimiter);
app.use(hppMiddleware);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(sanitizeInput);

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Perluni API',
    version: '2.1.0',
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
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS blocked this origin',
    });
  }

  console.error(err.stack);
  return res.status(500).json({
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
