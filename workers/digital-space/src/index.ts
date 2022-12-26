export interface Env {
	[key: string]: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			if (request.method === 'GET') {
				const url = new URL(request.url);
				const cacheKey = new Request(url.toString(), request);
				const cache = caches.default;
				const bucketName = 'digital-space';
				const bucketHost = `https://storage.googleapis.com/${bucketName}`;

				let response = await cache.match(cacheKey);

				if (!response) {
					response = await fetch(`${bucketHost}${url.pathname}`);
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
				return new Response(`Error thrown ${err.message}`, { status: 500 });
			}
			return new Response(`Error thrown ${err}`, { status: 500 });
		}
	},
};
