import path from 'path'
import { execSync } from 'child_process'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import Components from 'unplugin-vue-components/vite'
import viteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'

// 把 git hash 注入到環境參數
process.env.VITE_APP_VERSION = process.env.npm_package_version
process.env.VITE_LAST_HASH = execSync('git rev-parse HEAD').toString().trim().slice(0, 8)

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const plugins = [
    vue(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    Components({
      dirs: 'src/components',
      dts: 'types/components.d.ts'
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    AutoImport({
      imports: ['vue'],
      dts: 'types/auto-imports.d.ts'
    })
  ]

  return defineConfig({
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_APP_TARGET_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          followRedirects: true
        },
        '/api_socket': {
          ws: true,
          target: process.env.VITE_APP_TARGET_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api_socket/, '')
        }
      }
    },
    plugins,
    css: {
      preprocessorOptions: { scss: { charset: false } }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@design': path.resolve(__dirname, 'src/assets/img/')
      }
    },
    build: {
      minify: false,
      brotliSize: false,
      chunkSizeWarningLimit: 2000
    }
  })
}
