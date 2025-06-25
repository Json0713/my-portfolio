// services/service.js

const CACHE_NAME = 'jason-portfolio-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/css/bootstrap.min.css',
  '/assets/css/bootstrap-icons.css',
  '/assets/js/main.js',
  '/assets/js/bootstrap.bundle.min.js',
  '/assets/fonts/bootstrap-icons.woff2',
  '/assets/fonts/bootstrap-icons.woff',
  '/assets/images/dark-1x1-profile.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});
