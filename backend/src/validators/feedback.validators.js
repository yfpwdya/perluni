const { body, param, query } = require('express-validator');

// Function to strip HTML tags as an extra security layer
const stripHtml = (value) => {
  if (!value) return value;
  return value.replace(/<[^>]*>?/gm, '');
};

const createFeedbackValidation = [
  body('name').customSanitizer(stripHtml).isString().trim().escape().isLength({ min: 2, max: 120 }).withMessage('Nama harus 2-120 karakter'),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Format email tidak valid').normalizeEmail(),
  body('subject').optional({ nullable: true }).customSanitizer(stripHtml).isString().trim().escape().isLength({ max: 255 }).withMessage('Subjek maksimal 255 karakter'),
  body('message').customSanitizer(stripHtml).isString().trim().escape().isLength({ min: 5, max: 5000 }).withMessage('Pesan harus 5-5000 karakter'),
  body('sourcePage').optional({ nullable: true }).customSanitizer(stripHtml).isString().trim().escape().isLength({ max: 120 }).withMessage('sourcePage maksimal 120 karakter'),
];

const listFeedbackValidation = [
  query('status').optional().isIn(['all', 'new', 'reviewed']).withMessage('Status tidak valid'),
  query('search').optional().isString().isLength({ max: 120 }).withMessage('Kata kunci maksimal 120 karakter'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page minimal 1').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit 1-100').toInt(),
];

const reviewFeedbackValidation = [param('id').isUUID().withMessage('ID feedback tidak valid')];

module.exports = {
  createFeedbackValidation,
  listFeedbackValidation,
  reviewFeedbackValidation,
};
