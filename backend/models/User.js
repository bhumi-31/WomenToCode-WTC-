// ===========================================
// USER MODEL
// ===========================================
// A "Model" defines what data looks like.
// Think of it as a template/form for storing users.
// 
// Every user will have:
// - firstName (required)
// - lastName (required)
// - email (required, unique)
// - password (required, hidden)
// - agreeToTerms (must be true to register)
// - role (admin, editor, viewer)
// ===========================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // For encrypting passwords

// Define the "shape" of a User
const userSchema = new mongoose.Schema({
  // ------------------------------------------
  // GOOGLE ID (for OAuth users)
  // ------------------------------------------
  // Stores Google's unique user ID for OAuth login
  googleId: {
    type: String,
    unique: true,
    sparse: true  // Allows null for non-Google users
  },

  // ------------------------------------------
  // GITHUB ID (for OAuth users)
  // ------------------------------------------
  // Stores GitHub's unique user ID for OAuth login
  githubId: {
    type: String,
    unique: true,
    sparse: true  // Allows null for non-GitHub users
  },

  // ------------------------------------------
  // AUTH PROVIDER
  // ------------------------------------------
  // How the user signed up: 'local', 'google', or 'github'
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },

  // ------------------------------------------
  // AVATAR (profile picture)
  // ------------------------------------------
  // URL to user's profile picture (from Google/GitHub or uploaded)
  avatar: {
    type: String,
    default: null
  },

  // ------------------------------------------
  // FIRST NAME
  // ------------------------------------------
  // The user's first name (e.g., "Fatima")
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    trim: true,  // Removes extra spaces
    maxlength: [50, 'First name cannot exceed 50 characters']
  },

  // ------------------------------------------
  // LAST NAME
  // ------------------------------------------
  // The user's last name (e.g., "Khan")
  lastName: {
    type: String,
    required: function() {
      // Only required for local auth, Google might not provide it
      return this.authProvider === 'local';
    },
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    default: ''
  },

  // ------------------------------------------
  // EMAIL
  // ------------------------------------------
  // Used for login - must be unique
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,  // No two users can have same email
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },

  // ------------------------------------------
  // PASSWORD
  // ------------------------------------------
  // Will be encrypted before saving
  // Not required for OAuth users
  password: {
    type: String,
    required: function() {
      // Only required for local auth (email/password)
      return this.authProvider === 'local';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false  // Don't include password when fetching users
  },

  // ------------------------------------------
  // AGREE TO TERMS
  // ------------------------------------------
  // User must check the checkbox to register (for local auth)
  // OAuth users implicitly agree by using the service
  agreeToTerms: {
    type: Boolean,
    required: function() {
      return this.authProvider === 'local';
    },
    default: false
  },

  // ------------------------------------------
  // ROLE
  // ------------------------------------------
  // admin = full access to dashboard
  // editor = can edit content
  // viewer = regular user (default)
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer'  // New users are viewers by default
  },

  // ------------------------------------------
  // ACCOUNT STATUS
  // ------------------------------------------
  isActive: {
    type: Boolean,
    default: true
  },

  // ------------------------------------------
  // PROFILE FIELDS
  // ------------------------------------------
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters'],
    default: ''
  },
  
  website: {
    type: String,
    default: ''
  },
  
  github: {
    type: String,
    default: ''
  },
  
  linkedin: {
    type: String,
    default: ''
  },
  
  twitter: {
    type: String,
    default: ''
  },

  // ------------------------------------------
  // PASSWORD RESET FIELDS
  // ------------------------------------------
  passwordResetToken: {
    type: String,
    default: null
  },
  
  passwordResetExpires: {
    type: Date,
    default: null
  },

  // ------------------------------------------
  // TIMESTAMPS
  // ------------------------------------------
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ------------------------------------------
// VIRTUAL: Full Name
// ------------------------------------------
// This creates a "virtual" field that combines firstName + lastName
// It's not stored in database, but available when you access user.fullName
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// ------------------------------------------
// BEFORE SAVING: Encrypt the password
// ------------------------------------------
// This runs automatically before saving a user
// It converts "password123" into a scrambled version
// So even if database is hacked, passwords are safe
userSchema.pre('save', async function(next) {
  // Only encrypt if password was changed
  if (!this.isModified('password')) return next();
  
  // Encrypt password (10 = encryption strength)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ------------------------------------------
// METHOD: Check if password is correct
// ------------------------------------------
// Used during login to verify password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
module.exports = mongoose.model('User', userSchema);
