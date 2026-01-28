// ===========================================
// EVENT MODEL
// ===========================================
// This defines what an "Event" looks like.
// 
// Events are one-time or short activities like:
// - Workshops, Webinars, Meetups
// - Conferences, Hackathons
// ===========================================

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
    // URL-friendly: "react-workshop" instead of "React Workshop"
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  image: {
    type: String,
    default: '/images/default-event.png'
  },

  // Event Type (matches frontend: Workshop, Talk, Hackathon, etc.)
  type: {
    type: String,
    enum: ['Workshop', 'Talk', 'Hackathon', 'Webinar', 'Meetup', 'Conference', 'Seminar', 'Networking', 'Other'],
    default: 'Workshop'
  },

  // Date Info (matches frontend eventsData format)
  date: {
    type: String,  // "15", "02", etc.
    required: [true, 'Date is required']
  },
  month: {
    type: String,  // "FEB", "MAR", etc.
    required: [true, 'Month is required']
  },
  year: {
    type: String,  // "2026"
    required: [true, 'Year is required']
  },
  time: {
    type: String,  // "2:00 PM - 5:00 PM"
    required: [true, 'Time is required']
  },

  // Location (single string like frontend)
  location: {
    type: String,  // "Online + LPU Campus", "Online", "LPU Auditorium"
    required: [true, 'Location is required']
  },
  isOnline: {
    type: Boolean,
    default: false
  },

  // Speaker Info (matches frontend structure)
  speaker: {
    name: {
      type: String,
      required: [true, 'Speaker name is required']
    },
    role: {
      type: String,  // "Tech Lead, Ex-Google"
      required: [true, 'Speaker role is required']
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face'
    }
  },

  // Registration
  registrationLink: {
    type: String,
    default: '#'
  },
  isFree: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  maxAttendees: {
    type: Number,
    default: 0  // 0 = unlimited
  },
  registeredCount: {
    type: Number,
    default: 0
  },

  // Organizer Info
  organizer: {
    type: String,
    default: 'WomenToCode'
  },
  contactEmail: {
    type: String
  },

  // Status
  status: {
    type: String,
    enum: ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled', 'postponed'],
    default: 'upcoming'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },

  // Tags
  tags: [{
    type: String,
    trim: true
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate slug from title before saving
eventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for faster queries
eventSchema.index({ status: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ slug: 1 });

module.exports = mongoose.model('Event', eventSchema);
