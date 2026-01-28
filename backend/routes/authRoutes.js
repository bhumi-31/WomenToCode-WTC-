// ===========================================
// AUTH ROUTES
// ===========================================
// Routes define the URLs and connect them to controllers
// Think of it as a "map" that says:
// "When someone visits /api/auth/login, run the login function"
// ===========================================

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Import controller functions
const { 
  register, 
  login, 
  getMe, 
  getAllUsers,
  checkAdminAccess,
  updateUserRole,
  forgotPassword,
  resetPassword,
  verifyResetToken
} = require('../controllers/authController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// ------------------------------------------
// PUBLIC ROUTES (no login required)
// ------------------------------------------
// These are for visitors who haven't logged in yet

router.post('/register', register);   // POST /api/auth/register
// ↑ Frontend sends: { firstName, lastName, email, password, agreeToTerms }

router.post('/login', login);         // POST /api/auth/login
// ↑ Frontend sends: { email, password }
// ↑ Returns: user info + token + isAdmin flag

// ------------------------------------------
// PASSWORD RESET ROUTES (public)
// ------------------------------------------
router.post('/forgot-password', forgotPassword);  // POST /api/auth/forgot-password
// ↑ Frontend sends: { email }
// ↑ Sends password reset email

router.get('/reset-password/:token/verify', verifyResetToken);  // GET /api/auth/reset-password/:token/verify
// ↑ Verify if reset token is valid

router.post('/reset-password/:token', resetPassword);  // POST /api/auth/reset-password/:token
// ↑ Frontend sends: { password }
// ↑ Sets new password

// ------------------------------------------
// PROTECTED ROUTES (login required)
// ------------------------------------------
// User must send token in header: Authorization: Bearer <token>

router.get('/me', protect, getMe);    // GET /api/auth/me
// ↑ Get current user's info

// ------------------------------------------
// UPDATE PROFILE ROUTE
// ------------------------------------------
// Allows logged-in users to update their profile information

router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, bio, location, website, github, linkedin, twitter } = req.body;
    
    const user = await require('../models/User').findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, bio, location, website, github, linkedin, twitter },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// ------------------------------------------
// ADMIN VERIFICATION ROUTE
// ------------------------------------------
// Frontend calls this when user tries to access admin dashboard
// It checks if the logged-in user is actually an admin

router.get('/check-admin', protect, authorize('admin'), checkAdminAccess);
// ↑ GET /api/auth/check-admin
// ↑ Returns: { hasAccess: true/false }

// ------------------------------------------
// ADMIN ONLY ROUTES
// ------------------------------------------
// Only users with role='admin' can access these

router.get('/users', protect, authorize('admin'), getAllUsers);
// ↑ GET /api/auth/users - Get all registered users

router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
// ↑ PUT /api/auth/users/123/role - Change a user's role
// ↑ Body: { role: 'admin' } or { role: 'viewer' }

// ===========================================
// GOOGLE OAUTH ROUTES
// ===========================================

// ------------------------------------------
// INITIATE GOOGLE LOGIN
// ------------------------------------------
// GET /api/auth/google
// Redirects user to Google's login page
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// ------------------------------------------
// GOOGLE CALLBACK
// ------------------------------------------
// GET /api/auth/google/callback
// Google redirects here after user logs in
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`
  }),
  (req, res) => {
    // Create JWT token for the authenticated user
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    // Frontend will extract token from URL and store it
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      avatar: req.user.avatar
    }))}`);
  }
);

// ===========================================
// GITHUB OAUTH ROUTES
// ===========================================

// ------------------------------------------
// INITIATE GITHUB LOGIN
// ------------------------------------------
// GET /api/auth/github
// Redirects user to GitHub's login page
router.get('/github', 
  passport.authenticate('github', { 
    scope: ['user:email'] 
  })
);

// ------------------------------------------
// GITHUB CALLBACK
// ------------------------------------------
// GET /api/auth/github/callback
// GitHub redirects here after user logs in
router.get('/github/callback',
  passport.authenticate('github', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=github_auth_failed`
  }),
  (req, res) => {
    // Create JWT token for the authenticated user
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      avatar: req.user.avatar
    }))}`);
  }
);

module.exports = router;
