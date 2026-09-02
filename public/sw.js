// Network first. The cache exists only so a dropped connection still shows the shell.
const CACHE = 'lunabell-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  // chain reads must never come from a cache
  if (url.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {})
        return response
      })
      .catch(() => caches.match(request).then((hit) => hit || Response.error())),
  )
})
