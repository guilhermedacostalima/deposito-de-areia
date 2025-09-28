import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'  // <- importe o path

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // define o alias @ para src
    },
  },
})
