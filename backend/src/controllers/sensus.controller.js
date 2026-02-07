const xlsx = require('xlsx');
const path = require('path');

// Path to Excel file
const EXCEL_FILE_PATH = path.join(__dirname, '../../Data Mahasiswa dan Dokter WNI.xlsx');

/**
 * Normalize gender value
 */
const normalizeGender = (value) => {
    if (!value) return '';
    const v = String(value).toLowerCase().trim();
    if (v === 'l' || v === 'laki-laki' || v === 'male') return 'Laki-laki';
    if (v === 'p' || v === 'perempuan' || v === 'female') return 'Perempuan';
    return value;
};

/**
 * Transform raw Excel row to clean format
 */
const transformRow = (row, index) => {
    const name = String(row['__EMPTY'] || '').trim();
    const no = row['Data Mahasiswa Bidang Kedokteran di Tiongkok'];

    // Skip header and empty rows
    if (!name ||
        name === '' ||
        name === 'Nama ' ||
        name === 'Nama' ||
        name.includes('PERLUNI') ||
        name.includes('Periode') ||
        name.includes('Data Mahasiswa') ||
        name.includes(':')) {
        return null;
    }

    // Skip rows that are just university headers (no name, just university)
    if ((no === '' || no === undefined || no === null) && !name) {
        return null;
    }

    // Skip rows where 'no' is a header like 'No'
    if (no === 'No' || no === 'NO') {
        return null;
    }

    return {
        id: index,
        name: name,
        gender: normalizeGender(row['__EMPTY_1']),
        origin: String(row['__EMPTY_2'] || '').trim().replace(/\n/g, ' '),
        university: String(row['__EMPTY_3'] || '').trim(),
        major: String(row['__EMPTY_4'] || '').trim(),
        education_level: String(row['__EMPTY_5'] || '').trim(),
        entry_year: row['__EMPTY_6'] ? parseInt(row['__EMPTY_6']) || row['__EMPTY_6'] : null,
        duration: String(row['__EMPTY_7'] || '').trim(),
        hospital: String(row['__EMPTY_8'] || '').trim(),
        scholarship_type: String(row['__EMPTY_9'] || '').trim() || 'Mandiri',
        remarks: String(row['__EMPTY_10'] || '').trim()
    };
};

/**
 * Read and parse Excel file
 */
const readExcelFile = () => {
    try {
        const workbook = xlsx.readFile(EXCEL_FILE_PATH);
        const result = {};

        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const rawData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

            // Transform and filter data
            let idCounter = 1;
            const transformedData = rawData
                .map((row, idx) => transformRow(row, idCounter++))
                .filter(row => row !== null);

            // Re-index IDs
            transformedData.forEach((row, idx) => {
                row.id = idx + 1;
            });

            result[sheetName] = transformedData;
        });

        return result;
    } catch (error) {
        console.error('Error reading Excel file:', error);
        throw error;
    }
};

/**
 * Get all data from Excel file
 * GET /api/sensus
 */
exports.getAllData = async (req, res) => {
    try {
        const data = readExcelFile();

        // Combine all sheets into one array
        const allData = [];
        Object.keys(data).forEach(sheet => {
            data[sheet].forEach(row => {
                allData.push({ ...row, sheet: sheet });
            });
        });

        res.json({
            success: true,
            message: 'Data retrieved successfully',
            total: allData.length,
            sheets: Object.keys(data),
            data: allData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to read data',
            error: error.message
        });
    }
};

/**
 * Get data from specific sheet
 * GET /api/sensus/sheet/:sheetName
 */
exports.getSheetData = async (req, res) => {
    try {
        const { sheetName } = req.params;
        const data = readExcelFile();

        if (!data[sheetName]) {
            return res.status(404).json({
                success: false,
                message: `Sheet "${sheetName}" not found`,
                availableSheets: Object.keys(data)
            });
        }

        res.json({
            success: true,
            message: `Data from sheet "${sheetName}" retrieved successfully`,
            count: data[sheetName].length,
            data: data[sheetName]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to read data',
            error: error.message
        });
    }
};

/**
 * Get list of available sheets
 * GET /api/sensus/sheets
 */
