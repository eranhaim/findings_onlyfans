const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const profileRoutes = require('./routes/profiles');
const geoRoutes = require('./routes/geo');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

app.set('trust proxy', true);

app.use('/api/profiles', profileRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fansfinder';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
