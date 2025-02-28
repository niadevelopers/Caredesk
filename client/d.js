const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const Blog = require('../models/Blog');

const router = express.Router();

// ✅ Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'), // ✅ Fixed the file path issue
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (acceptedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('❌ Invalid file type. Only JPEG, PNG images, and MP4 videos are allowed.'));
    }
  },
});

// ✅ Route: Create a new blog post
router.post(
  '/create',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, content, category } = req.body;

      // ✅ Validate required fields
      if (!title || !content || !category) {
        return res.status(400).json({ error: '❌ Title, content, and category are required.' });
      }

      // ✅ Process uploaded files
      const image = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : null;
      const video = req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : null;

      if (!image && !video) {
        return res.status(400).json({ error: '❌ At least one media file (image or video) is required.' });
      }

      // ✅ Save the new blog post
      const newBlog = new Blog({ title, content, category, image, video, likes: 0 });
      await newBlog.save();

      res.status(201).json({ message: '✅ Blog post created successfully.', blog: newBlog });
    } catch (err) {
      console.error('❌ Error creating blog post:', err.message);
      res.status(500).json({ error: '❌ Internal server error', details: err.message });
    }
  }
);

// ✅ Route: Fetch all blogs for the admin panel
router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find().select('title content category createdAt');
    res.status(200).json(blogs);
  } catch (err) {
    console.error('❌ Error fetching blogs for admin:', err.message);
    res.status(500).json({ error: '❌ Internal server error' });
  }
});

// ✅ Route: Edit a blog post
router.put('/edit/:id', async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: '❌ Title, content, and category are required.' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: '❌ Blog not found.' });
    }

    res.status(200).json({ message: '✅ Blog updated successfully.', blog: updatedBlog });
  } catch (err) {
    console.error('❌ Error updating blog:', err.message);
    res.status(500).json({ error: '❌ Internal server error' });
  }
});

// ✅ Route: Delete a blog post
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ error: '❌ Blog not found.' });
    }

    res.status(200).json({ message: '✅ Blog deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting blog:', err.message);
    res.status(500).json({ error: '❌ Internal server error' });
  }
});

// ✅ Route: Admin registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if an admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({ error: '❌ Admin already registered.' });
    }

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({ error: '❌ Email and password are required.' });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save the admin
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: '✅ Admin registered successfully.' });
  } catch (err) {
    console.error('❌ Error during admin registration:', err.message);
    res.status(500).json({ error: '❌ Internal server error' });
  }
});

// ✅ Route: Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Find the admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: '❌ Invalid email or password.' });
    }

    // ✅ Compare the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: '❌ Invalid email or password.' });
    }

    res.status(200).json({ message: '✅ Login successful.' });
  } catch (err) {
    console.error('❌ Error during admin login:', err.message);
    res.status(500).json({ error: '❌ Internal server error' });
  }
});

module.exports = router;
