const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const quizRoutes = require('./src/routes/quizRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/debug/db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const quizCount = await mongoose.connection.db.collection('quizzes').countDocuments();
    
    res.json({
      database: mongoose.connection.db.databaseName,
      collections: collections.map(c => c.name),
      quizCount: quizCount,
      status: 'Database is working correctly'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/quizzes', quizRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
  

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Connection error:', err));

module.exports = app;