const express = require('express');
const Comment = require('../models/Comment');

const router = express.Router();

// Get comments for a blog
router.get('/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a comment
router.post('/:blogId', async (req, res) => {
  try {
    const { username, text } = req.body;

    if (!username || !text) {
      return res.status(400).json({ error: 'Username and text are required' });
    }

    const comment = new Comment({ blogId: req.params.blogId, username, text });
    await comment.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
