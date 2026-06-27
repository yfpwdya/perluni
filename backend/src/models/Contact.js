const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Contact extends Model {}

Contact.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
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
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Format email tidak valid',
        },
      },
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Subjek wajib diisi' },
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
    status: {
      type: DataTypes.ENUM('new', 'read'),
      allowNull: false,
      defaultValue: 'new',
    },
  },
  {
    sequelize,
    modelName: 'Contact',
    tableName: 'contacts',
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ['status'] }, { fields: ['created_at'] }],
  }
);

module.exports = Contact;
