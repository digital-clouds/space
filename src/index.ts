export default {
  async fetch(request: Request, env: any, context: any): Promise<Response> {
    const name = 'digital-space'
    const bucket = `https://storage.googleapis.com/${name}`

    if (request.method === 'GET') {
      const url = new URL(request.url)
      const cache = caches.default
      const cacheKey = new Request(url.toString(), request)
      let response = await cache.match(cacheKey)

      if (!response) {
        response = await fetch(request)
        response = await fetch(`${bucket}${url.pathname}`)
        const headers = {
          'cache-Control': 'public, max-age=14400, s-maxage=84000',
          'x-goog-project-id': 'digital-clouds',
          'access-control-allow-origin': '*',
        }
        response = new Response(response.body, { ...response, headers })
        context.waitUntil(cache.put(cacheKey, response.clone()))
      }

      if (response.status > 399) {
        response = new Response(response.statusText, { status: response.status })
      }
      return response
    } else {
      return new Response('Method not allowed', { status: 405 })
    }
  },
}
