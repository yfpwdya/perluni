const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  verifyEmail,
  getUsers,
  updateUserRole,
} = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email/:token', verifyEmail);
router.get('/me', protect, getMe);

router.get('/users', protect, authorize('admin'), getUsers);
router.patch('/users/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;
