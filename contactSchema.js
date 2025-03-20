const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  linkedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: false, // Null if it's a primary contact
  },
  linkPrecedence: {
    type: String,
    enum: ['primary', 'secondary'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    required: false,
  },
  ipAddress: {
    type: String,
    required: false,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = {
    Contact,
}
