import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import { pkgRoot } from '../build/paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      include: pkgRoot,
    }),
  ],
  optimizeDeps: {
    include: [],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.mjs'],
  },
})
