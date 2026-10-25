
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const routes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Student Internship Portal API is running'
  });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

async function startServer() {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error('MONGO_DB_URI is missing from environment variables.');
    }

    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('MongoDB connected successfully!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
