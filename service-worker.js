// Cache for preloaded files
let preloadedFiles = {};

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
	if (event.data.type === 'PRELOAD_FILES') {
		preloadedFiles = event.data.files;
		console.log('Service Worker: Received preloaded files', Object.keys(preloadedFiles));
	}
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	const filename = url.pathname.split('/').pop();

	// Check if this file has been preloaded
	if (preloadedFiles[filename]) {
		console.log(`Service Worker: Serving preloaded file: ${filename}`);
		
		event.respondWith(
			Promise.resolve(
				new Response(preloadedFiles[filename], {
					status: 200,
					statusText: 'OK',
					headers: {
						'Content-Type': 'application/octet-stream',
						'Content-Length': preloadedFiles[filename].byteLength.toString()
					}
				})
			)
		);
		return;
	}

	// For all other requests, use the default behavior
	event.respondWith(fetch(event.request));
});
