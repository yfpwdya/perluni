const { Op, getLikeOperator } = require('../config/database');
const { Feedback, User } = require('../models');

const buildFeedbackWhere = (status = 'all', search = '') => {
  const where = {};
  const normalizedSearch = String(search || '').trim();

  if (status !== 'all') {
    where.status = status;
  }

  if (normalizedSearch) {
    const likeOp = getLikeOperator();
    where[Op.or] = [
      { name: { [likeOp]: `%${normalizedSearch}%` } },
      { email: { [likeOp]: `%${normalizedSearch}%` } },
    ];
  }

  return where;
};

const getFeedbackSummaryStats = async () => {
  const [total, totalNew, totalReviewed] = await Promise.all([
    Feedback.count(),
    Feedback.count({ where: { status: 'new' } }),
    Feedback.count({ where: { status: 'reviewed' } }),
  ]);

  return {
    total,
    new: totalNew,
    reviewed: totalReviewed,
  };
};

const createFeedback = async (req, res) => {
  try {
    const { name, email, message, sourcePage } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan pesan wajib diisi',
      });
    }

    const feedback = await Feedback.create({
      name: String(name).trim(),
      email: email ? String(email).trim().toLowerCase() : null,
      message: String(message).trim(),
      sourcePage: sourcePage ? String(sourcePage).trim() : 'homepage',
      userId: req.user?.id || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Masukan berhasil dikirim. Terima kasih!',
      data: {
        id: feedback.id,
        name: feedback.name,
        status: feedback.status,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengirim masukan',
      error: error.message,
    });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const {
      status = 'all',
      page = 1,
      limit = 20,
      search = '',
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const normalizedSearch = String(search || '').trim();

    const where = buildFeedbackWhere(status, normalizedSearch);

    const [{ rows, count }, stats] = await Promise.all([
      Feedback.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
            required: false,
          },
        ],
        order: [['createdAt', 'DESC']],
        offset: (currentPage - 1) * perPage,
        limit: perPage,
      }),
      getFeedbackSummaryStats(),
    ]);

    return res.json({
      success: true,
      data: {
        feedbacks: rows,
        pagination: {
          page: currentPage,
          limit: perPage,
          total: count,
          pages: Math.max(Math.ceil(count / perPage), 1),
        },
        filters: {
          status,
          search: normalizedSearch,
        },
        stats: {
          ...stats,
          filtered: count,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data masukan',
      error: error.message,
    });
  }
};

const markFeedbackReviewed = async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback tidak ditemukan',
      });
    }

    feedback.status = 'reviewed';
    await feedback.save();

    return res.json({
      success: true,
      message: 'Feedback ditandai sudah direview',
      data: { feedback },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui feedback',
      error: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  markFeedbackReviewed,
};
