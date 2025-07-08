const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
}));

// Compression middleware
app.use(compression());

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app.up.railway.app'] // Replace with your Railway URL
    : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GradKart Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from GradKart Express Server!',
    userAgent: req.get('User-Agent')
  });
});

// Serve static files from Next.js build
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the Next.js build
  app.use(express.static(path.join(__dirname, '../../client/.next')));
  
  // Serve other static files (images, etc.)
  app.use('/_next', express.static(path.join(__dirname, '../../client/.next')));
  app.use('/static', express.static(path.join(__dirname, '../../client/public')));
  
  // Handle all other routes by serving the Next.js app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/.next/server/pages/index.html'));
  });
} else {
  // Development mode - just return a message
  app.get('*', (req, res) => {
    res.json({ 
      message: 'Server running in development mode. Start Next.js dev server separately.',
      instructions: 'Run "npm run dev" in the client folder'
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Health check: http://localhost:${port}/api/health`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🎯 Production mode: Serving Next.js build`);
  } else {
    console.log(`🔧 Development mode: Start Next.js with \"cd client && npm run dev\"`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
}); 