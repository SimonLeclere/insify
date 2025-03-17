import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'INSify',
    short_name: 'INSify',
    description: 'A notion-like editor made for fun',
    start_url: '/t/1',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    // icons: [
    //   {
    //     src: '/favicon.icon',
    //     sizes: '192x192',
    //     type: 'image/png',
    //   },
    //   {
    //     src: '/icon-512x512.png',
    //     sizes: '512x512',
    //     type: 'image/png',
    //   },
    // ],
  }
}