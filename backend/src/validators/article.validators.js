const { body, param, query } = require('express-validator');

const articleCategories = ['berita', 'pengumuman', 'kegiatan', 'artikel'];
const articleStatuses = ['draft', 'published'];

const listArticlesValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100').toInt(),
  query('category').optional().isIn(articleCategories).withMessage('Invalid category'),
  query('status').optional().isIn(articleStatuses).withMessage('Invalid status'),
  query('search').optional().isString().isLength({ max: 120 }).withMessage('Search max 120 chars'),
];

const articleIdValidation = [param('id').isUUID().withMessage('Invalid article id')];

const createArticleValidation = [
  body('title').isString().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('content').isString().isLength({ min: 10, max: 20000 }).withMessage('Content must be 10-20000 characters'),
  body('excerpt').optional({ nullable: true }).isString().isLength({ max: 500 }).withMessage('Excerpt max 500 chars'),
  body('coverImage').optional({ nullable: true }).isURL({ require_protocol: true }).withMessage('Cover image must be a valid URL'),
  body('category').optional().isIn(articleCategories).withMessage('Invalid category'),
  body('status').optional().isIn(articleStatuses).withMessage('Invalid status'),
  body('tags')
    .optional({ nullable: true })
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === 'string') return value.length <= 300;
      throw new Error('Tags must be array or comma-separated string');
    }),
];

const updateArticleValidation = [
  ...articleIdValidation,
  body('title').optional().isString().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('content').optional().isString().isLength({ min: 10, max: 20000 }).withMessage('Content must be 10-20000 characters'),
  body('excerpt').optional({ nullable: true }).isString().isLength({ max: 500 }).withMessage('Excerpt max 500 chars'),
  body('coverImage').optional({ nullable: true }).isURL({ require_protocol: true }).withMessage('Cover image must be a valid URL'),
  body('category').optional().isIn(articleCategories).withMessage('Invalid category'),
  body('status').optional().isIn(articleStatuses).withMessage('Invalid status'),
  body('tags')
    .optional({ nullable: true })
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === 'string') return value.length <= 300;
      throw new Error('Tags must be array or comma-separated string');
    }),
];

module.exports = {
  listArticlesValidation,
  articleIdValidation,
  createArticleValidation,
  updateArticleValidation,
};
