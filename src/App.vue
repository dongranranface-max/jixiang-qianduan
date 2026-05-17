<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App 启动 - ECO MALL')
})

onShow(() => {
  console.log('App 显示')
})

onHide(() => {
  console.log('App 隐藏')
})
</script>

<style lang="scss">
/* 全局样式 - Cyber-Tech 赛博科技风格 */
page {
  background-color: #0A0A0A;
  color: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* 全局毛玻璃效果 */
.glass {
  background: rgba(0, 255, 0, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(0, 255, 0, 0.2);
}

/* 发光效果 */
.glow {
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.4);
}

/* 安全区域 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

/* 动画 */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 255, 0, 0.6);
  }
}

@keyframes scan-line {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100vh);
  }
}
</style>