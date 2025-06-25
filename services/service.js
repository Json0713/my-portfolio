// services/service.js

const CACHE_NAME = 'jason-portfolio-v1';
const FILES_TO_CACHE = [
  '/',
  // pages
  '/index.html',
  '/src/pages/hero.html',
  // css
  '/assets/css/style.css',
  'assets/css/hero.css',
  // js
  '/assets/js/main.js',
  // bootstrap
  '/assets/css/bootstrap.min.css',
  '/assets/css/bootstrap-icons.css',
  '/assets/js/bootstrap.bundle.min.js',
  // fonts
  '/assets/fonts/bootstrap-icons.woff2',
  '/assets/fonts/bootstrap-icons.woff',
  // js modules
  '/assets/js/response/offline.js',
  // assets 
  '/assets/images/dark-portfolio-profile-picture.jpeg',
  
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          // Serve index.html for SPA to allow JS fallback (offline.js will handle UI)
          return caches.match('/index.html');
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
