const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  getUsers,
  updateUserRole,
} = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');
const { validateRequest } = require('../middleware/validation');
const {
  registerValidation,
  loginValidation,
  updateRoleValidation,
  verifyEmailValidation,
} = require('../validators/auth.validators');

router.post('/register', authLimiter, registerValidation, validateRequest, register);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.post('/verify-email/:token', verifyEmailValidation, validateRequest, verifyEmail);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

router.get('/users', protect, authorize('admin'), getUsers);
router.patch('/users/:id/role', protect, authorize('admin'), updateRoleValidation, validateRequest, updateUserRole);

module.exports = router;
