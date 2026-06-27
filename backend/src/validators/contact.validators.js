const { body, param, query } = require('express-validator');

const stripHtml = (value) => {
  if (!value) return value;
  return value.replace(/<[^>]*>?/gm, '');
};

const createContactValidation = [
  body('name').customSanitizer(stripHtml).isString().trim().escape().isLength({ min: 2, max: 120 }).withMessage('Nama harus 2-120 karakter'),
  body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
  body('subject').customSanitizer(stripHtml).isString().trim().escape().isLength({ min: 2, max: 255 }).withMessage('Subjek wajib diisi'),
  body('message').customSanitizer(stripHtml).isString().trim().escape().isLength({ min: 5, max: 5000 }).withMessage('Pesan harus 5-5000 karakter'),
];

const listContactValidation = [
  query('status').optional().isIn(['all', 'new', 'read']).withMessage('Status tidak valid'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page minimal 1').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit 1-100').toInt(),
];

const reviewContactValidation = [param('id').isUUID().withMessage('ID kontak tidak valid')];

module.exports = {
  createContactValidation,
  listContactValidation,
  reviewContactValidation,
};
