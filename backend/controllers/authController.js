// ===========================================
// AUTH CONTROLLER
// ===========================================
// A "Controller" contains the LOGIC for what happens
// when someone makes a request.
// 
// This controller handles:
// - Register (create new user)
// - Login (verify user and give token)
// - Get current user info
// - Check if user is admin (for dashboard access)
// - Forgot password / Reset password
// ===========================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } = require('../utils/emailService');

// ------------------------------------------
// Helper: Create JWT Token
// ------------------------------------------
// JWT (JSON Web Token) is like a "ticket" that proves you're logged in
// It's stored on the client and sent with every request
const createToken = (userId) => {
  return jwt.sign(
    { id: userId },           // What to store in the token
    process.env.JWT_SECRET,   // Secret key to sign it
    { expiresIn: '7d' }       // Token expires in 7 days
  );
};

// ------------------------------------------
// REGISTER - Create a new user
// ------------------------------------------
// POST /api/auth/register
// Body: { firstName, lastName, email, password, agreeToTerms }
// 
// FLOW:
// 1. User fills the sign-up form on frontend
// 2. Frontend sends: firstName, lastName, email, password, agreeToTerms
// 3. We check if email already exists
// 4. We check if they agreed to terms
// 5. Create the user (password gets encrypted automatically)
// 6. Send back a token so they're logged in immediately
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, agreeToTerms } = req.body;

    // ------------------------------------------
    // Validation: Check all required fields
    // ------------------------------------------
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: firstName, lastName, email, password'
      });
    }

    // ------------------------------------------
    // Validation: Must agree to terms
    // ------------------------------------------
    if (!agreeToTerms || agreeToTerms !== true) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the terms and conditions'
      });
    }

    // ------------------------------------------
    // Check if email already exists
    // ------------------------------------------
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please login instead.'
      });
    }

    // ------------------------------------------
    // Create new user
    // ------------------------------------------
    // Note: Password will be encrypted automatically (see User model)
    // Note: Role defaults to 'viewer' for security
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      agreeToTerms,
      role: 'viewer'  // New users are always viewers (not admins!)
    });

    // ------------------------------------------
    // Create token for automatic login
    // ------------------------------------------
    const token = createToken(user._id);

    // ------------------------------------------
    // Send welcome email (async, don't wait)
    // ------------------------------------------
    sendWelcomeEmail(user.email, user.firstName).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    // ------------------------------------------
    // Send success response
    // ------------------------------------------
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Women To Code!',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    // Handle validation errors from mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
};

// ------------------------------------------
// LOGIN - Authenticate user
// ------------------------------------------
// POST /api/auth/login
// Body: { email, password }
//
// FLOW:
// 1. User enters email and password on login form
// 2. We find the user by email
// 3. We check if password matches
// 4. If correct, send back token + user info (including role)
// 5. Frontend checks role to decide what to show:
//    - If role is 'admin' → show admin dashboard
//    - If role is 'viewer' → show regular user page
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ------------------------------------------
    // Validation: Check if fields provided
    // ------------------------------------------
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // ------------------------------------------
    // Find user by email
    // ------------------------------------------
    // Note: .select('+password') includes the password field
    // (normally hidden for security)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ------------------------------------------
    // Check if account is active
    // ------------------------------------------
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // ------------------------------------------
    // Verify password
    // ------------------------------------------
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ------------------------------------------
    // Create token
    // ------------------------------------------
    const token = createToken(user._id);

    // ------------------------------------------
    // Send response with role info
    // ------------------------------------------
    // IMPORTANT: Frontend uses 'role' to decide what to show
    // - 'admin' → Can access /admin/dashboard
    // - 'editor' → Can access some admin features
    // - 'viewer' → Regular user, no admin access
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,  // ← This tells frontend if user is admin
          isAdmin: user.role === 'admin'  // ← Easy check for frontend
        },
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
};

// ------------------------------------------
// GET ME - Get current logged in user
// ------------------------------------------
// GET /api/auth/me
// Requires: Token in header
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          isAdmin: user.role === 'admin',
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch user',
      error: error.message
    });
  }
};

// ------------------------------------------
// CHECK ADMIN ACCESS - Verify if user can access dashboard
// ------------------------------------------
// GET /api/auth/check-admin
// Requires: Token in header
// 
// This endpoint is called by frontend when someone tries
// to access the admin dashboard. It verifies:
// 1. User is logged in (has valid token)
// 2. User has 'admin' role
exports.checkAdminAccess = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        hasAccess: false
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
        hasAccess: false
      });
    }

    // User is admin - grant access
    res.status(200).json({
      success: true,
      message: 'Admin access granted',
      hasAccess: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not verify admin access',
      hasAccess: false,
      error: error.message
    });
  }
};

// ------------------------------------------
// GET ALL USERS - Admin only
// ------------------------------------------
// GET /api/auth/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    // Format users with fullName
    const formattedUsers = users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }));

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users: formattedUsers }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch users',
      error: error.message
    });
  }
};

// ------------------------------------------
// UPDATE USER ROLE - Admin only
// ------------------------------------------
// PUT /api/auth/users/:id/role
// This allows admin to promote a user to admin or demote them
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Validate role
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, editor, or viewer'
      });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not update user role',
      error: error.message
    });
  }
};

// ------------------------------------------
// FORGOT PASSWORD - Send reset email
// ------------------------------------------
// POST /api/auth/forgot-password
// Body: { email }
//
// FLOW:
// 1. User enters their email
// 2. We find the user
// 3. Generate a reset token
// 4. Save token to database with expiry
// 5. Send email with reset link
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }

    // Check if user signed up with OAuth
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.authProvider} login. Please sign in with ${user.authProvider} instead.`
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before saving to database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Save to user document
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
    await user.save({ validateBeforeSave: false });

    // Send email
    const emailSent = await sendPasswordResetEmail(user.email, user.firstName, resetToken);
    
    if (!emailSent) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send email. Please try again later.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email!'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
      error: error.message
    });
  }
};

// ------------------------------------------
// RESET PASSWORD - Set new password
// ------------------------------------------
// POST /api/auth/reset-password/:token
// Body: { password }
//
// FLOW:
// 1. User clicks link from email
// 2. We verify the token
// 3. Check if token hasn't expired
// 4. Update password
// 5. Clear reset token fields
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link. Please request a new one.'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Send confirmation email
    sendPasswordResetSuccessEmail(user.email, user.firstName).catch(err => {
      console.error('Failed to send password reset success email:', err);
    });

    // Create new token so user is logged in
    const authToken = createToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You are now logged in.',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        token: authToken
      }
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
      error: error.message
    });
  }
};

// ------------------------------------------
// VERIFY RESET TOKEN - Check if token is valid
// ------------------------------------------
// GET /api/auth/reset-password/:token/verify
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token from URL
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Invalid or expired reset link'
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      message: 'Token is valid'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      valid: false,
      message: 'Something went wrong'
    });
  }
};
