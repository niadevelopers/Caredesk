const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const Blog = require('../models/Blog');

const router = express.Router();

// ✅ Create a new blog post (Accepts YouTube video URLs & Image URLs)
router.post('/create', async (req, res) => {
  try {
    const { title, content, category, image, video } = req.body;

    // ✅ Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }

    // ✅ Ensure at least an image or video URL is provided
    if (!image && !video) {
      return res.status(400).json({ error: 'Either an image URL or a YouTube video URL is required.' });
    }

    // ✅ If a YouTube link is provided, ensure it's a valid YouTube URL
    let videoUrl = null;
    if (video) {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)$/;
      if (!youtubeRegex.test(video)) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
      }
      videoUrl = video;
    }

    // ✅ Save the blog with media URLs (Image & YouTube Video)
    const newBlog = new Blog({
      title,
      content,
      category,
      image: image || null, // Store image URL
      video: videoUrl || null, // Store YouTube video URL
      likes: 0,
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully.', blog: newBlog });
  } catch (err) {
    console.error('Error creating blog post:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch all blogs for the admin panel
router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find().select('title content category image video createdAt');
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching blogs for admin:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Edit a blog post
router.put('/edit/:id', async (req, res) => {
  try {
    const { title, content, category, image, video } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }

    // ✅ Ensure at least one media is provided
    if (!image && !video) {
      return res.status(400).json({ error: 'Either an image URL or a YouTube video URL is required.' });
    }

    // ✅ If updating video, validate YouTube URL
    let videoUrl = null;
    if (video) {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)$/;
      if (!youtubeRegex.test(video)) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
      }
      videoUrl = video;
    }

    // ✅ Update blog post
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, category, image, video: videoUrl },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json({ message: 'Blog updated successfully.', blog: updatedBlog });
  } catch (err) {
    console.error('Error updating blog:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Delete a blog post
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json({ message: 'Blog deleted successfully.' });
  } catch (err) {
    console.error('Error deleting blog:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Admin registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({ error: 'Admin already registered.' });
    }

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Hash password & save admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (err) {
    console.error('Error during admin registration:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({ message: 'Login successful.' });
  } catch (err) {
    console.error('Error during admin login:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
