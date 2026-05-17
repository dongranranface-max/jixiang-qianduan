import { defineUniAppConfig } from '@dcloudio/vite-plugin-uni'
import UniApp from '@dcloudio/vite-plugin-uni'

export default defineUniAppConfig({
  plugins: [
    UniApp()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/theme.scss";'
      }
    }
  },
  uni: {
    platform: {
      h5: {
        router: {
          mode: 'hash'
        }
      }
    }
  }
})