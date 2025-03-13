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

// Function to show the New Blog Badge
function showNewBlogBadge(count) {
  const appBadge = document.getElementById('appBadge');
  appBadge.textContent = `New (${count})`;  // Display the number of new blogs
  appBadge.style.display = 'block'; // Make the badge visible
}

// Function to show the Toast Notification
function showToastNotification() {
  const toastNotification = document.getElementById('toastNotification');
  toastNotification.style.display = 'block'; // Show the toast
  setTimeout(() => {
    toastNotification.style.display = 'none'; // Hide the toast after 3 seconds
  }, 3000);
}
