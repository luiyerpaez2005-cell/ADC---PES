const CACHE_NAME = 'peaje-sombrero-v2';
const assets = [
  './',
  'index.html',
  'manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Guardando archivos en memoria para uso sin internet...');
      return cache.addAll(assets);
    }).then(() => self.skipWaiting())
  );
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Si está guardado en el teléfono, lo usa. Si no, va a buscarlo a internet.
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Si falla todo (no internet y no caché), intenta buscar al menos la página principal
      return caches.match('index.html');
    })
  );
});
