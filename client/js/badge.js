// Function to fetch blogs from your API
async function fetchBlogs() {
  try {
    const response = await fetch('api/blog/first-blogs');  // Your API endpoint to fetch blogs
    const blogs = await response.json();
    
    // Get the number of blogs stored previously
    const storedBlogCount = localStorage.getItem('blogCount') || 0;
    
    // If the fetched blogs are more than the stored count, it means there is a new blog
    if (blogs.length > storedBlogCount) {
      setNewBlogBadge(true, blogs.length);  // Pass the blog count to updateAppBadge
    } else {
      setNewBlogBadge(false, 0);  // No new blogs, set count to 0
    }
    
    // Update the blog count in localStorage
    localStorage.setItem('blogCount', blogs.length);

  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
}

// Call the function when the page loads to check for new blogs
document.addEventListener('DOMContentLoaded', fetchBlogs);

// Function to show or hide the new blog badge
function setNewBlogBadge(isNewBlogAvailable, blogCount) {
  const badgeElement = document.getElementById('appBadge');  // The badge element in your UI (can be an icon or div)
  
  if (isNewBlogAvailable) {
    // Show the badge or dot (you can style it as a dot or a number)
    badgeElement.style.display = 'block';
  } else {
    // Hide the badge if no new blog
    badgeElement.style.display = 'none';
  }
  
  // Optionally update the browser tab (favicon or title)
  updateAppBadge(isNewBlogAvailable, blogCount);  // Pass the blog count to updateAppBadge
}

// Function to update the favicon or title for the badge
function updateAppBadge(isNewBlogAvailable, blogCount) {
  if (isNewBlogAvailable) {
    document.title = `${blogCount} New Blogs`;  // Using the blog count instead of undefined 'count'
    // You could also change the favicon to show a dot (using Favico.js or manually updating it)
  } else {
    document.title = "Caredesk";  // Reset title
  }
}
