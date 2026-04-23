const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

class Article extends Model {}

Article.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title is required' },
      },
    },
    slug: {
      type: DataTypes.STRING(220),
      unique: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Content is required' },
      },
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    category: {
      type: DataTypes.ENUM('berita', 'pengumuman', 'kegiatan', 'artikel'),
      defaultValue: 'artikel',
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'author_id',
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'draft',
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: 'published_at',
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Article',
    tableName: 'articles',
    underscored: true,
    timestamps: true,
    hooks: {
      beforeValidate: (article) => {
        if (article.title) {
          article.slug = slugify(article.title);
        }
      },
      beforeSave: (article) => {
        if (!article.excerpt && article.content) {
          article.excerpt = `${article.content.slice(0, 200)}...`;
        }

        if (article.changed('status') && article.status === 'published' && !article.publishedAt) {
          article.publishedAt = new Date();
        }
      },
    },
  }
);

module.exports = Article;
