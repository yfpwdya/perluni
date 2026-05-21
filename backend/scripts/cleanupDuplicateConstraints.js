require('dotenv').config();
const { sequelize } = require('../src/config/database');

const cleanupDuplicateConstraints = async () => {
  const transaction = await sequelize.transaction();

  try {
    const [rows] = await sequelize.query(
      `
      WITH ranked AS (
        SELECT
          c.oid,
          n.nspname AS schema_name,
          rel.relname AS table_name,
          c.conname,
          c.contype,
          pg_get_constraintdef(c.oid) AS definition,
          row_number() OVER (
            PARTITION BY c.conrelid, c.contype, pg_get_constraintdef(c.oid)
            ORDER BY c.oid
          ) AS rn
        FROM pg_constraint c
        JOIN pg_class rel ON rel.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = rel.relnamespace
        WHERE n.nspname = 'public'
          AND c.contype IN ('u')
      )
      SELECT schema_name, table_name, conname
      FROM ranked
      WHERE rn > 1
      ORDER BY table_name, conname;
      `,
      { transaction }
    );

    if (!rows.length) {
      await transaction.commit();
      console.log('✅ No duplicate unique constraints found.');
      return;
    }

    for (const row of rows) {
      const sql = `ALTER TABLE "${row.schema_name}"."${row.table_name}" DROP CONSTRAINT IF EXISTS "${row.conname}";`;
      await sequelize.query(sql, { transaction });
      console.log(`🧹 Dropped duplicate constraint: ${row.table_name}.${row.conname}`);
    }

    await transaction.commit();
    console.log(`✅ Cleanup completed. Dropped ${rows.length} duplicate constraints.`);
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Failed to cleanup duplicate constraints:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

cleanupDuplicateConstraints();
