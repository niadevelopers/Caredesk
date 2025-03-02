document.addEventListener("DOMContentLoaded", async () => {
  const blogContainer = document.getElementById("blog-details");
  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  if (!blogId) {
    blogContainer.innerHTML = "<p>Blog not found.</p>";
    return;
  }

  try {
    const response = await fetch(`/api/blog/${blogId}`);
    const blog = await response.json();

    if (!blog) {
      blogContainer.innerHTML = "<p>Blog not found.</p>";
      return;
    }

    let mediaElement = "";
    
    // ✅ Embed YouTube Video
    if (blog.video) {
      const videoId = extractYouTubeVideoID(blog.video);
      if (videoId) {
        mediaElement = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      } else {
        mediaElement = `<a href="${blog.video}" target="_blank">Watch Video</a>`;
      }
    }
    // ✅ Display Image
    else if (blog.image) {
      mediaElement = `<img src="${blog.image}" alt="${blog.title}" />`;
    }

    blogContainer.innerHTML = `
      <h1>${blog.title}</h1>
      <div class="media">${mediaElement}</div>
      <p>${blog.content}</p>
     
    `;

  } catch (error) {
    console.error("Error fetching blog details:", error);
    blogContainer.innerHTML = "<p>Error loading blog.</p>";
  }
});

// ✅ Extract YouTube Video ID
function extractYouTubeVideoID(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/|.*vi=|.*\/vi\/|.*\/embed\/|.*\/shorts\/|.*v%3D|.*vi%3D))([^?&/%]+)/);
  return match ? match[1] : null;
}
