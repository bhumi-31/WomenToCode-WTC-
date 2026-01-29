const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  registrationNo: {
    type: String,
    required: [true, 'Registration number is required'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    enum: ['tech', 'research', 'content', 'guest-relation', 'administration']
  },
  whyJoin: {
    type: String,
    required: [true, 'Please tell us why you want to join'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Membership', membershipSchema);
