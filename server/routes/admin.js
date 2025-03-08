const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/auth'); // Role-based access middleware

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Change this to a strong secret key

// ✅ Check if a Chief Admin exists before registering (Move it outside of /register)
router.get('/check-chief', async (req, res) => {
  try {
    const chiefAdmin = await Admin.findOne({ role: 'chief' });
    res.json({ chiefExists: !!chiefAdmin }); // Returns true if a Chief Admin exists
  } catch (err) {
    console.error('Error checking Chief Admin:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Admin registration (Chief Admin & Junior Admins)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body; // Role can be "chief" or "junior"

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required.' });
    }

    // Check if the number of admins exceeds or equals 10
    const adminCount = await Admin.countDocuments();
    if (adminCount >= 10) {
      return res.status(403).json({ error: 'The maximum number of admins has been reached. You cannot register more admins.' });
    }

    // Ensure only one Chief Admin exists
    if (role === 'chief') {
      const existingChiefAdmin = await Admin.findOne({ role: 'chief' });
      if (existingChiefAdmin) {
        return res.status(403).json({ error: 'Chief Admin already exists.' });
      }
    }

    // Hash password & save admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword, role });
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
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id, role: admin.role }, SECRET_KEY, { expiresIn: '2h' });

    res.status(200).json({ message: 'Login successful.', token });
  } catch (err) {
    console.error('Error during admin login:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Create a new blog post (Allowed for both Chief Admin & Junior Admins)
router.post('/create', authMiddleware(['chief', 'junior']), async (req, res) => {
  try {
    const { title, content, category, image, video } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }

    if (!image && !video) {
      return res.status(400).json({ error: 'Either an image URL or a YouTube video URL is required.' });
    }

    let videoUrl = null;
    if (video) {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)$/;
      if (!youtubeRegex.test(video)) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
      }
      videoUrl = video;
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      image: image || null,
      video: videoUrl || null,
      likes: 0,
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully.', blog: newBlog });
  } catch (err) {
    console.error('Error creating blog post:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Edit a blog post (Allowed only for Chief Admin)
router.put('/edit/:id', authMiddleware(['chief']), async (req, res) => {
  try {
    const { title, content, category, image, video } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }

    if (!image && !video) {
      return res.status(400).json({ error: 'Either an image URL or a YouTube video URL is required.' });
    }

    let videoUrl = null;
    if (video) {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)$/;
      if (!youtubeRegex.test(video)) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
      }
      videoUrl = video;
    }

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

// ✅ Delete a blog post (Allowed only for Chief Admin)
router.delete('/delete/:id', authMiddleware(['chief']), async (req, res) => {
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

module.exports = router;
