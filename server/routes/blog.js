const express = require('express');
const multer = require('multer');
const Blog = require('../models/Blog');

const router = express.Router();

// ✅ Create a new blog post (Fix: Correct Validation for Media URLs)
router.post('/create', async (req, res) => {
  try {
    const { title, content, category, image, video } = req.body;

    // ✅ Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }

    // ✅ Ensure either an image OR a video is provided (Fix: Correct logic)
    if (!image?.trim() && !video?.trim()) {
      return res.status(400).json({ error: 'Either an image URL or a video URL is required.' });
    }

    // ✅ Validate URL format
    const validURL = (url) => url && /^(https?:\/\/)/.test(url);

    if (image && !validURL(image)) {
      return res.status(400).json({ error: 'Invalid image URL. Ensure it starts with "http" or "https".' });
    }

    if (video && !validURL(video)) {
      return res.status(400).json({ error: 'Invalid video URL. Ensure it starts with "http" or "https".' });
    }

    // ✅ Save the blog with the provided URLs
    const newBlog = new Blog({
      title,
      content,
      category,
      image: image?.trim() || null,  // Store only if provided
      video: video?.trim() || null,  // Store only if provided
      likes: 0,
    });

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
    const { skip = 15 } = req.query; // Start fetching after first 15
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


// ✅ Generate a shareable blog link with correct frontend domain & media preview
router.get('/share/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    // ✅ Strip HTML tags from the preview text
    const previewText = blog.content 
      ? blog.content.replace(/(<([^>]+)>)/gi, "").substring(0, 40) + "..." 
      : "Check out this blog!";

    // ✅ Use the correct frontend domain instead of backend
    const blogUrl = `https://caredesk.site/blog.html?id=${blog._id}`;

    // ✅ Select the correct media preview (image or video thumbnail)
    let mediaPreview = blog.image || blog.video;
    if (blog.video) {
      mediaPreview += "#t=0,6"; // Show first 6 seconds of the video preview
    }

    res.status(200).json({ blogUrl, previewText, mediaPreview });
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
