const { sequelize, Op, getLikeOperator } = require('../config/database');
const { Member, MemberAudit, User } = require('../models');
const { logMemberAudit } = require('../services/memberAudit.service');

const toResponseMember = (member) => ({
  id: member.id,
  name: member.name,
  gender: member.gender,
  origin: member.origin,
  university: member.university,
  major: member.major,
  education_level: member.educationLevel,
  entry_year: member.entryYear,
  duration: member.duration,
  hospital: member.hospital,
  scholarship_type: member.scholarshipType,
  remarks: member.remarks,
  category: member.category,
  sheet: member.sourceSheet,
  is_active: member.isActive,
  created_at: member.createdAt,
  updated_at: member.updatedAt,
});

const fieldMap = {
  name: 'name',
  gender: 'gender',
  origin: 'origin',
  university: 'university',
  major: 'major',
  education_level: 'educationLevel',
  entry_year: 'entryYear',
  duration: 'duration',
  hospital: 'hospital',
  scholarship_type: 'scholarshipType',
  remarks: 'remarks',
  category: 'category',
  sheet: 'sourceSheet',
};

const normalizeNullableText = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const normalized = String(value).trim();
  return normalized || null;
};

const normalizeRequiredText = (value, fallback = '') => {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
};

const sanitizeMemberPayload = (body) => {
  const payload = {
    name: body.name === undefined ? undefined : normalizeRequiredText(body.name),
    gender: normalizeNullableText(body.gender),
    origin: normalizeNullableText(body.origin),
    university: normalizeNullableText(body.university),
    major: normalizeNullableText(body.major),
    educationLevel:
      body.educationLevel === undefined && body.education_level === undefined
        ? undefined
        : normalizeNullableText(body.educationLevel ?? body.education_level),
    entryYear:
      body.entryYear === undefined && body.entry_year === undefined
        ? undefined
        : Number(body.entryYear ?? body.entry_year) || null,
    duration: normalizeNullableText(body.duration),
    hospital: normalizeNullableText(body.hospital),
    scholarshipType:
      body.scholarshipType === undefined && body.scholarship_type === undefined
        ? undefined
        : normalizeNullableText(body.scholarshipType ?? body.scholarship_type),
    remarks: normalizeNullableText(body.remarks),
    category: body.category === undefined ? undefined : normalizeRequiredText(body.category),
    sourceSheet:
      body.sourceSheet === undefined && body.source_sheet === undefined
        ? undefined
        : normalizeRequiredText(body.sourceSheet ?? body.source_sheet, 'Manual Entry'),
    isActive: body.isActive ?? body.is_active,
  };

  if (payload.isActive === undefined) delete payload.isActive;

  return payload;
};

exports.getAllData = async (req, res) => {
  try {
    const members = await Member.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    });

    const sheets = [...new Set(members.map((m) => m.sourceSheet))];

    return res.json({
      success: true,
      message: 'Data retrieved successfully',
      total: members.length,
      sheets,
      data: members.map(toResponseMember),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to read data',
      error: error.message,
    });
  }
};

exports.getSheetData = async (req, res) => {
  try {
    const { sheetName } = req.params;

    const members = await Member.findAll({
      where: {
        sourceSheet: sheetName,
        isActive: true,
      },
      order: [['name', 'ASC']],
    });

    if (!members.length) {
      const availableSheets = await Member.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('source_sheet')), 'sourceSheet']],
        raw: true,
      });

      return res.status(404).json({
        success: false,
        message: `Sheet "${sheetName}" not found`,
        availableSheets: availableSheets.map((item) => item.sourceSheet),
      });
    }

    return res.json({
      success: true,
      message: `Data from sheet "${sheetName}" retrieved successfully`,
      count: members.length,
      data: members.map(toResponseMember),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to read data',
      error: error.message,
    });
  }
};

