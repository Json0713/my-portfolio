// public/service-worker.js

const CACHE_NAME = 'jason-portfolio-v3';

const CORE_ASSETS = [
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
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

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const { request } = event;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (!res || res.status !== 200) throw new Error();
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') return response;
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
          return response;
        })
        .catch(() => handleFallback(request))
    })
  );
});

function handleFallback(request) {
  switch (request.destination) {
    case 'document':
      return caches.match('/index.html');
    case 'image':
      return new Response('', { status: 200 });
    case 'font':
      return caches.match('/assets/fonts/bootstrap-icons.woff2');
    case 'style':
      return caches.match('/assets/css/style.css');
    case 'script':
      return caches.match('/assets/js/main.js');
    default:
      return new Response('', { status: 200 });
  }
}

// NEW: broadcast update available
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

self.addEventListener('controllerchange', () => {
  console.log('[SW] Controller changed - new version now controlling page');
});

self.addEventListener('statechange', () => {
  if (self.state === 'installed') {
    self.clients.matchAll({ type: 'window' }).then(clients => {
      clients.forEach(client => client.postMessage({ type: 'NEW_VERSION_AVAILABLE' }));
    });
  }
});
