import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Deployed to https://pvns1108.github.io/prakash-kumar-portfolio/
  // If you move it to a repo named pvns1108.github.io, change this to '/'.
  base: '/prakash-kumar-portfolio/',
})