exports.getSheets = async (req, res) => {
  try {
    const sheets = await Member.findAll({
      attributes: [
        [sequelize.col('source_sheet'), 'name'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'rowCount'],
      ],
      where: { isActive: true },
      group: [sequelize.col('source_sheet')],
      order: [[sequelize.col('source_sheet'), 'ASC']],
      raw: true,
    });

    return res.json({
      success: true,
      message: 'Sheets list retrieved successfully',
      sheets: sheets.map((sheet) => ({
        name: sheet.name,
        rowCount: Number(sheet.rowCount),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to read sheets',
      error: error.message,
    });
  }
};

exports.searchData = async (req, res) => {
  try {
    const { sheet, query, field, category } = req.query;

    const keyword = String(query || '').trim();
    const likeOp = getLikeOperator();
    const where = { isActive: true };

    if (sheet) {
      where.sourceSheet = sheet;
    }

    if (category && category !== 'all') {
      where.category = String(category).toLowerCase();
    }

    if (keyword) {
      if (field && fieldMap[field]) {
        where[fieldMap[field]] = {
          [likeOp]: `%${keyword}%`,
        };
      } else {
        where[Op.or] = [
          { name: { [likeOp]: `%${keyword}%` } },
          { university: { [likeOp]: `%${keyword}%` } },
          { major: { [likeOp]: `%${keyword}%` } },
          { origin: { [likeOp]: `%${keyword}%` } },
          { hospital: { [likeOp]: `%${keyword}%` } },
          { remarks: { [likeOp]: `%${keyword}%` } },
          { sourceSheet: { [likeOp]: `%${keyword}%` } },
        ];
      }
    }

    const results = await Member.findAll({
      where,
      order: [['name', 'ASC']],
      limit: 50,
    });

    return res.json({
      success: true,
      message: keyword ? `Found ${results.length} results` : `Showing ${results.length} members`,
      query: keyword,
      category: category || 'all',
      count: results.length,
      total_found: results.length,
      data: results.map(toResponseMember),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const [totalRecords, totalMahasiswa, totalAlumni, universities, entryYears, genderRows] = await Promise.all([
      Member.count({ where: { isActive: true } }),
      Member.count({ where: { isActive: true, category: 'mahasiswa' } }),
      Member.count({ where: { isActive: true, category: 'alumni' } }),
      Member.count({
        where: {
          isActive: true,
          university: { [Op.not]: null },
        },
        distinct: true,
        col: 'university',
      }),
      Member.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('entry_year')), 'entryYear']],
        where: {
          isActive: true,
          entryYear: { [Op.not]: null },
        },
        raw: true,
      }),
      Member.findAll({
        attributes: ['gender', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
        where: { isActive: true },
        group: ['gender'],
        raw: true,
      }),
    ]);

    const genderDistribution = { 'Laki-laki': 0, Perempuan: 0 };
    genderRows.forEach((row) => {
      if (row.gender === 'Laki-laki') genderDistribution['Laki-laki'] = Number(row.total);
      if (row.gender === 'Perempuan') genderDistribution.Perempuan = Number(row.total);
    });

    return res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      stats: {
        total_records: totalRecords,
        total_mahasiswa: totalMahasiswa,
        total_dokter: totalAlumni,
        total_alumni: totalAlumni,
        total_universities: universities,
        gender_distribution: genderDistribution,
        entry_years: entryYears
          .map((item) => item.entryYear)
          .filter(Boolean)
          .sort((a, b) => Number(a) - Number(b)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message,
    });
  }
};

exports.getUniversities = async (_req, res) => {
  try {
    const universities = await Member.findAll({
      attributes: [
        ['university', 'name'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalMembers'],
      ],
      where: {
        isActive: true,
        university: { [Op.not]: null },
      },
      group: ['university'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      raw: true,
    });

    return res.json({
      success: true,
      message: 'Universities list retrieved successfully',
      total: universities.length,
      data: universities.map((item) => ({
        name: item.name,
        totalMembers: Number(item.totalMembers),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get universities',
      error: error.message,
    });
  }
};

exports.getMembersAdmin = async (req, res) => {
  try {
    const { search = '', category = 'all', status = 'all', page = 1, limit = 20 } = req.query;
    const likeOp = getLikeOperator();
    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const where = {};

    if (category !== 'all') where.category = category;
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const normalizedSearch = String(search || '').trim();
    if (normalizedSearch) {
      where[Op.or] = [
        { name: { [likeOp]: `%${normalizedSearch}%` } },
        { university: { [likeOp]: `%${normalizedSearch}%` } },
        { major: { [likeOp]: `%${normalizedSearch}%` } },
        { sourceSheet: { [likeOp]: `%${normalizedSearch}%` } },
      ];
    }

    const { rows, count } = await Member.findAndCountAll({
      where,
      order: [
        ['isActive', 'DESC'],
        ['name', 'ASC'],
      ],
      offset: (currentPage - 1) * perPage,
      limit: perPage,
    });

    return res.json({
      success: true,
      data: {
        members: rows.map(toResponseMember),
        pagination: {
          page: currentPage,
          limit: perPage,
          total: count,
          pages: Math.max(Math.ceil(count / perPage), 1),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch members',
      error: error.message,
    });
  }
};

exports.createMember = async (req, res) => {
  try {
    const payload = sanitizeMemberPayload(req.body);

    const member = await Member.create({
      ...payload,
      isActive: payload.isActive ?? true,
    });

    await logMemberAudit({
      action: 'create',
      memberBefore: null,
      memberAfter: member,
      actorId: req.user?.id,
      req,
    });

    return res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: { member: toResponseMember(member) },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Member with similar identity already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create member',
      error: error.message,
    });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    const payload = sanitizeMemberPayload(req.body);
    const beforeSnapshot = { ...member.toJSON() };

    const updatableFields = [
      'name',
      'gender',
      'origin',
      'university',
      'major',
      'educationLevel',
      'entryYear',
      'duration',
      'hospital',
      'scholarshipType',
      'remarks',
      'category',
      'sourceSheet',
      'isActive',
    ];

    updatableFields.forEach((field) => {
      if (payload[field] !== undefined) {
        member[field] = payload[field];
      }
    });

    await member.save();

    await logMemberAudit({
      action: 'update',
      memberBefore: beforeSnapshot,
      memberAfter: member,
      actorId: req.user?.id,
      req,
    });

    return res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: { member: toResponseMember(member) },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Member with similar identity already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update member',
      error: error.message,
    });
  }
};

exports.deactivateMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    if (!member.isActive) {
      return res.status(200).json({
        success: true,
        message: 'Member already inactive',
        data: { member: toResponseMember(member) },
      });
    }

    member.isActive = false;
    await member.save();

    await logMemberAudit({
      action: 'deactivate',
      memberBefore: { ...member.toJSON(), isActive: true },
      memberAfter: member,
      actorId: req.user?.id,
      req,
    });

    return res.status(200).json({
      success: true,
      message: 'Member deactivated successfully',
      data: { member: toResponseMember(member) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate member',
      error: error.message,
    });
  }
};

exports.getMemberAudits = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    const audits = await MemberAudit.findAll({
      where: { memberId: member.id },
      include: [
        {
          model: User,
          as: 'actor',
          attributes: ['id', 'name', 'email', 'role'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 100,
    });

    return res.json({
      success: true,
      data: {
        member: toResponseMember(member),
        audits,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch member audits',
      error: error.message,
    });
  }
};
