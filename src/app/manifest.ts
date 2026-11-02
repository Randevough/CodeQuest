import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'CodeQuest - Gamified Developer Arena',
        short_name: 'CodeQuest',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0b10',
        theme_color: '#00f0ff',
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
