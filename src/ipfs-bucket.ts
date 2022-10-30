addEventListener('fetch', async (event) => {
  try {
    return event.respondWith(handleRequest(event))
  } catch (err: unknown) {
    if (err instanceof Error) {
      return event.respondWith(new Response(`Error thrown ${err.message}`))
    }
  }
})

async function serveAsset(event: FetchEvent): Promise<Response> {
  const request = event.request
  const url = new URL(request.url)
  const cache = caches.default
  let response = await cache.match(request)
  if (!response) {
    const BUCKET_NAME = 'ss-o-team-bucket'
    const BUCKET_URL = `https://storageapi.fleek.co/${BUCKET_NAME}`
    response = await fetch(`${BUCKET_URL}${url.pathname}`)
    const headers = { 'cache-control': 'public, max-age=14400, s-maxage=84000' }
    response = new Response(response.body, { ...response, headers })
    event.waitUntil(cache.put(request, response.clone()))
  }
  return response
}

async function handleRequest(event: FetchEvent): Promise<Response> {
  const request = event.request
  if (request.method === 'GET') {
    let response = await serveAsset(event)
    if (response.status > 399) {
      response = new Response(response.statusText, { status: response.status })
    }
    return response
  } else {
    return new Response('Method not allowed', { status: 405 })
  }
}

export {}
