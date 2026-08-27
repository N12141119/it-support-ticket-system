const Ticket = require('../models/Ticket');

const employeeDashboard = async (req, res) => {
  try {
    const match = { createdBy: req.user.id };
    const [total, open, inProgress, resolved, recent] = await Promise.all([
      Ticket.countDocuments(match),
      Ticket.countDocuments({ ...match, status: 'Open' }),
      Ticket.countDocuments({ ...match, status: 'In Progress' }),
      Ticket.countDocuments({ ...match, status: 'Resolved' }),
      Ticket.find(match).populate('assignedAgent', 'name email').sort({ createdAt: -1 }).limit(3),
    ]);
    res.json({ total, open, inProgress, resolved, recent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const agentDashboard = async (req, res) => {
  try {
    const [active, open, assigned, inProgress, critical, recent] = await Promise.all([
      Ticket.countDocuments({ status: { $in: ['Open', 'Assigned', 'In Progress'] } }),
      Ticket.countDocuments({ status: 'Open' }),
      Ticket.countDocuments({ status: 'Assigned' }),
      Ticket.countDocuments({ status: 'In Progress' }),
      Ticket.countDocuments({ status: { $in: ['Open', 'Assigned', 'In Progress'] }, priority: 'Critical' }),
      Ticket.find({ status: { $in: ['Open', 'Assigned', 'In Progress'] } })
        .populate('createdBy', 'name email')
        .populate('assignedAgent', 'name email')
        .sort({ createdAt: -1 })
        .limit(4),
    ]);
    res.json({ active, open, assigned, inProgress, critical, recent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { employeeDashboard, agentDashboard };
