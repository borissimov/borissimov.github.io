const CACHE_NAME = 'master-plan-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon-mp.svg',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Take control immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Become active immediately
});

self.addEventListener('fetch', event => {
  // Network First, fallback to Cache strategy for HTML
  // Cache First for Assets
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

// --- PUSH NOTIFICATIONS ---
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-mp.svg',
      badge: '/icon-mp.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/'
      },
      actions: [
        {action: 'explore', title: 'View Plan', icon: '/icon-mp.svg'}
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});