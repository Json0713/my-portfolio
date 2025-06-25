// services/service.js
// services/test-push-development-testing-test-received-from-main
const CACHE_NAME = 'jason-portfolio-v2';
const FILES_TO_CACHE = [
  '/',
  // pages
  '/index.html',
  '/src/pages/hero.html',
  
  // css
  '/assets/css/style.css',
  '/assets/css/hero.css',
  '/assets/css/bootstrap.min.css',
  '/assets/css/bootstrap-icons.css',

  // js
  '/assets/js/main.js',
  '/assets/js/bootstrap.bundle.min.js',
  '/assets/js/security/sanitizer.js',
  '/assets/js/response/offline.js',
  '/assets/js/response/error.js',
  '/assets/js/common/loader.js',
  '/assets/js/common/toast.js',
  '/assets/js/router.js',

  // fonts
  '/assets/fonts/bootstrap-icons.woff2',
  '/assets/fonts/bootstrap-icons.woff',

  // images
  '/assets/images/dark-portfolio-profile-picture.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
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
