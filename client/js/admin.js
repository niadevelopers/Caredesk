const blogForm = document.getElementById('blogForm');
const adminBlogsContainer = document.getElementById('admin-blogs');

// Handle blog creation
blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const category = document.getElementById('category').value.trim(); // Get and trim category
  const image = document.getElementById('image').files[0];
  const video = document.getElementById('video').files[0];

  // Validate input fields
  if (!title || !content || !category) {
    alert('Please provide a title, content, and category for the blog.');
    return;
  }

  // Ensure at least one media file (image or video) is uploaded
  if (!image && !video) {
    alert('Please upload at least one media file (image or video).');
    return;
  }

  // Validate video file type
  if (video && video.type !== 'video/mp4') {
    alert('Only MP4 videos are allowed.');
    return;
  }

  // Validate image file type
  if (image && !['image/jpeg', 'image/png'].includes(image.type)) {
    alert('Only JPEG and PNG images are allowed.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('category', category); // Append category to the form
  if (image) formData.append('image', image);
  if (video) formData.append('video', video);

  try {
    const response = await fetch('/api/admin/create', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      alert('Blog post submitted successfully!');
      blogForm.reset(); // Clear the form
      fetchAdminBlogs(); // Refresh the admin blogs list
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (err) {
    console.error('Error submitting blog:', err.message);
    alert('An error occurred while submitting the blog. Please try again.');
  }
});

// Fetch all blogs for the admin panel
const fetchAdminBlogs = async () => {
  try {
    const response = await fetch('/api/admin/all');
    const blogs = await response.json();

    adminBlogsContainer.innerHTML = blogs
      .map(
        (blog) => `
      <div class="admin-blog-card" data-id="${blog._id}">
        <h3>${blog.title}</h3>
        <p>${blog.content.substring(0, 100)}...</p>
        <p><strong>Category:</strong> ${blog.category}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>`
      )
      .join('');
  } catch (err) {
    console.error('Error fetching admin blogs:', err.message);
    adminBlogsContainer.innerHTML = '<p>Error loading blogs. Please try again later.</p>';
  }
};

// Edit a blog post
const editBlog = async (id) => {
  const newTitle = prompt('Enter new title:');
  const newContent = prompt('Enter new content:');
  const newCategory = prompt('Enter new category (e.g., Trending, Science Fiction):');

  if (!newTitle || !newContent || !newCategory) {
    alert('Title, content, and category are required to edit a blog.');
    return;
  }

  try {
    const response = await fetch(`/api/admin/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, content: newContent, category: newCategory }),
    });

    if (response.ok) {
      alert('Blog updated successfully.');
      fetchAdminBlogs(); // Refresh the blogs list
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (err) {
    console.error('Error editing blog:', err.message);
    alert('An error occurred while editing the blog.');
  }
};

// Delete a blog post
const deleteBlog = async (id) => {
  if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch(`/api/admin/delete/${id}`, { method: 'DELETE' });

    if (response.ok) {
      alert('Blog deleted successfully.');
      fetchAdminBlogs(); // Refresh the blogs list
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (err) {
    console.error('Error deleting blog:', err.message);
    alert('An error occurred while deleting the blog.');
  }
};

// Handle button clicks (edit and delete)
adminBlogsContainer.addEventListener('click', (e) => {
  const blogCard = e.target.closest('.admin-blog-card');
  const blogId = blogCard?.dataset.id;

  if (e.target.classList.contains('edit-btn')) {
    editBlog(blogId);
  } else if (e.target.classList.contains('delete-btn')) {
    deleteBlog(blogId);
  }
});

// Fetch blogs on page load
fetchAdminBlogs();
