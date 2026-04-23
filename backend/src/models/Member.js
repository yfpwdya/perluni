const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Member extends Model {}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    origin: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    university: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    major: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    educationLevel: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'education_level',
    },
    entryYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'entry_year',
    },
    duration: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hospital: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    scholarshipType: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'scholarship_type',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('mahasiswa', 'alumni'),
      allowNull: false,
      defaultValue: 'mahasiswa',
    },
    sourceSheet: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'source_sheet',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    modelName: 'Member',
    tableName: 'members',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['category'] },
      { fields: ['source_sheet'] },
      {
        unique: true,
        fields: ['name', 'university', 'entry_year', 'category', 'source_sheet'],
        name: 'members_unique_identity_idx',
      },
    ],
  }
);

module.exports = Member;
