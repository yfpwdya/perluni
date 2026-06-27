const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  markContactRead,
  deleteContact
} = require('../controllers/contact.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { contactRateLimiter } = require('../middleware/rateLimiter');
const {
  createContactValidation,
  listContactValidation,
  reviewContactValidation,
} = require('../validators/contact.validators');

// Public/User route to submit contact (must be logged in)
router.post('/', protect, contactRateLimiter, createContactValidation, validateRequest, createContact);

// Admin routes
router.get('/', protect, authorize('admin'), listContactValidation, validateRequest, getContacts);
router.patch('/:id/read', protect, authorize('admin'), reviewContactValidation, validateRequest, markContactRead);
router.delete('/:id', protect, authorize('admin'), reviewContactValidation, validateRequest, deleteContact);

module.exports = router;
