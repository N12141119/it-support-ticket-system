const mongoose = require('mongoose');
const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientUserId: req.user.id })
      .populate('ticketId', 'ticketNumber title status')
      .sort({ createdAt: -1 })
      .limit(100);
    const unreadCount = await Notification.countDocuments({ recipientUserId: req.user.id, isRead: false });
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid notification ID' });
  try {
    const notification = await Notification.findOne({ _id: req.params.id, recipientUserId: req.user.id });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotifications, markAsRead };
