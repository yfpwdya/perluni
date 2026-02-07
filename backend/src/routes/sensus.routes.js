const express = require('express');
const router = express.Router();
const sensusController = require('../controllers/sensus.controller');

// Get all data from Excel file
router.get('/', sensusController.getAllData);

// Get list of available sheets
router.get('/sheets', sensusController.getSheets);

// Get statistics
router.get('/stats', sensusController.getStats);

// Get universities list
router.get('/universities', sensusController.getUniversities);

// Search data
router.get('/search', sensusController.searchData);

// Get data from specific sheet
router.get('/sheet/:sheetName', sensusController.getSheetData);

module.exports = router;
