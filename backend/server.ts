import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://gayaseva.com',
  'https://www.gayaseva.com',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

// Enable CORS and JSON Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json());

// Root API Info Route
app.get('/api/info', (req, res) => {
  res.json({
    app: 'GayaSeva Backend Subsystem',
    version: '1.0.0',
    status: 'ACTIVE',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root Fallback Route
app.get('/', (req, res) => {
  res.json({
    app: 'GayaSeva Backend Subsystem',
    status: 'ACTIVE',
  });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 GayaSeva Backend Server running on port ${PORT}`);
  console.log(`=======================================================`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: Closing server.');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: Closing server.');
  server.close(() => process.exit(0));
});
