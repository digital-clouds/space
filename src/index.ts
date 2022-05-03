addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event))
})

const BUCKET_NAME = 'digital-space'
const BUCKET_URL = `https://storage.googleapis.com/${BUCKET_NAME}`

async function serveAsset(event) {
  const url = new URL(event.request.url)
  const cache = caches.default
  let response = await cache.match(event.request)
  if (!response) {
    response = await fetch(`${BUCKET_URL}${url.pathname}`)
    const headers = {
      'Cache-Control': 'must-revalidate, public, max-age=15552000',
      'Cache-Control': 'max-age=14400, s-maxage=84000',
      'Cloudflare-CDN-Cache-Control': 'max-age=24400',
      'CDN-Cache-Control': 18000,
   }
   response = new Response(response.body, { ...response, headers })
   event.waitUntil(cache.put(event.request, response.clone()))
  }
  return response
}
async function handleRequest(event) {
  if (event.request.method === 'GET') {
    let response = await serveAsset(event)
    if (response.status > 399) {
      response = new Response(response.statusText, { status: response.status })
    }
    return response
  } else {
    return new Response('Method not allowed', { status: 405 })
  }
}
