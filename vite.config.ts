import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    envPrefix: 'MV_'
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    envPrefix: 'PV_'
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      tanstackRouter({
        routesDirectory: './src/renderer/src/routes'
      })
    ],
    envPrefix: 'RV_'
  }
})
