let staticCacheName = 'neighbourhood-static-v1';

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function (cache) {
			return cache.addAll([
				'/',
				'public/favicon.ico',
				'public/index.html',
				'src/icons/add.svg',
				'src/icons/arrow-back.svg',
				'src/icons/arrow-drop-down.svg',
				'src/App.css',
				'src/App.js',
				'src/App.test.js',
				'src/BooksAPI.js',
				'src/index.css',
				'src/index.js',
				'sw.js',
			]);
		})
	);
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					return cacheName.startsWith('neighbourhood-') &&
						cacheName != staticCacheName;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
})

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});