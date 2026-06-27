const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
  markFeedbackReviewed,
  deleteFeedback,
} = require('../controllers/feedback.controller');
const { protect, authorize } = require('../middleware/auth');
const { contactRateLimiter } = require('../middleware/rateLimiter');
const { validateRequest } = require('../middleware/validation');
const {
  createFeedbackValidation,
  listFeedbackValidation,
  reviewFeedbackValidation,
} = require('../validators/feedback.validators');

router.post('/', protect, contactRateLimiter, createFeedbackValidation, validateRequest, createFeedback);
router.get('/', protect, authorize('admin'), listFeedbackValidation, validateRequest, getFeedbacks);
router.patch('/:id/review', protect, authorize('admin'), reviewFeedbackValidation, validateRequest, markFeedbackReviewed);
router.delete('/:id', protect, authorize('admin'), reviewFeedbackValidation, validateRequest, deleteFeedback);

module.exports = router;
