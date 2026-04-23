const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
  markFeedbackReviewed,
} = require('../controllers/feedback.controller');
const { optionalProtect, protect, authorize } = require('../middleware/auth');

router.post('/', optionalProtect, createFeedback);
router.get('/', protect, authorize('admin'), getFeedbacks);
router.patch('/:id/review', protect, authorize('admin'), markFeedbackReviewed);

module.exports = router;
