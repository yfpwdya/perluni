const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class MemberAudit extends Model {}

MemberAudit.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'member_id',
    },
    action: {
      type: DataTypes.ENUM('create', 'update', 'deactivate'),
      allowNull: false,
    },
    changedFields: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      field: 'changed_fields',
    },
    beforeData: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'before_data',
    },
    afterData: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'after_data',
    },
    actorId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'actor_id',
    },
    ipAddress: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'user_agent',
    },
  },
  {
    sequelize,
    modelName: 'MemberAudit',
    tableName: 'member_audits',
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ['member_id'] }, { fields: ['action'] }, { fields: ['created_at'] }],
  }
);

module.exports = MemberAudit;
