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
    hookTimeout: 30000,
    testTimeout: 30000,
    exclude: [...configDefaults.exclude, '.kilo/**', '.next/**'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
