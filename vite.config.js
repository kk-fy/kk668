import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  // GitHub Pages 部署在 https://用户名.github.io/仓库名/ 子路径下，
  // 用相对路径 './' 可让 js/css 资源在任意子目录都能正确加载（避免 404 白屏）
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname) // 配置别名 @ 代表项目根目录
    }
  },
  server:{
    port:3000
  },
  build: {
    // 构建产物输出到 docs，配合 GitHub Pages 的 main 分支 /docs 目录部署
    outDir: 'docs'
  }
})
