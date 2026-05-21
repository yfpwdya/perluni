const { body, param, query } = require('express-validator');

const allowedCategories = ['all', 'mahasiswa', 'alumni'];
const allowedMemberStatus = ['all', 'active', 'inactive'];

const searchValidation = [
  query('sheet').optional().isString().isLength({ max: 120 }).withMessage('Sheet name too long'),
  query('query').optional().isString().isLength({ max: 120 }).withMessage('Query too long'),
  query('field')
    .optional()
    .isIn([
      'name',
      'gender',
      'origin',
      'university',
      'major',
      'education_level',
      'entry_year',
      'duration',
      'hospital',
      'scholarship_type',
      'remarks',
      'category',
      'sheet',
    ])
    .withMessage('Invalid field'),
  query('category').optional().isIn(allowedCategories).withMessage('Invalid category'),
];

const sheetValidation = [param('sheetName').isString().isLength({ min: 1, max: 120 }).withMessage('Invalid sheet')];

const memberIdValidation = [param('id').isInt({ min: 1 }).withMessage('Invalid member id').toInt()];

const createMemberValidation = [
  body('name').isString().isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 chars'),
  body('gender').optional({ nullable: true }).isString().isLength({ max: 30 }).withMessage('Gender max 30 chars'),
  body('origin').optional({ nullable: true }).isString().isLength({ max: 300 }).withMessage('Origin max 300 chars'),
  body('university').optional({ nullable: true }).isString().isLength({ max: 200 }).withMessage('University max 200 chars'),
  body('major').optional({ nullable: true }).isString().isLength({ max: 200 }).withMessage('Major max 200 chars'),
  body('educationLevel').optional({ nullable: true }).isString().isLength({ max: 50 }).withMessage('Education level max 50 chars'),
  body('entryYear').optional({ nullable: true }).isInt({ min: 1950, max: 2100 }).withMessage('Entry year invalid').toInt(),
  body('duration').optional({ nullable: true }).isString().isLength({ max: 100 }).withMessage('Duration max 100 chars'),
  body('hospital').optional({ nullable: true }).isString().isLength({ max: 250 }).withMessage('Hospital max 250 chars'),
  body('scholarshipType').optional({ nullable: true }).isString().isLength({ max: 120 }).withMessage('Scholarship type max 120 chars'),
  body('remarks').optional({ nullable: true }).isString().isLength({ max: 1000 }).withMessage('Remarks max 1000 chars'),
  body('category').isIn(['mahasiswa', 'alumni']).withMessage('Category must be mahasiswa/alumni'),
  body('sourceSheet').isString().isLength({ min: 2, max: 100 }).withMessage('sourceSheet is required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean').toBoolean(),
];

const updateMemberValidation = [
  ...memberIdValidation,
  body('name').optional().isString().isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 chars'),
  body('gender').optional({ nullable: true }).isString().isLength({ max: 30 }).withMessage('Gender max 30 chars'),
  body('origin').optional({ nullable: true }).isString().isLength({ max: 300 }).withMessage('Origin max 300 chars'),
  body('university').optional({ nullable: true }).isString().isLength({ max: 200 }).withMessage('University max 200 chars'),
  body('major').optional({ nullable: true }).isString().isLength({ max: 200 }).withMessage('Major max 200 chars'),
  body('educationLevel').optional({ nullable: true }).isString().isLength({ max: 50 }).withMessage('Education level max 50 chars'),
  body('entryYear').optional({ nullable: true }).isInt({ min: 1950, max: 2100 }).withMessage('Entry year invalid').toInt(),
  body('duration').optional({ nullable: true }).isString().isLength({ max: 100 }).withMessage('Duration max 100 chars'),
  body('hospital').optional({ nullable: true }).isString().isLength({ max: 250 }).withMessage('Hospital max 250 chars'),
  body('scholarshipType').optional({ nullable: true }).isString().isLength({ max: 120 }).withMessage('Scholarship type max 120 chars'),
  body('remarks').optional({ nullable: true }).isString().isLength({ max: 1000 }).withMessage('Remarks max 1000 chars'),
  body('category').optional().isIn(['mahasiswa', 'alumni']).withMessage('Category must be mahasiswa/alumni'),
  body('sourceSheet').optional().isString().isLength({ min: 2, max: 100 }).withMessage('sourceSheet too short'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean').toBoolean(),
];

const listMembersAdminValidation = [
  query('search').optional().isString().isLength({ max: 120 }).withMessage('Search max 120 chars'),
  query('category').optional().isIn(allowedCategories).withMessage('Invalid category'),
  query('status').optional().isIn(allowedMemberStatus).withMessage('Invalid status'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >=1').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100').toInt(),
];

module.exports = {
  searchValidation,
  sheetValidation,
  memberIdValidation,
  createMemberValidation,
  updateMemberValidation,
  listMembersAdminValidation,
};
