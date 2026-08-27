import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/orderly-dashboard-ux-states/',
  plugins: [react()],
})
