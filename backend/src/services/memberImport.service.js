const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { Member } = require('../models');

const EXCEL_FILE_PATH = process.env.SENSUS_EXCEL_PATH
  ? path.resolve(process.env.SENSUS_EXCEL_PATH)
  : path.join(__dirname, '../../Data Mahasiswa dan Dokter WNI.xlsx');

const normalizeGender = (value) => {
  if (!value) return '';
  const v = String(value).toLowerCase().trim();
  if (v === 'l' || v === 'laki-laki' || v === 'male') return 'Laki-laki';
  if (v === 'p' || v === 'perempuan' || v === 'female') return 'Perempuan';
  return String(value).trim();
};

const normalizeCategory = (sheetName) => {
  const lower = String(sheetName).toLowerCase();
  if (lower.includes('mahasiswa')) return 'mahasiswa';
  if (lower.includes('dokter') || lower.includes('alumni')) return 'alumni';
  return 'mahasiswa';
};

const transformRow = (row, category, sourceSheet) => {
  const name = String(row['__EMPTY'] || '').trim();
  const no = row['Data Mahasiswa Bidang Kedokteran di Tiongkok'];

  const shouldSkip =
    !name ||
    name === 'Nama ' ||
    name === 'Nama' ||
    name.includes('PERLUNI') ||
    name.includes('Periode') ||
    name.includes('Data Mahasiswa') ||
    name.includes(':') ||
    no === 'No' ||
    no === 'NO';

  if (shouldSkip) return null;

  const entryYearRaw = row['__EMPTY_6'];
  const entryYear = entryYearRaw ? parseInt(entryYearRaw, 10) || null : null;

  return {
    name,
    gender: normalizeGender(row['__EMPTY_1']),
    origin: String(row['__EMPTY_2'] || '').trim().replace(/\n/g, ' '),
    university: String(row['__EMPTY_3'] || '').trim() || null,
    major: String(row['__EMPTY_4'] || '').trim() || null,
    educationLevel: String(row['__EMPTY_5'] || '').trim() || null,
    entryYear,
    duration: String(row['__EMPTY_7'] || '').trim() || null,
    hospital: String(row['__EMPTY_8'] || '').trim() || null,
    scholarshipType: String(row['__EMPTY_9'] || '').trim() || 'Mandiri',
    remarks: String(row['__EMPTY_10'] || '').trim() || null,
    category,
    sourceSheet,
  };
};

const parseWorkbookMembers = () => {
  const workbook = xlsx.readFile(EXCEL_FILE_PATH);
  const rows = [];

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
    const category = normalizeCategory(sheetName);

    rawData.forEach((row) => {
      const transformed = transformRow(row, category, sheetName);
      if (transformed) rows.push(transformed);
    });
  });

  return rows;
};

const seedMembersFromExcelIfEmpty = async () => {
  const existingCount = await Member.count();
  if (existingCount > 0) {
    console.log(`ℹ️  Members table already populated (${existingCount} records)`);
    return;
  }

  if (!fs.existsSync(EXCEL_FILE_PATH)) {
    console.warn(`⚠️  Excel source file not found at: ${EXCEL_FILE_PATH}`);
    return;
  }

  const parsedMembers = parseWorkbookMembers();

  if (!parsedMembers.length) {
    console.warn('⚠️  No members parsed from Excel file.');
    return;
  }

  await Member.bulkCreate(parsedMembers, {
    ignoreDuplicates: true,
  });

  const total = await Member.count();
  console.log(`✅ Members seeded from Excel. Total records in DB: ${total}`);
};

module.exports = {
  seedMembersFromExcelIfEmpty,
};
