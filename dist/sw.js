var CACHE_NAME = 'listman-cache';
var urlsToCache = [
  '/',
  '/dist/bundle/main.js',
  '/dist/css/all.css',
  '/dist/css/bulma.css'
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
