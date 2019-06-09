self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
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
