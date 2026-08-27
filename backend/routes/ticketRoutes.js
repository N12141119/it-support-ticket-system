const express = require('express');
const {
  createTicket,
  getMyTickets,
  getAgentQueue,
  getTicketById,
  updateEmployeeTicket,
  assignTicket,
  updatePriority,
  updateStatus,
  resolveTicket,
  closeTicket,
} = require('../controllers/ticketController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, requireRole('employee'), createTicket);
router.get('/mine', protect, requireRole('employee'), getMyTickets);
router.get('/agent/queue', protect, requireRole('agent'), getAgentQueue);
router.get('/:id', protect, getTicketById);
router.put('/:id', protect, requireRole('employee'), updateEmployeeTicket);
router.patch('/:id/assign', protect, requireRole('agent'), assignTicket);
router.patch('/:id/priority', protect, requireRole('agent'), updatePriority);
router.patch('/:id/status', protect, requireRole('agent'), updateStatus);
router.patch('/:id/resolve', protect, requireRole('agent'), resolveTicket);
router.patch('/:id/close', protect, requireRole('employee'), closeTicket);

module.exports = router;
