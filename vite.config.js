import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target: "http://localhost:2000",
        changeOrigin:true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        logLevel: 'debug'
      }
    }
  },
  plugins: [react()],
})
