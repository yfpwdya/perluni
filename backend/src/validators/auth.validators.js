const { body, param } = require('express-validator');

const registerValidation = [
  body('name')
    .isString()
    .withMessage('Name must be text')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password must be text')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be 8-128 characters')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must include uppercase, lowercase, and number'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isString().withMessage('Password is required').isLength({ min: 1 }).withMessage('Password is required'),
];

const updateRoleValidation = [
  param('id').isUUID().withMessage('Invalid user id'),
  body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
];

const verifyEmailValidation = [param('token').isLength({ min: 20 }).withMessage('Invalid token')];

module.exports = {
  registerValidation,
  loginValidation,
  updateRoleValidation,
  verifyEmailValidation,
};
