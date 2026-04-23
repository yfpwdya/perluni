const { Op, getLikeOperator } = require('../config/database');
const { Article, User } = require('../models');

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const getArticles = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10, search } = req.query;
    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const where = {};
    const likeOp = getLikeOperator();

    if (category) where.category = category;
    if (status) where.status = status;

    if (search) {
      where[Op.or] = [
        { title: { [likeOp]: `%${search}%` } },
        { content: { [likeOp]: `%${search}%` } },
      ];
    }

    if (!req.user || req.user.role !== 'admin') {
      where.status = 'published';
    }

    const { rows, count } = await Article.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset: (currentPage - 1) * perPage,
      limit: perPage,
    });

    return res.status(200).json({
      success: true,
      data: {
        articles: rows,
        pagination: {
          page: currentPage,
          limit: perPage,
          total: count,
          pages: Math.ceil(count / perPage),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch articles',
      error: error.message,
    });
  }
};

const getArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    if (article.status === 'draft' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    await article.increment('views');

    return res.status(200).json({
      success: true,
      data: {
        article: {
          ...article.toJSON(),
          views: article.views + 1,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch article',
      error: error.message,
    });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status } = req.body;

    const article = await Article.create({
      title,
      content,
      excerpt,
      coverImage,
      category,
      tags: parseTags(tags),
      status,
      authorId: req.user.id,
    });

    const articleWithAuthor = await Article.findByPk(article.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: { article: articleWithAuthor },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create article',
      error: error.message,
    });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    if (article.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article',
      });
    }

    const payload = { ...req.body };
    if (payload.tags !== undefined) {
      payload.tags = parseTags(payload.tags);
    }

    await article.update(payload);

    const updatedArticle = await Article.findByPk(article.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: { article: updatedArticle },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update article',
      error: error.message,
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    if (article.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article',
      });
    }

    await article.destroy();

    return res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete article',
      error: error.message,
    });
  }
};

module.exports = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
