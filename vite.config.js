import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite conexiones externas
    port: 5173,       // Asegura que use el puerto correcto
    strictPort: true, // Si el puerto está ocupado, no cambiará automáticamente
  }
})
