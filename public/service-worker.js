// public/service-worker.js

const CACHE_NAME = 'jason-portfolio-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',

  // CSS
  '/assets/css/style.css',
  '/assets/css/hero.css',
  '/assets/css/bootstrap.min.css',
  '/assets/css/bootstrap-icons.css',

  // JS
  '/assets/js/main.js',
  '/assets/js/bootstrap.bundle.min.js',
  '/assets/js/security/sanitizer.js',
  '/assets/js/response/offline.js',
  '/assets/js/response/error.js',
  '/assets/js/common/loader.js',
  '/assets/js/common/toast.js',
  '/assets/js/router.js',

  // Fonts
  '/assets/fonts/bootstrap-icons.woff2',
  '/assets/fonts/bootstrap-icons.woff',

  // Images
  '/assets/images/dark-portfolio-profile-picture.jpeg'
];

// Install: cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: remove old caches
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

// Fetch: respond from cache, fallback to network, then fallback to offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          if (event.request.destination === 'image') {
            return new Response('', { status: 200 });
          }
          if (event.request.destination === 'font') {
            return caches.match('/assets/fonts/bootstrap-icons.woff2');
          }
          if (event.request.destination === 'style') {
            return caches.match('/assets/css/style.css');
          }
          if (event.request.destination === 'script') {
            return caches.match('/assets/js/main.js');
          }
        });
    })
  );
});
