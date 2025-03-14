// ✅ Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

// ✅ Handle messages from the Service Worker
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'NEW_BLOG') {
      showNewBlogBadge(event.data.count);
      showToastNotification();
    }
  });
}

// ✅ Fetch the total number of blogs (includes pagination)
async function fetchTotalBlogCount() {
  try {
    const response = await fetch('/api/blog/first-blogs'); // Fetch first 15 blogs
    const firstBatch = await response.json();
    
    const totalFirstBatchCount = firstBatch.length; // Should be 15 initially
    let totalBlogCount = totalFirstBatchCount;

    // ✅ Fetch additional blogs in batches of 15 and count them all
    let skip = 15;
    let hasMore = totalFirstBatchCount === 15; // If we got 15, there may be more

    while (hasMore) {
      const response = await fetch(`/api/blog/more-blogs?skip=${skip}`);
      const nextBatch = await response.json();

      if (nextBatch.length > 0) {
        totalBlogCount += nextBatch.length;
        skip += 15;
      } else {
        hasMore = false; // Stop fetching if no more blogs
      }
    }

    // ✅ Compare with stored count
    const storedBlogCount = localStorage.getItem('blogCount') || 0;
    const newBlogCount = totalBlogCount - storedBlogCount;

    if (newBlogCount > 0) {
      setNewBlogBadge(true, newBlogCount);
    } else {
      setNewBlogBadge(false, 0);
    }

    // ✅ Store the latest count
    localStorage.setItem('blogCount', totalBlogCount);

    // ✅ Assume that the user has read all the blogs after loading the app
    markAllBlogsAsRead();

  } catch (error) {
    console.error('Error fetching total blog count:', error);
  }
}

// ✅ Call this when the page loads
document.addEventListener('DOMContentLoaded', fetchTotalBlogCount);

// ✅ Function to show or hide the new blog badge
function setNewBlogBadge(isNewBlogAvailable, newBlogCount) {
  const badgeElement = document.getElementById('appBadge');
  const toastElement = document.getElementById('toastNotification');

  if (isNewBlogAvailable) {
    badgeElement.style.display = 'block';
    toastElement.style.display = 'block';
    toastElement.innerHTML = `${newBlogCount} New Blogs Available!`;

    setTimeout(() => {
      badgeElement.style.display = 'none';
      toastElement.style.display = 'none';
    }, 9000);
  } else {
    badgeElement.style.display = 'none';
    toastElement.style.display = 'none';
  }

  updateAppBadge(isNewBlogAvailable, newBlogCount);
}

// ✅ Function to update favicon or title badge
function updateAppBadge(isNewBlogAvailable, newBlogCount) {
  if (isNewBlogAvailable) {
    document.title = `${newBlogCount} New Blogs`;
  } else {
    document.title = "Caredesk";
  }
}

// ✅ Mark all blogs as read when the app loads (assuming user has seen all)
function markAllBlogsAsRead() {
  // After loading blogs, assume all are read and reset title
  resetAppTitle();
}

// ✅ Reset the app title after assuming all blogs are read
function resetAppTitle() {
  document.title = "Caredesk"; // Reset to default title
}
