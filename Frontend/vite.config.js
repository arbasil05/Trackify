import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Trackify',
        short_name: 'trackify',
        description: 'A Dashboard to manage credits',
        theme_color: '#000000ff',
        background_color: '#ffffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa_192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa_512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })

  ]
})
