import type { MetadataRoute } from 'next'

// Installable so a counter phone runs it fullscreen, like the device it replaces.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LunaBell',
    short_name: 'LunaBell',
    description: 'The bell that only rings when the lunas are real.',
    start_url: '/app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#070912',
    theme_color: '#E9B213',
    categories: ['finance', 'business'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
