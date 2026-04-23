const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Feedback extends Model {}

Feedback.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nama wajib diisi' },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Format email tidak valid',
        },
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Pesan wajib diisi' },
        len: {
          args: [5, 5000],
          msg: 'Pesan harus 5-5000 karakter',
        },
      },
    },
    sourcePage: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: 'homepage',
      field: 'source_page',
    },
    status: {
      type: DataTypes.ENUM('new', 'reviewed'),
      allowNull: false,
      defaultValue: 'new',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
    },
  },
  {
    sequelize,
    modelName: 'Feedback',
    tableName: 'feedbacks',
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ['status'] }, { fields: ['created_at'] }],
  }
);

module.exports = Feedback;
