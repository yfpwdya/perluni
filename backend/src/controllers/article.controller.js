const Article = require('../models/Article');

// @desc    Get all articles
// @route   GET /api/articles
const getArticles = async (req, res) => {
    try {
        const { category, status, page = 1, limit = 10, search } = req.query;

        // Build query
        const query = {};

        if (category) query.category = category;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // For public access, only show published articles
        if (!req.user || req.user.role !== 'admin') {
            query.status = 'published';
        }

        const skip = (page - 1) * limit;

        const articles = await Article.find(query)
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Article.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                articles,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch articles',
            error: error.message
        });
    }
};

// @desc    Get single article
// @route   GET /api/articles/:id
const getArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'name avatar');

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Increment views
        article.views += 1;
        await article.save();

        res.status(200).json({
            success: true,
            data: { article }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch article',
            error: error.message
        });
    }
};

// @desc    Create article
// @route   POST /api/articles
const createArticle = async (req, res) => {
    try {
        const { title, content, excerpt, coverImage, category, tags, status } = req.body;

        const article = await Article.create({
            title,
            content,
            excerpt,
            coverImage,
            category,
            tags,
            status,
            author: req.user._id
        });

        await article.populate('author', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Article created successfully',
            data: { article }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create article',
            error: error.message
        });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
const updateArticle = async (req, res) => {
    try {
        let article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check ownership (admin can update any article)
        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this article'
            });
        }

        article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'name avatar');

        res.status(200).json({
            success: true,
            message: 'Article updated successfully',
            data: { article }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update article',
            error: error.message
        });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check ownership (admin can delete any article)
        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this article'
            });
        }

        await article.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete article',
            error: error.message
        });
    }
};

module.exports = {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle
};
