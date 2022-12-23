addEventListener('fetch', async (event) => {
  try {
    return event.respondWith(handleRequest(event))
  } catch (e) {
    return event.respondWith(new Response(`Error thrown ${e.message}`))
  }
})

async function serveAsset(event) {
  const request = event.request
  const url = new URL(request.url)
  const cache = caches.default
  let response = await cache.match(request)
  if (!response) {
    const BUCKET_NAME = 'digital-space'
    const HOST_URL = `https://storage.googleapis.com/${BUCKET_NAME}`
    response = await fetch(`${HOST_URL}${url.pathname}`)
    const headers = {
      'cache-control': 'public, max-age=14400, s-maxage=84000',
      'x-goog-project-id': 'digital-clouds',
      'access-control-allow-origin': '*',
    }
    response = new Response(response.body, { ...response, headers })
    event.waitUntil(cache.put(request, response.clone()))
  }
  return response
}

async function handleRequest(event) {
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
