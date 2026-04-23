const { Sequelize, Op } = require('sequelize');

const DIALECT = process.env.DB_DIALECT || 'postgres';
const DB_LOGGING = process.env.DB_LOGGING === 'true';
const DB_SSL = process.env.DB_SSL === 'true';

const buildSequelizeInstance = () => {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: DIALECT,
      logging: DB_LOGGING ? console.log : false,
      dialectOptions: DB_SSL
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    });
  }

  return new Sequelize(
    process.env.DB_NAME || 'perluni_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || (DIALECT === 'mysql' ? 3306 : 5432)),
      dialect: DIALECT,
      logging: DB_LOGGING ? console.log : false,
      dialectOptions: DB_SSL
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    }
  );
};

const sequelize = buildSequelizeInstance();

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ ${DIALECT.toUpperCase()} connected successfully`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    throw error;
  }
};

const getLikeOperator = () => (DIALECT === 'postgres' ? Op.iLike : Op.like);

const getDbMeta = () => ({
  dialect: DIALECT,
  database: process.env.DB_NAME || (process.env.DATABASE_URL ? 'from DATABASE_URL' : 'perluni_db'),
});

module.exports = {
  sequelize,
  Op,
  connectDB,
  getLikeOperator,
  getDbMeta,
};
