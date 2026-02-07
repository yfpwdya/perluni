const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
// const sendEmail = require('../utils/sendEmail'); // Disabled for now

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Register request:', { name, email });

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // New user - AUTO VERIFIED (Bypassing Email Verification)
        user = await User.create({
            name,
            email,
            password,
            isVerified: true // Auto-verify
        });

        console.log('New user created (Auto-Verified):', user._id);

        // Generate token for immediate login (optional, but returning token allows auto-login if frontend supports it)
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful. Account is active.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// @desc    Verify email (Unused in bypass mode but kept for future)
// @route   POST /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
    // ... same logic but currently not needed for new users ...
    try {
        const verificationToken = req.params.token;

        const user = await User.findOne({
            verificationToken,
            isVerified: false
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Verification failed',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Check verification status (skip this check if we want to allow unverified logins too, but better keep it as safeguard)
        if (!user.isVerified) {
            // For legacy users created before auto-verify was enabled:
            // Maybe auto-verify them on login if we are in this mode?
            // Or tell them to contact admin.
            return res.status(401).json({
                success: false,
                message: 'Account not verified. Please contact admin.'
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get user data',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    verifyEmail
};
