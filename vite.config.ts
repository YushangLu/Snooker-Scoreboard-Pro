import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the base to './' to ensure that asset paths are relative.
  // This is crucial for Electron to find files correctly after packaging.
  base: './', 
})
