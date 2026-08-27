const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    category: {
      type: String,
      required: true,
      enum: ['Hardware', 'Software', 'Network', 'Account / Access', 'Email', 'Other'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolutionNotes: { type: String, trim: true, maxlength: 1500, default: '' },
    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
