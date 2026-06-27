const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const articleRoutes = require('./article.routes');
const sensusRoutes = require('./sensus.routes');
const feedbackRoutes = require('./feedback.routes');
const contactRoutes = require('./contact.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/sensus', sensusRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/contact', contactRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;

