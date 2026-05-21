const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/article.controller');
const { protect, optionalProtect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const {
  listArticlesValidation,
  articleIdValidation,
  createArticleValidation,
  updateArticleValidation,
} = require('../validators/article.validators');

// Public routes (with optional auth to allow admin preview of drafts)
router.get('/', listArticlesValidation, validateRequest, optionalProtect, getArticles);
router.get('/:id', articleIdValidation, validateRequest, optionalProtect, getArticle);

// Protected routes (require authentication)
router.post('/', protect, authorize('admin'), createArticleValidation, validateRequest, createArticle);
router.put('/:id', protect, authorize('admin'), updateArticleValidation, validateRequest, updateArticle);
router.delete('/:id', protect, authorize('admin'), articleIdValidation, validateRequest, deleteArticle);

module.exports = router;
