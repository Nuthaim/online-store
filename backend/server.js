const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const fileUpload = require('express-fileupload');

// Load environment variables
dotenv.config({ path: './config.env' });



const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use('/api/', limiter);

// Simplified CORS configuration for development
if (process.env.NODE_ENV === 'production') {
  // Strict CORS for production
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
} else {
  // Permissive CORS for development to avoid issues
  app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
  }));
}

// ============================================
// STATELESS PASSPORT CONFIGURATION
// ============================================
// No session middleware needed - works the same locally and on Vercel
// Google OAuth uses stateless JWT tokens instead of sessions
// This ensures compatibility with serverless functions that don't share memory

// Initialize passport in stateless mode (no session support)
const passport = require('./config/passport');
app.use(passport.initialize());

// Add a middleware to log requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.get('origin') || 'no-origin'}`);
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.get('origin') || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(fileUpload({
  useTempFiles: false, // Use memory instead of temp files for better Windows compatibility
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true
}));

// Serve static files (keeping for backward compatibility)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection with updated options and better SSL/TLS handling
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections (reduced from 5)
      retryWrites: true,
      w: 'majority',
      // Better SSL/TLS handling
      tls: true,
      tlsAllowInvalidCertificates: false,
      // Connection retry settings
      retryReads: true,
      // Heartbeat settings to detect connection issues faster
      heartbeatFrequencyMS: 10000
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.message.includes('IP whitelist') || err.message.includes('authentication')) {
      console.error('\n⚠️  Common fixes:');
      console.error('1. Check if your IP address is whitelisted in MongoDB Atlas');
      console.error('2. Go to: https://cloud.mongodb.com -> Network Access -> Add IP Address');
      console.error('3. You can add 0.0.0.0/0 to allow all IPs (for development only)');
      console.error('4. Verify your MongoDB username and password are correct');
    } else if (err.message.includes('SSL') || err.message.includes('TLS')) {
      console.error('\n⚠️  SSL/TLS Connection Issue:');
      console.error('This might be a temporary network issue. The connection will retry automatically.');
      console.error('If this persists, check your internet connection or MongoDB Atlas status.');
    }
    // Don't exit the process, let it retry
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
  // Auto-reconnect
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
  // If it's an SSL/TLS error, log it but don't crash
  if (err.message.includes('SSL') || err.message.includes('TLS')) {
    console.error('⚠️  SSL/TLS error detected. Connection will retry...');
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

// Start connection
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Debug endpoint for testing CORS
app.get('/api/debug/cors', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.get('origin'),
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/footer', require('./routes/footer'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/superadmin', require('./routes/superAdmin'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/homepage', require('./routes/homePageSettings'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server accessible from network at: http://[YOUR_IP]:${PORT}`);
});
