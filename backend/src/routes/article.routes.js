const express = require('express');
const router = express.Router();
const {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/article.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getArticles);
router.get('/:id', getArticle);

// Protected routes (require authentication)
router.post('/', protect, authorize('admin'), createArticle);
router.put('/:id', protect, authorize('admin'), updateArticle);
router.delete('/:id', protect, authorize('admin'), deleteArticle);

module.exports = router;
