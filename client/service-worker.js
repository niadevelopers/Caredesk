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
    // Notify the frontend that there is a new blog
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NEW_BLOG',
          count: event.data.count // The number of new blogs
        });
      });
    });
  }
});
