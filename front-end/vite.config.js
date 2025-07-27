import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), 
//     tailwindcss()],
// })

export default defineConfig({
  server: {
    host: true,       // or use host: '0.0.0.0'
    port: 5173,       // optional: change if default port conflicts
  },
  plugins: [react(), 
    tailwindcss()],

})
