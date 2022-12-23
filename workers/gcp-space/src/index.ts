// Description: Digital Space Worker
export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// R2_BUCKET: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const BUCKET_NAME = 'gcp-space';
		const BUCKET_HOST = `https://storage.googleapis.com/${BUCKET_NAME}`;

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
	},
};
