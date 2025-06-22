import type { MetadataRoute } from 'next'

// Used to make the app installable as a PWA

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.APP_NAME,
    short_name: process.env.APP_NAME,
    description: 'A notion-like editor, built with BlockNoteJS.',
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