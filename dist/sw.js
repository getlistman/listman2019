var CACHE_NAME = 'listman-cache';
var urlsToCache = [
  '/',
  '/dist/bundle/main.js',
  '/dist/css/bulma.css',
  '/dist/css/fontawesome-5.9.0-all.min.css',
  '/dist/webfonts/fa-brands-400.woff2',
  '/dist/webfonts/fa-regular-400.woff2',
  '/dist/webfonts/fa-solid-900.woff2'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log('cache hit')
          return response;
        }
        console.log('cache not hit')
        return fetch(event.request);
      }
    )
  );
});
