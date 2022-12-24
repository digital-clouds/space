export default {
	async fetch(request, env, ctx) {
		const BUCKET_NAME = 'digital-space';
		const BUCKET_HOST = `https://storage.googleapis.com/${BUCKET_NAME}`;

		try {
			if (request.method === 'GET') {
				const url = new URL(request.url);
				const cacheKey = new Request(url.toString(), request);
				const cache = caches.default;

				let response = await cache.match(cacheKey);

				if (!response) {
					response = await fetch(`${BUCKET_HOST}${url.pathname}`);
					const headers = {
						'Cache-Control': 'public, max-age=14400',
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Headers': '*',
						'Access-Control-Allow-Methods': 'GET, OPTIONS',
						'Access-Control-Max-Age': '86400',
						'x-goog-project-id': 'digital-clouds',
					};
					response = new Response(response.body, { ...response, headers });
					ctx.waitUntil(cache.put(cacheKey, response.clone()));
				}

				if (response.status > 399) {
					response = new Response(response.statusText, { status: response.status });
				}
				return response;
			} else {
				return new Response('Method not allowed', { status: 405 });
			}
		} catch (err) {
			if (err instanceof Error) {
				return new Response(`Error thrown ${err.message}`);
			}
		}
	},
};
