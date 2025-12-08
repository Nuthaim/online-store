const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// ============================================
// STATELESS OAUTH - NO SESSION REQUIRED
// ============================================
// We don't use serializeUser/deserializeUser because:
// 1. Vercel serverless functions don't share memory
// 2. Sessions won't persist between function invocations
// 3. We use JWT tokens instead for stateless authentication

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Use GOOGLE_CALLBACK_URL from environment variable
  // Falls back to localhost for local development if not set
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

  console.log('🔐 Google OAuth callback URL:', callbackURL);
  console.log('📍 Environment:', process.env.NODE_ENV || 'development');

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with same email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Update existing user with Google ID
            user.googleId = profile.id;
            user.isVerified = true;
            await user.save();
            return done(null, user);
          }

          // Create new user
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value || '',
            isVerified: true,
            password: 'google-auth-' + Math.random().toString(36).substring(2, 15) // Random password for Google users
          });

          await user.save();
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth configured successfully');
} else {
  console.log('⚠️  Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

module.exports = passport;
