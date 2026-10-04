import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    globals: true,
    fileParallelism: false,
    exclude: [...configDefaults.exclude, '.kilo/**', '.next/**'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
