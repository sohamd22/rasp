/// <reference types="node" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      host: '0.0.0.0',
      strictPort: true,  // Forces Vite to crash instead of finding a new port
      port: parseInt(env.VITE_PORT), // Fallback to 5173 if VITE_PORT is not set
      hmr: {
        host: 'localhost',
        port: parseInt(env.VITE_PORT),
        protocol: 'ws',
      },
      // proxy: {
      //   '/auth': {
      //     target: env.VITE_SERVER_URL,
      //     changeOrigin: true,
      //     secure: true,
      //     ws: true
      //   },
      // }
    },
    plugins: [react()],
  }
})
