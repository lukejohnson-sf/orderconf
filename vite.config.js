import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from a GitHub project Pages subpath (lukejohnson-sf.github.io/orderconf/).
  base: '/orderconf/',
  plugins: [react(), tailwindcss()],
})
