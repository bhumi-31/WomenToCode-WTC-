// ===========================================
// PASSPORT CONFIGURATION - Google & GitHub OAuth
// ===========================================
// This file configures OAuth authentication
// using Passport.js - a popular authentication middleware
// ===========================================

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// ------------------------------------------
// SERIALIZE USER
// ------------------------------------------
// Determines what data to store in the session
// We store just the user ID to keep sessions small
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ------------------------------------------
// DESERIALIZE USER
// ------------------------------------------
// Retrieves user from session using stored ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ------------------------------------------
// GOOGLE OAUTH STRATEGY
// ------------------------------------------
// This is the "recipe" for how to authenticate with Google
// 
// FLOW:
// 1. User clicks "Sign in with Google" button
// 2. User is redirected to Google's login page
// 3. User logs in and grants permission
// 4. Google redirects back with user's profile info
// 5. We check if user exists in our database
// 6. If not, we create a new user
// 7. User is logged in!
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ------------------------------------------
        // Check if user already exists with this Google ID
        // ------------------------------------------
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return them
          return done(null, user);
        }

        // ------------------------------------------
        // Check if user exists with same email
        // (They might have registered with email/password before)
        // ------------------------------------------
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.avatar = user.avatar || profile.photos[0]?.value;
          await user.save();
          return done(null, user);
        }

        // ------------------------------------------
        // Create new user
        // ------------------------------------------
        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName || profile.displayName.split(' ')[0],
          lastName: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' ') || '',
          avatar: profile.photos[0]?.value,
          authProvider: 'google',
          agreeToTerms: true, // Google users implicitly agree by using OAuth
          role: 'viewer'
        });

        return done(null, newUser);
      } catch (err) {
        console.error('Google OAuth Error:', err);
        return done(err, null);
      }
    }
  )
);

// ------------------------------------------
// GITHUB OAUTH STRATEGY
// ------------------------------------------
// Similar to Google, but for GitHub accounts
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5001/auth/github/callback',
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Get email from profile (GitHub might not always provide it)
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.local`;

        // Check if user exists with same email
        user = await User.findOne({ email: email });

        if (user) {
          // Link GitHub account to existing user
          user.githubId = profile.id;
          user.avatar = user.avatar || profile.photos[0]?.value;
          await user.save();
          return done(null, user);
        }

        // Create new user
        const displayName = profile.displayName || profile.username;
        const nameParts = displayName.split(' ');
        
        const newUser = await User.create({
          githubId: profile.id,
          email: email,
          firstName: nameParts[0] || profile.username,
          lastName: nameParts.slice(1).join(' ') || '',
          avatar: profile.photos[0]?.value,
          authProvider: 'github',
          agreeToTerms: true,
          role: 'viewer'
        });

        return done(null, newUser);
      } catch (err) {
        console.error('GitHub OAuth Error:', err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
