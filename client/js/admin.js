document.getElementById('blogForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const category = document.getElementById('category').value;
  const image = document.getElementById('imageUrl').value.trim();
  const video = document.getElementById('videoUrl').value.trim();

  // ✅ Ensure at least one media is provided
  if (!image && !video) {
    alert('You must provide either an image URL or a video URL.');
    return;
  }

  // ✅ Validate URL Format (Ensuring URLs start with "http" or "https")
  const validURL = (url) => url && /^(https?:\/\/)/.test(url);

  if (image && !validURL(image)) {
    alert('Invalid image URL. Ensure it starts with "http" or "https".');
    return;
  }

  if (video && !validURL(video)) {
    alert('Invalid video URL. Ensure it starts with "http" or "https".');
    return;
  }

  const formData = { title, content, category, image, video };

  try {
    const response = await fetch('/api/blog/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert('🎉 Blog created successfully!');
      fetchAdminBlogs(); // ✅ Reload blog list for admin
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ Error submitting blog:', error);
    alert('An unexpected error occurred while submitting the blog.');
  }
});

// ✅ Fetch and Display All Blogs for Admin Panel
const adminBlogsContainer = document.getElementById('admin-blogs');

const fetchAdminBlogs = async () => {
  try {
    const response = await fetch('/api/blog/first-blogs');
    const blogs = await response.json();

    if (blogs.length === 0) {
      adminBlogsContainer.innerHTML = '<p>No blogs available.</p>';
      return;
    }

    adminBlogsContainer.innerHTML = blogs
      .map(
        (blog) => `
      <div class="admin-blog-card" data-id="${blog._id}">
        <h3>${blog.title}</h3>
        <p>${blog.content.substring(0, 100)}...</p>
        <p><strong>Category:</strong> ${blog.category}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
      `
      )
      .join('');
  } catch (err) {
    console.error('❌ Error fetching blogs:', err.message);
    adminBlogsContainer.innerHTML = '<p>Error loading blogs. Please try again later.</p>';
  }
};

// ✅ Edit Blog
const editBlog = async (id) => {
  const newTitle = prompt('Enter new title:');
  const newContent = prompt('Enter new content:');
  const newCategory = prompt('Enter new category:');
  const newImage = prompt('Enter new image URL (leave empty to keep the same):');
  const newVideo = prompt('Enter new YouTube Video URL (leave empty to keep the same):');

  if (!newTitle || !newContent || !newCategory) {
    alert('Title, content, and category are required.');
    return;
  }

  try {
    const response = await fetch(`/api/blog/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        category: newCategory,
        image: newImage || null,
        video: newVideo || null,
      }),
    });

    if (response.ok) {
      alert('Blog updated successfully.');
      fetchAdminBlogs();
    } else {
      const errorData = await response.json();
      alert(`❌ Error: ${errorData.error}`);
    }
  } catch (err) {
    console.error('❌ Error editing blog:', err.message);
    alert('An error occurred while editing the blog.');
  }
};

// ✅ Delete Blog
const deleteBlog = async (id) => {
  if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch(`/api/blog/delete/${id}`, { method: 'DELETE' });

    if (response.ok) {
      alert('Blog deleted successfully.');
      fetchAdminBlogs();
    } else {
      const errorData = await response.json();
      alert(`❌ Error: ${errorData.error}`);
    }
  } catch (err) {
    console.error('❌ Error deleting blog:', err.message);
    alert('An error occurred while deleting the blog.');
  }
};

// ✅ Handle Edit and Delete Buttons
adminBlogsContainer.addEventListener('click', (e) => {
  const blogCard = e.target.closest('.admin-blog-card');
  const blogId = blogCard?.dataset.id;

  if (e.target.classList.contains('edit-btn')) {
    editBlog(blogId);
  } else if (e.target.classList.contains('delete-btn')) {
    deleteBlog(blogId);
  }
});

// ✅ Load Blogs on Page Load
fetchAdminBlogs();
