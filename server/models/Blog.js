const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  image: { type: String },  // Path to the uploaded image
  video: { type: String },  // Path to the uploaded video
  category: { type: String, required: true }, // Blog category
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', BlogSchema);
