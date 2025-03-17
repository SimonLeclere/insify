import type { MetadataRoute } from 'next'

// Used to make the app installable as a PWA

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'INSify',
    short_name: 'INSify',
    description: 'A notion-like editor made for fun',
    start_url: '/t/1',
    display: 'standalone',
    lang: "fr",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      }
    ],
  }
}