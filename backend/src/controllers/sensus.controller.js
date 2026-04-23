const { sequelize, Op, getLikeOperator } = require('../config/database');
const { Member } = require('../models');

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
      message: keyword
        ? `Found ${results.length} results`
        : `Showing ${results.length} members`,
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
