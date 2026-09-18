import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname) // 配置别名 @ 代表项目根目录
    }
  },
  server:{
    port:3000
  }
})
