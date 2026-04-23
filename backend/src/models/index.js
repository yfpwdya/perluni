const { sequelize } = require('../config/database');
const User = require('./User');
const Article = require('./Article');
const Member = require('./Member');
const Feedback = require('./Feedback');

User.hasMany(Article, {
  foreignKey: 'authorId',
  as: 'articles',
});

Article.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

User.hasMany(Feedback, {
  foreignKey: 'userId',
  as: 'feedbacks',
});

Feedback.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

const syncModels = async () => {
  await sequelize.sync({
    alter: process.env.DB_SYNC_ALTER === 'true',
    force: process.env.DB_SYNC_FORCE === 'true',
  });
  console.log('✅ Database schema synchronized');
};

module.exports = {
  sequelize,
  syncModels,
  User,
  Article,
  Member,
  Feedback,
};
