const express = require('express');
const { employeeDashboard, agentDashboard } = require('../controllers/dashboardController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/employee', protect, requireRole('employee'), employeeDashboard);
router.get('/agent', protect, requireRole('agent'), agentDashboard);

module.exports = router;