exports.getSheets = async (req, res) => {
    try {
        const data = readExcelFile();
        const sheetsInfo = Object.keys(data).map(name => ({
            name: name,
            rowCount: data[name].length
        }));

        res.json({
            success: true,
            message: 'Sheets list retrieved successfully',
            sheets: sheetsInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to read sheets',
            error: error.message
        });
    }
};

/**
 * Search data in a sheet or by category
 * GET /api/sensus/search?sheet=SheetName&query=searchTerm&field=fieldName&category=cat
 */
exports.searchData = async (req, res) => {
    try {
        const { sheet, query, field, category } = req.query;
        const data = readExcelFile();

        let searchData = [];

        // Determine which sheets to search based on category or sheet param
        if (sheet) {
            if (data[sheet]) {
                searchData = data[sheet].map(row => ({ ...row, sheet: sheet }));
            }
        } else if (category && category !== 'all') {
            // Filter sheets based on category keyword
            const targetKeyword = category.toLowerCase();
            Object.keys(data).forEach(sheetName => {
                // Check if sheet name contains category (e.g., 'mahasiswa' in 'Data Mahasiswa')
                if (sheetName.toLowerCase().includes(targetKeyword)) {
                    data[sheetName].forEach(row => {
                        searchData.push({ ...row, sheet: sheetName });
                    });
                }
            });
        } else {
            // Search in all sheets
            Object.keys(data).forEach(sheetName => {
                data[sheetName].forEach(row => {
                    searchData.push({ ...row, sheet: sheetName });
                });
            });
        }

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchQuery = query.toLowerCase();

        const results = searchData.filter(row => {
            if (field) {
                const value = String(row[field] || '').toLowerCase();
                return value.includes(searchQuery);
            } else {
                return Object.values(row).some(value =>
                    String(value).toLowerCase().includes(searchQuery)
                );
            }
        });

        // Limit results to 50 for performance
        const limitedResults = results.slice(0, 50);

        res.json({
            success: true,
            message: `Found ${results.length} results`,
            query: query,
            category: category || 'all',
            count: limitedResults.length,
            total_found: results.length,
            data: limitedResults
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};

/**
 * Get statistics
 * GET /api/sensus/stats
 */
exports.getStats = async (req, res) => {
    try {
        const data = readExcelFile();

        let totalMahasiswa = 0;
        let totalDokter = 0;
        const universities = new Set();
        const entryYears = new Set();
        const genderCount = { 'Laki-laki': 0, 'Perempuan': 0 };

        Object.keys(data).forEach(sheetName => {
            const sheetData = data[sheetName];

            if (sheetName.toLowerCase().includes('mahasiswa')) {
                totalMahasiswa += sheetData.length;
            } else if (sheetName.toLowerCase().includes('dokter')) {
                totalDokter += sheetData.length;
            }

            sheetData.forEach(row => {
                if (row.university) universities.add(row.university);
                if (row.entry_year) entryYears.add(row.entry_year);
                if (row.gender === 'Laki-laki') genderCount['Laki-laki']++;
                if (row.gender === 'Perempuan') genderCount['Perempuan']++;
            });
        });

        res.json({
            success: true,
            message: 'Statistics retrieved successfully',
            stats: {
                total_records: totalMahasiswa + totalDokter,
                total_mahasiswa: totalMahasiswa,
                total_dokter: totalDokter,
                total_universities: universities.size,
                gender_distribution: genderCount,
                entry_years: Array.from(entryYears).sort()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics',
            error: error.message
        });
    }
};

/**
 * Get universities list
 * GET /api/sensus/universities
 */
exports.getUniversities = async (req, res) => {
    try {
        const data = readExcelFile();
        const universities = {};

        Object.keys(data).forEach(sheetName => {
            data[sheetName].forEach(row => {
                if (row.university) {
                    if (!universities[row.university]) {
                        universities[row.university] = 0;
                    }
                    universities[row.university]++;
                }
            });
        });

        const sortedUniversities = Object.entries(universities)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        res.json({
            success: true,
            message: 'Universities list retrieved successfully',
            count: sortedUniversities.length,
            data: sortedUniversities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get universities',
            error: error.message
        });
    }
};
