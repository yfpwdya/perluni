const express = require('express');
const router = express.Router();
const sensusController = require('../controllers/sensus.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const {
  searchValidation,
  sheetValidation,
  memberIdValidation,
  createMemberValidation,
  updateMemberValidation,
  listMembersAdminValidation,
} = require('../validators/sensus.validators');

// Public endpoints
router.get('/', sensusController.getAllData);
router.get('/sheets', sensusController.getSheets);
router.get('/stats', sensusController.getStats);
router.get('/universities', sensusController.getUniversities);
router.get('/search', searchValidation, validateRequest, sensusController.searchData);
router.get('/sheet/:sheetName', sheetValidation, validateRequest, sensusController.getSheetData);

// Admin member management
router.get('/members', protect, authorize('admin'), listMembersAdminValidation, validateRequest, sensusController.getMembersAdmin);
router.post('/members', protect, authorize('admin'), createMemberValidation, validateRequest, sensusController.createMember);
router.patch('/members/:id', protect, authorize('admin'), updateMemberValidation, validateRequest, sensusController.updateMember);
router.delete('/members/:id', protect, authorize('admin'), memberIdValidation, validateRequest, sensusController.deactivateMember);
router.get('/members/:id/audits', protect, authorize('admin'), memberIdValidation, validateRequest, sensusController.getMemberAudits);

module.exports = router;
