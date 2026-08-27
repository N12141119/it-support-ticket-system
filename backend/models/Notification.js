const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    type: {
      type: String,
      enum: ['NEW_TICKET', 'TICKET_ASSIGNED', 'STATUS_CHANGED', 'TICKET_RESOLVED'],
      required: true,
    },
    message: { type: String, required: true, trim: true, maxlength: 300 },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
