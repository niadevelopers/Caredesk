const express = require('express'); 
const mongoose = require('mongoose');
const path = require('path');  // ✅ Fixed (Removed duplicate import)
const cors = require('cors');  // ✅ Correct import for CORS
const commentRoutes = require('./routes/comment');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
const db = require('./config/db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET, POST, PUT, DELETE, OPTIONS', // Allow all standard methods
  allowedHeaders: 'Content-Type, Authorization' // Allow specific headers
}));

// Database connection
db();

app.use('/api/blog', blogRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '../client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
