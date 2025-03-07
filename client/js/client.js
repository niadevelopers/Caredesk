
const blogsContainer = document.getElementById('blogs');
const searchBar = document.getElementById('search-bar');
const categoryLinks = document.getElementById('categories');
let blogs = []; // Stores all blogs fetched from the server
let blogOffset = 15; // Keeps track of how many blogs have been loaded

// ✅ Fetch & Display the First 15 Blogs Instantly
async function fetchFirstBlogs() {
  try {
    const response = await fetch('/api/blog/first-blogs');
    blogs = await response.json();
    displayBlogs(blogs);
  } catch (err) {
    console.error('❌ Error fetching first blogs:', err.message);
    blogsContainer.innerHTML = '<p>Error loading blogs. Please try again later.</p>';
  }
}

//Fetch & Display More Blogs in the Background
async function fetchMoreBlogs() {
  try {
    const response = await fetch(`/api/blog/more-blogs?skip=${blogOffset}`);
    const newBlogs = await response.json();

    if (newBlogs.length > 0) {
      displayBlogs(newBlogs, true);
      blogOffset += newBlogs.length;
    } else {
      document.getElementById('loadMoreBtn').style.display = 'none';
    }
  } catch (err) {
    console.error('❌ Error fetching more blogs:', err.message);
  }
}

//Fetch Blogs by Category (Loads 15 at a Time)
async function fetchBlogsByCategory(category, page = 1, append = false) {
  try {
    const response = await fetch(`/api/blog/category/${category}?page=${page}`);
    const { blogs: categoryBlogs, hasMore } = await response.json();

    if (!append) {
      blogsContainer.innerHTML = ''; 
    }

    displayBlogs(categoryBlogs, append);

    if (hasMore) {
      renderLoadMoreButton(category, page + 1);
    }
  } catch (err) {
    console.error(`❌ Error fetching ${category} blogs:`, err.message);
  }
}

//display blogs
function displayBlogs(blogsToDisplay, append = false) {
  const blogHTML = blogsToDisplay.map(blog => {
    let mediaElement = "";

    // ✅ Check if a video link is present and determine its platform
    if (blog.video) {
      if (isYouTubeLink(blog.video)) {
        const videoId = extractYouTubeVideoID(blog.video);
        mediaElement = videoId
          ? `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
          : `<a href="${blog.video}" target="_blank">Watch Video</a>`;
      } else if (isTikTokLink(blog.video)) {
        mediaElement = `<blockquote class="tiktok-embed" cite="${blog.video}" data-video-id="${extractTikTokVideoID(blog.video)}" style="max-width: 100%;min-width: 325px;">
          <a href="${blog.video}">Watch on TikTok</a></blockquote>
          <script async src="https://www.tiktok.com/embed.js"></script>`;
      } else if (isFacebookLink(blog.video)) {
        mediaElement = `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(blog.video)}&show_text=false" width="100%" height="300" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen></iframe>`;
      } else {
        mediaElement = `<a href="${blog.video}" target="_blank">Watch Video</a>`;
      }
    }
    // ✅ Display Image if available
    else if (blog.image) {
      mediaElement = `<img src="${blog.image}" alt="${blog.title}" />`;
    }

    return `
      <div class="blog-card" data-id="${blog._id}">
        <div class="media">${mediaElement}</div>
        <h2>${blog.title}</h2>
        <div class="blog-content">${blog.content.substring(0, 100)}...</div>
        <div class="actions">
          <button onclick="likeBlog('${blog._id}')">❤️ <span class="like-count">${blog.likes || 0}</span></button>
          <button onclick="window.location.href='blog.html?id=${blog._id}'">Read More</button>
          <button onclick="window.location.href='comments.html?blogId=${blog._id}'">💬 Comments</button>
          <button onclick="shareBlog('${blog._id}')">🔗 Share</button>
        </div>
        <span class="category">${blog.category}</span>
      </div>
    `;
  }).join('');

  if (append) {
    blogsContainer.innerHTML -= blogHTML;
  } else {
    blogsContainer.innerHTML = blogHTML;
  }
}
 

// ✅ Helper Functions to Identify Video Platforms
function isYouTubeLink(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function isTikTokLink(url) {
  return url.includes("tiktok.com");
}

function isFacebookLink(url) {
  return url.includes("facebook.com") || url.includes("fb.watch");
}

// ✅ Extract YouTube Video ID
function extractYouTubeVideoID(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/|.*vi=|.*\/vi\/|.*\/embed\/|.*\/shorts\/|.*v%3D|.*vi%3D))([^?&/%]+)/);
  return match ? match[1] : null;
}

