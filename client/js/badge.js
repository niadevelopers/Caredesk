// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

// Handle messages from the Service Worker
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'NEW_BLOG') {
      // Show the badge and toast notification
      showNewBlogBadge(event.data.count);
      showToastNotification();
    }
  });
}

// Function to fetch blogs from your API
async function fetchBlogs() {
  try {
    const response = await fetch('api/blog/first-blogs');  // Your API endpoint to fetch blogs
    const blogs = await response.json();
    
    // Get the number of blogs stored previously
    const storedBlogCount = localStorage.getItem('blogCount') || 0;
    
    // Calculate the number of new blogs
    const newBlogCount = blogs.length - storedBlogCount;

    // If new blogs are available
    if (newBlogCount > 0) {
      setNewBlogBadge(true, newBlogCount);  // Show badge and set new blog count
    } else {
      setNewBlogBadge(false, 0);  // Hide badge if no new blogs
    }
    
    // Update the blog count in localStorage
    localStorage.setItem('blogCount', blogs.length);

  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
}

// Call the function when the page loads to check for new blogs
document.addEventListener('DOMContentLoaded', fetchBlogs);

// Function to show or hide the new blog badge (forceful)
function setNewBlogBadge(isNewBlogAvailable, newBlogCount) {
  const badgeElement = document.getElementById('appBadge');  // The badge element in your UI (can be an icon or div)
  const toastElement = document.getElementById('toastNotification');  // A fallback toast notification element

  if (isNewBlogAvailable) {
    // Forcefully show the badge or dot (you can style it as a dot or a number)
    badgeElement.style.display = 'block';

    // Show a toast notification to inform the user
    toastElement.style.display = 'block';
    toastElement.innerHTML = `${newBlogCount} New Blogs Available!`;  // Show the new blog count in the toast
    
    // Set timeout to hide the badge and toast notification after 5 seconds
    setTimeout(() => {
      badgeElement.style.display = 'none';
      toastElement.style.display = 'none';
    }, 5000);  // 5000 milliseconds = 5 seconds
  } else {
    // Hide the badge if no new blog
    badgeElement.style.display = 'none';

    // Hide the toast if no new blog
    toastElement.style.display = 'none';
  }
  
  // Optionally update the browser tab (favicon or title)
  updateAppBadge(isNewBlogAvailable, newBlogCount);  // Pass the new blog count to updateAppBadge
}

// Function to update the favicon or title for the badge
function updateAppBadge(isNewBlogAvailable, newBlogCount) {
  if (isNewBlogAvailable) {
    document.title = `${newBlogCount} New Blogs`;  // Using the new blog count
  } else {
    document.title = "Caredesk";  // Reset title
  }
}
