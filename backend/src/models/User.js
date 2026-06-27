const bcrypt = require('bcryptjs');
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class User extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
        len: {
          args: [1, 100],
          msg: 'Name cannot exceed 100 characters',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please provide a valid email' },
      },
      set(value) {
        this.setDataValue('email', String(value || '').trim().toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [8, 255],
          msg: 'Password must be at least 8 characters',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    verificationTokenExpire: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    gender: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: null,
    },
    origin: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    university: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    major: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    educationLevel: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      field: 'education_level',
    },
    entryYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      field: 'entry_year',
      validate: {
        min: 1950,
        max: 2100,
      },
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    scholarshipType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      field: 'scholarship_type',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ['password', 'verificationToken', 'verificationTokenExpire'],
      },
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ['password'],
        },
      },
    },
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

module.exports = User;