// ✅ Extract TikTok Video ID
function extractTikTokVideoID(url) {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

//like a blog and only refresh the liked blog 
async function likeBlog(id) {
  try {
    const response = await fetch(`/api/blog/like/${id}`, { method: 'POST' });

    if (response.ok) {
      const { likes, blogId } = await response.json();

      const blogCard = blogsContainer.querySelector(`[data-id="${blogId}"]`);
      if (blogCard) {
        const likeCountSpan = blogCard.querySelector('.like-count');
        if (likeCountSpan) {
          likeCountSpan.textContent = likes;
        }
      }
    } else {
      console.error('❌ Failed to like the blog:', response.statusText);
    }
  } catch (err) {
    console.error('❌ Error liking blog:', err.message);
  }
}

//Create & Attach "Load More" Button
function renderLoadMoreButton(category, nextPage) {
  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.textContent = 'Load More';
  loadMoreBtn.id = 'loadMoreBtn';
  loadMoreBtn.classList.add('load-more-btn');
  loadMoreBtn.onclick = () => fetchBlogsByCategory(category, nextPage, true);

  document.querySelector('.load-more-btn')?.remove();
  blogsContainer.insertAdjacentElement('afterend', loadMoreBtn);
}


searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase();
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(query)
  );
  displayBlogs(filteredBlogs);
});



const shareBlog = async (id) => {
  try {
    const response = await fetch(`/api/blog/share/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog share link');
    }

    const data = await response.json();
    const blogUrl = data.blogUrl;
    const previewText = data.previewText;
    const mediaPreview = data.mediaPreview; // ✅ Image or video preview

    const shareText = `📢 ${previewText} Read more: 👇 ${blogUrl}`;

    // ✅ Social Media Share Links (with media preview support)
    const shareLinks = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}&quote=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`,
    };

    // ✅ Share Popup UI (includes media preview)
    const sharePopup = `
      <div class="share-popup">
        <h3>📢 Share this Blog</h3>
        ${mediaPreview ? `<img src="${mediaPreview}" class="share-preview-media" alt="Preview" />` : ''}
        <p>${previewText}</p>
        <a href="${shareLinks.whatsapp}" target="_blank" class="fab fa-whatsapp" title="Share on WhatsApp"></a>
        <a href="${shareLinks.twitter}" target="_blank" class="fab fa-twitter" title="Share on Twitter"></a>
        <a href="${shareLinks.facebook}" target="_blank" class="fab fa-facebook" title="Share on Facebook"></a>
        <a href="${shareLinks.linkedin}" target="_blank" class="fab fa-linkedin" title="Share on LinkedIn"></a>
        <button onclick="closeSharePopup()">❌ Close</button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', sharePopup);
  } catch (err) {
    console.error('Error sharing blog:', err.message);
  }
};

// ✅ Close the share popup
const closeSharePopup = () => {
  const popup = document.querySelector('.share-popup');
  if (popup) {
    popup.remove();
  }
};



// ✅ Function to Update Open Graph & Twitter Meta Tags
function updateMetaTags(blog) {
  document.getElementById("og-title").setAttribute("content", blog.title);
  document.getElementById("og-description").setAttribute("content", blog.content.substring(0, 100));
  document.getElementById("og-url").setAttribute("content", window.location.href);

  // ✅ Show Blog Image if Available, Otherwise Show Video Thumbnail
  if (blog.image) {
    document.getElementById("og-image").setAttribute("content", blog.image);
    document.getElementById("twitter-image").setAttribute("content", blog.image);
  } else if (blog.video) {
    document.getElementById("og-image").setAttribute("content", `https://img.youtube.com/vi/${extractVideoID(blog.video)}/hqdefault.jpg`);
    document.getElementById("twitter-image").setAttribute("content", `https://img.youtube.com/vi/${extractVideoID(blog.video)}/hqdefault.jpg`);
  }

  document.getElementById("twitter-title").setAttribute("content", blog.title);
  document.getElementById("twitter-description").setAttribute("content", blog.content.substring(0, 100));
}


// ✅ Automatically Update Meta Tags When a Blog is Opened
document.addEventListener("DOMContentLoaded", () => {
  const blogId = new URLSearchParams(window.location.search).get("id");
  if (blogId) {
    fetch(`/api/blog/${blogId}`)
      .then((res) => res.json())
      .then((blog) => updateMetaTags(blog))
      .catch((err) => console.error("Error fetching blog details:", err));
  }
});


categoryLinks.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.tagName === 'A') {
    const category = e.target.dataset.category;
    if (category === 'all') {
      fetchFirstBlogs();
    } else {
      fetchBlogsByCategory(category, 1);
    }
  }
});

fetchFirstBlogs();

document.getElementById('loadMoreBtn')?.addEventListener('click', fetchMoreBlogs);
