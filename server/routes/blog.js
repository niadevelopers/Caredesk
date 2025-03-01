const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Blog = require('../models/Blog');

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

// ✅ Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'caredesk-blogs',
      resource_type: file.mimetype.includes('video') ? 'video' : 'image',
      allowed_formats: ['jpg', 'png', 'mp4']
    };
  }
});

const upload = multer({ storage });

// ✅ Create a new blog post with Cloudinary image/video
router.post('/create', upload.single('media'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }

    // ✅ Use Cloudinary URL instead of local storage path
    const mediaUrl = req.file ? req.file.path : null;

    if (!mediaUrl) {
      return res.status(400).json({ error: 'At least one media file (image or video) is required.' });
    }

    // ✅ Save blog to database
    const newBlog = new Blog({ title, content, category, image: mediaUrl, video: mediaUrl, likes: 0 });
    await newBlog.save();

    res.status(201).json({ message: 'Blog created successfully.', blog: newBlog });
  } catch (err) {
    console.error('Error creating blog post:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch first 15 blogs (for initial page load)
router.get('/first-blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(15);
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching first blogs:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch more blogs in batches
router.get('/more-blogs', async (req, res) => {
  try {
    const { skip = 15 } = req.query;
    const limit = 15;

    const blogs = await Blog.find().sort({ createdAt: -1 }).skip(Number(skip)).limit(limit);
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching more blogs:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch blogs by category with pagination
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1 } = req.query;
    const limit = 15;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ category }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalBlogs = await Blog.countDocuments({ category });
    const hasMore = totalBlogs > skip + limit;

    res.status(200).json({ blogs, hasMore });
  } catch (err) {
    console.error('Error fetching category blogs:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Like a blog (Only updates the liked blog)
router.post('/like/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json({ likes: blog.likes, blogId: blog._id });
  } catch (err) {
    console.error('Error liking blog:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Generate a shareable blog link with the correct frontend URL
router.get('/share/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    const previewText = blog.content ? blog.content.substring(0, 40) + "..." : "Check out this blog!";
    
    // ✅ Ensure the frontend URL is used instead of the backend URL
    const blogUrl = `https://caredesk.site/blog.html?id=${blog._id}`;

    res.status(200).json({ blogUrl, previewText });
  } catch (err) {
    console.error('Error generating share link:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Delete a blog
router.delete('/delete/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json({ message: 'Blog deleted successfully.' });
  } catch (err) {
    console.error('Error deleting blog:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Edit a blog
router.put('/edit/:id', async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json({ message: 'Blog updated successfully.', blog: updatedBlog });
  } catch (err) {
    console.error('Error editing blog:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
