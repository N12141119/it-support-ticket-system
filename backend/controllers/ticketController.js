const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { isValidCategory, isValidPriority } = require('../utils/validation');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const populateTicket = (query) =>
  query.populate('createdBy', 'name email').populate('assignedAgent', 'name email');

const createNotification = async ({ recipientUserId, ticketId, type, message }) =>
  Notification.create({ recipientUserId, ticketId, type, message });

const notifyAllAgents = async (ticket) => {
  const agents = await User.find({ role: 'agent' }).select('_id');
  if (!agents.length) return;
  await Notification.insertMany(
    agents.map((agent) => ({
      recipientUserId: agent._id,
      ticketId: ticket._id,
      type: 'NEW_TICKET',
      message: `${ticket.ticketNumber}: ${ticket.title} was submitted and needs review.`,
    }))
  );
};

const createTicket = async (req, res) => {
  const { title, description, category, priority } = req.body;
  if (!title || String(title).trim().length < 5 || String(title).trim().length > 100) {
    return res.status(400).json({ message: 'Title must contain 5 to 100 characters' });
  }
  if (!description || String(description).trim().length < 10 || String(description).trim().length > 1000) {
    return res.status(400).json({ message: 'Description must contain 10 to 1000 characters' });
  }
  if (!isValidCategory(category)) return res.status(400).json({ message: 'Select a valid ticket category' });
  if (!isValidPriority(priority)) return res.status(400).json({ message: 'Select a valid ticket priority' });

  try {
    const ticket = new Ticket({
      title: String(title).trim(),
      description: String(description).trim(),
      category,
      priority,
      createdBy: req.user.id,
    });
    ticket.ticketNumber = `TKT-${ticket._id.toString().slice(-6).toUpperCase()}`;
    await ticket.save();
    await notifyAllAgents(ticket);
    const populated = await populateTicket(Ticket.findById(ticket._id));
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const tickets = await populateTicket(Ticket.find({ createdBy: req.user.id }).sort({ createdAt: -1 }));
    return res.json(tickets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAgentQueue = async (req, res) => {
  try {
    const { status, priority, category, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (q && String(q).trim()) {
      const escaped = String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { ticketNumber: { $regex: escaped, $options: 'i' } },
      ];
    }
    const tickets = await populateTicket(Ticket.find(filter).sort({ createdAt: -1 }));
    return res.json(tickets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTicketById = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID' });
  try {
    const ticket = await populateTicket(Ticket.findById(req.params.id));
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    const ownsTicket = ticket.createdBy._id.toString() === req.user.id.toString();
    if (req.user.role !== 'agent' && !ownsTicket) return res.status(403).json({ message: 'You cannot access this ticket' });
    return res.json(ticket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateEmployeeTicket = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID' });
  const { title, description, category, priority } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.createdBy.toString() !== req.user.id.toString()) return res.status(403).json({ message: 'You cannot edit this ticket' });
    if (ticket.status !== 'Open') return res.status(400).json({ message: 'Only Open tickets can be edited by the Employee' });

    if (title !== undefined) {
      if (String(title).trim().length < 5 || String(title).trim().length > 100) return res.status(400).json({ message: 'Title must contain 5 to 100 characters' });
      ticket.title = String(title).trim();
    }
    if (description !== undefined) {
      if (String(description).trim().length < 10 || String(description).trim().length > 1000) return res.status(400).json({ message: 'Description must contain 10 to 1000 characters' });
      ticket.description = String(description).trim();
    }
    if (category !== undefined) {
      if (!isValidCategory(category)) return res.status(400).json({ message: 'Select a valid ticket category' });
      ticket.category = category;
    }
    if (priority !== undefined) {
      if (!isValidPriority(priority)) return res.status(400).json({ message: 'Select a valid ticket priority' });
      ticket.priority = priority;
    }
    await ticket.save();
    return res.json(await populateTicket(Ticket.findById(ticket._id)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const assignTicket = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID' });
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (['Resolved', 'Closed'].includes(ticket.status)) return res.status(400).json({ message: 'Resolved or Closed tickets cannot be assigned' });

    ticket.assignedAgent = req.user.id;
    if (ticket.status === 'Open') ticket.status = 'Assigned';
    await ticket.save();

    await createNotification({
      recipientUserId: ticket.createdBy,
      ticketId: ticket._id,
      type: 'TICKET_ASSIGNED',
      message: `${ticket.ticketNumber} has been assigned to ${req.user.name}.`,
    });
    return res.json(await populateTicket(Ticket.findById(ticket._id)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePriority = async (req, res) => {
  const { priority } = req.body;
  if (!isValidPriority(priority)) return res.status(400).json({ message: 'Select a valid ticket priority' });
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID' });
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.status === 'Closed') return res.status(400).json({ message: 'Closed tickets cannot be modified' });
    ticket.priority = priority;
    await ticket.save();
    return res.json(await populateTicket(Ticket.findById(ticket._id)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID' });
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (['Resolved', 'Closed'].includes(ticket.status)) return res.status(400).json({ message: 'Resolved or Closed tickets cannot use normal status update' });

    const allowed = {
      Open: ['Assigned'],
      Assigned: ['In Progress'],
      'In Progress': ['Assigned'],
    };
    if (!allowed[ticket.status]?.includes(status)) {
      return res.status(400).json({ message: `Cannot change status from ${ticket.status} to ${status}` });
    }
    if (status === 'Assigned' && !ticket.assignedAgent) ticket.assignedAgent = req.user.id;
    ticket.status = status;
    await ticket.save();

    await createNotification({
      recipientUserId: ticket.createdBy,
      ticketId: ticket._id,
      type: 'STATUS_CHANGED',
      message: `${ticket.ticketNumber} status changed to ${ticket.status}.`,
    });
    return res.json(await populateTicket(Ticket.findById(ticket._id)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resolveTicket = async (req, res) => {
  const { resolutionNotes } = req.body;
  if (!resolutionNotes || String(resolutionNotes).trim().length < 10) {
    return res.status(400).json({ message: 'Resolution notes must contain at least 10 characters' });
  }
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID' });
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.status !== 'In Progress') return res.status(400).json({ message: 'Ticket must be In Progress before it can be resolved' });
    if (!ticket.assignedAgent) ticket.assignedAgent = req.user.id;

    ticket.resolutionNotes = String(resolutionNotes).trim();
    ticket.status = 'Resolved';
    ticket.resolvedAt = new Date();
    await ticket.save();

    await createNotification({
      recipientUserId: ticket.createdBy,
      ticketId: ticket._id,
      type: 'TICKET_RESOLVED',
      message: `${ticket.ticketNumber} has been resolved. Review the resolution notes in the ticket.`,
    });
    return res.json(await populateTicket(Ticket.findById(ticket._id)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const closeTicket = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID' });
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.createdBy.toString() !== req.user.id.toString()) return res.status(403).json({ message: 'You cannot close this ticket' });
    if (ticket.status !== 'Resolved') return res.status(400).json({ message: 'Only Resolved tickets can be closed' });
    ticket.status = 'Closed';
    ticket.closedAt = new Date();
    await ticket.save();
    return res.json(await populateTicket(Ticket.findById(ticket._id)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
