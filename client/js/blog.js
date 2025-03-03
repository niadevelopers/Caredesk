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
    
    // ✅ Embed YouTube or Facebook Video
    if (blog.video) {
      if (isYouTubeLink(blog.video)) {
        const videoId = extractYouTubeVideoID(blog.video);
        mediaElement = videoId
          ?  `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}?playlist=${videoId}&autoplay=1&loop=1&rel=0&modestbranding=1&controls=1&showinfo=0" frameborder="0" allowfullscreen></iframe>`
          : `<a href="${blog.video}" target="_blank">Watch Video</a>`;
      } else if (isFacebookLink(blog.video)) {
        mediaElement = `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(blog.video)}&show_text=false" width="100%" height="400" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen></iframe>`;
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

// ✅ Helper Functions to Identify Video Platforms
function isYouTubeLink(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function isFacebookLink(url) {
  return url.includes("facebook.com") || url.includes("fb.watch");
}

// ✅ Extract YouTube Video ID
function extractYouTubeVideoID(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/|.*vi=|.*\/vi\/|.*\/embed\/|.*\/shorts\/|.*v%3D|.*vi%3D))([^?&/%]+)/);
  return match ? match[1] : null;
}
