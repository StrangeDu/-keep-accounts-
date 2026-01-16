import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/-keep-accounts-/', // <--- 这里一定要改！对应你的 GitHub 仓库名
})
