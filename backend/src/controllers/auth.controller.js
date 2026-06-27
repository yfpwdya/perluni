const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('../config/database');
const { User, Member } = require('../models');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});

const register = async (req, res) => {
  try {
    const { name, email, password, gender, origin, university, major, educationLevel, entryYear, duration, scholarshipType, memberId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const plainVerificationToken = crypto.randomBytes(20).toString('hex');
    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(plainVerificationToken)
      .digest('hex');

    const shouldSendVerification = Boolean(process.env.SENDGRID_API_KEY);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      gender: gender || null,
      origin: origin || null,
      university: university || null,
      major: major || null,
      educationLevel: educationLevel || null,
      entryYear: entryYear ? parseInt(entryYear, 10) : null,
      duration: duration || null,
      scholarshipType: scholarshipType || null,
      isVerified: !shouldSendVerification,
      verificationToken: shouldSendVerification ? hashedVerificationToken : null,
      verificationTokenExpire: shouldSendVerification
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : null,
    });

    // Sync to Member table so they are searchable in Sensus (Cari Data Anggota)
    try {
      let memberToSync = null;

      if (memberId) {
        memberToSync = await Member.findByPk(memberId);
      }

      if (!memberToSync) {
        // Fallback: search by name, university, and entryYear
        memberToSync = await Member.findOne({
          where: {
            name: name,
            university: university || null,
            entryYear: entryYear ? parseInt(entryYear, 10) : null,
          },
        });
      }

      if (memberToSync) {
        // Update existing member details
        memberToSync.gender = gender || memberToSync.gender;
        memberToSync.origin = origin || memberToSync.origin;
        memberToSync.university = university || memberToSync.university;
        memberToSync.major = major || memberToSync.major;
        memberToSync.educationLevel = educationLevel || memberToSync.educationLevel;
        memberToSync.entryYear = entryYear ? parseInt(entryYear, 10) : memberToSync.entryYear;
        memberToSync.duration = duration || memberToSync.duration;
        memberToSync.scholarshipType = scholarshipType || memberToSync.scholarshipType;
        memberToSync.isActive = true;
        await memberToSync.save();
      } else {
        // Create new member record
        await Member.create({
          name,
          gender: gender || null,
          origin: origin || null,
          university: university || null,
          major: major || null,
          educationLevel: educationLevel || null,
          entryYear: entryYear ? parseInt(entryYear, 10) : null,
          duration: duration || null,
          scholarshipType: scholarshipType || null,
          category: 'mahasiswa', // default category
          sourceSheet: 'Portal Perluni', // indicates portal registration
          isActive: true,
        });
      }
    } catch (syncError) {
      console.error('Failed to sync registered user to Member table:', syncError);
    }

    if (shouldSendVerification) {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${plainVerificationToken}`;

      await sendEmail({
        email: user.email,
        subject: 'Email Verification - Perluni',
        message: `Please verify your email: ${verificationUrl}`,
        html: `
          <h1>Email Verification</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}" clicktracking=off>${verificationUrl}</a>
        `,
      });

      return res.status(201).json({
        success: true,
        message: `Registration successful. Please check your email (${normalizedEmail}) to verify your account.`,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Email verification is disabled in this environment.',
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      where: {
        verificationToken,
        isVerified: false,
        verificationTokenExpire: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now login.',
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.scope('withPassword').findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Account not verified. Please verify your email first.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user.id);
    res.cookie('auth_token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  });

  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          gender: user.gender,
          origin: user.origin,
          university: user.university,
          major: user.major,
          educationLevel: user.educationLevel,
          entryYear: user.entryYear,
          duration: user.duration,
          scholarshipType: user.scholarshipType,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, gender, origin, university, major, educationLevel, entryYear, duration, scholarshipType } = req.body;

    const allowedFields = { name, gender, origin, university, major, educationLevel, entryYear, duration, scholarshipType };
    Object.entries(allowedFields).forEach(([key, val]) => {
      if (val !== undefined) {
        if (key === 'entryYear') {
          user[key] = val ? parseInt(val, 10) : null;
        } else {
          user[key] = val || null;
        }
      }
    });

    await user.save();

    // Also sync changes to Member table if matched
    try {
      const { Member } = require('../models');
      const member = await Member.findOne({ where: { name: user.name, isActive: true } });
      if (member) {
        if (gender !== undefined) member.gender = gender || member.gender;
        if (origin !== undefined) member.origin = origin || member.origin;
        if (university !== undefined) member.university = university || member.university;
        if (major !== undefined) member.major = major || member.major;
        if (educationLevel !== undefined) member.educationLevel = educationLevel || member.educationLevel;
        if (entryYear !== undefined) member.entryYear = entryYear ? parseInt(entryYear, 10) : member.entryYear;
        if (duration !== undefined) member.duration = duration || member.duration;
        if (scholarshipType !== undefined) member.scholarshipType = scholarshipType || member.scholarshipType;
        await member.save();
      }
    } catch (syncErr) {
      console.error('Member sync on profile update failed:', syncErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          gender: user.gender,
          origin: user.origin,
          university: user.university,
          major: user.major,
          educationLevel: user.educationLevel,
          entryYear: user.entryYear,
          duration: user.duration,
          scholarshipType: user.scholarshipType,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui profil', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password baru minimal 8 karakter' });
    }

    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword);
    if (!passwordRegex) {
      return res.status(400).json({ success: false, message: 'Password baru harus mengandung huruf besar, huruf kecil, dan angka' });
    }

    const user = await User.scope('withPassword').findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password lama tidak sesuai' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password berhasil diperbarui' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengubah password', error: error.message });
  }
};

const getUsers = async (_req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'name',
        'email',
        'role',
        'isActive',
        'isVerified',
        'createdAt',
      ],
    });

    return res.status(200).json({
      success: true,
      data: {
        users,
        total: users.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either user or admin',
      });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  getUsers,
  updateUserRole,
};
