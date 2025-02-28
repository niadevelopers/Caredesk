const blogDetailsContainer = document.getElementById('blog-details');
const params = new URLSearchParams(window.location.search);
const blogId = params.get('id');

async function fetchBlogDetails() {
  try {
    const response = await fetch(`/api/blog/${blogId}`);
    const blog = await response.json();

    if (!blog || response.status !== 200) {
      throw new Error('Blog not found');
    }

    // ✅ Build media content (image or video)
    let mediaElement = "";
    if (blog.video) {
      mediaElement = `<video controls src="${blog.video}" ></video>`;
    } else if (blog.image) {
      mediaElement = `<img src="${blog.image}" alt="${blog.title}" />`;
    }

    // ✅ Render blog details with properly formatted HTML content
    blogDetailsContainer.innerHTML = `
      <h1>${blog.title}</h1>
      <div class="media">${mediaElement}</div>
      <div class="blog-content">${blog.content}</div> <!-- ✅ Render HTML content properly -->
    `;
  } catch (err) {
    console.error('❌ Error fetching blog details:', err.message);
    blogDetailsContainer.innerHTML = '<p>⚠ Error loading blog details.</p>';
  }
}

fetchBlogDetails();
