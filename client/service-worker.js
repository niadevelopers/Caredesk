// Service Worker installation event
self.addEventListener('install', (event) => {
  console.log('Service Worker Installed');
  event.waitUntil(self.skipWaiting());  // Forces the service worker to activate immediately
});

// Service Worker activation event
self.addEventListener('activate', (event) => {
  console.log('Service Worker Activated');
  event.waitUntil(self.clients.claim());  // Ensures the service worker takes control immediately
});

// Fetch event to handle background fetches
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Listen for messages from the main app (badge.js)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NEW_BLOG') {
    const newBlogsCount = event.data.count;  // Get the count of new blogs
    
    // Show the notification with the count of new blogs
    self.registration.showNotification('New Blog Available!', {
      body: `You have ${newBlogsCount} new blogs.`,
      icon: 'favicon-32x32.png',
      badge: 'favicon-32x32.png',  // The badge icon that will be shown
    });

    // If the device supports app badges (Chrome on Android), set the badge on the app icon
    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(newBlogsCount).then(() => {
        console.log('App badge updated successfully');
      }).catch((error) => {
        console.error('Failed to update app badge:', error);
      });
    }
  }
});
