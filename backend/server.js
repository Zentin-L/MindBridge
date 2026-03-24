require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeRateLimiter } = require('./middleware/rateLimit');
const analyzeRoute = require('./routes/analyze');

const app = express();
const BASE_PORT = Number(process.env.PORT) || 3001;
const MAX_PORT_TRIES = 10;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Alternative
      'http://127.0.0.1:5173',
      // Add production URLs here when deploying
    ],
    credentials: true,
  })
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({ routes: 'analyze endpoint mounted at /api/analyze' });
});

// Analyze endpoint with rate limiting
app.use('/api/analyze', analyzeRateLimiter, analyzeRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server with automatic fallback if a port is already in use.
const startServer = (port, attempt = 1) => {
  const server = app.listen(port, () => {
    console.log(`🧠 MindBridge backend running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('⚠️  ANTHROPIC_API_KEY is not set');
    }
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_TRIES) {
      const nextPort = port + 1;
      console.warn(
        `⚠️  Port ${port} is in use. Retrying on port ${nextPort}...`
      );
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
};

startServer(BASE_PORT);
