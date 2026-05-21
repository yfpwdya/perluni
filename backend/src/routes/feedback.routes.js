const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
  markFeedbackReviewed,
} = require('../controllers/feedback.controller');
const { optionalProtect, protect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const {
  createFeedbackValidation,
  listFeedbackValidation,
  reviewFeedbackValidation,
} = require('../validators/feedback.validators');

router.post('/', optionalProtect, createFeedbackValidation, validateRequest, createFeedback);
router.get('/', protect, authorize('admin'), listFeedbackValidation, validateRequest, getFeedbacks);
router.patch('/:id/review', protect, authorize('admin'), reviewFeedbackValidation, validateRequest, markFeedbackReviewed);

module.exports = router;
