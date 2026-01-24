const CACHE_NAME = 'master-plan-v3-fix-2';
const urlsToCache = [
  '/',
  '/index.html',
  '/regimen.html',
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
  const url = new URL(event.request.url);
  
  // SAFETY: IGNORE ALL LOCALHOST REQUESTS
  // This prevents the SW from caching dev server assets or interfering with HMR
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // IGNORE VITE DEV SERVER REQUESTS (Fixes "Failed to fetch" in dev)
  if (url.pathname.includes('@vite') || 
      url.pathname.includes('@react-refresh') || 
      url.pathname.includes('src/') ||
      url.pathname.includes('node_modules')) {
     return;
  }

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
      vibrate: data.vibrate || [200, 100, 200, 100, 200, 100, 200], // Aggressive vibration
      tag: 'timer-alarm', // Grouping
      renotify: true, // Alert again even if open
      requireInteraction: true, // Keep on screen until clicked
      timestamp: Date.now(),
      data: {
        url: data.url || '/'
      },
      actions: [
        {action: 'explore', title: 'Open Timer', icon: '/icon-mp.svg'}
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