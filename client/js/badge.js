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

// Listen for the message from the service worker
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'NEW_BLOG') {
      // Show the app badge
      const appBadge = document.getElementById('appBadge');
      appBadge.style.display = 'block'; // Show the badge

      // Show the toast notification
      const toastNotification = document.getElementById('toastNotification');
      toastNotification.style.display = 'block'; // Show the toast

      // Hide the toast notification after 5 seconds
      setTimeout(() => {
        toastNotification.style.display = 'none';
      }, 5000); // Duration of toast message

      // Hide the badge after 5 seconds (optional)
      setTimeout(() => {
        appBadge.style.display = 'none';
      }, 5000); // Duration of badge visibility
    }
  });
}
