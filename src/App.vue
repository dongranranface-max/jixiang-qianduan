<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
</script>

<style lang="scss">
@import './styles/theme.scss';

/* ============================================
   全局样式 - 冰火金融科技
   冰蓝 #00D4FF × 火焰 #FF6B35 · 深邃科技
   ============================================ */

/* 深空背景 + 顶部冰火渐变光效 */
page {
  background: radial-gradient(ellipse at 50% -20%,
    rgba(0, 212, 255, 0.08) 0%,
    rgba(255, 107, 53, 0.03) 30%,
    #060B28 60%,
    #020510 100%);
  background-attachment: fixed;
  background-color: #060B28;
  color: #E8F4FF;
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

/* 全局毛玻璃 */
.glass {
  background: rgba(13, 27, 62, 0.60);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(0, 212, 255, 0.15);
}

/* 冰蓝发光 */
.glow {
  box-shadow: 0 0 30rpx rgba(0, 212, 255, 0.40);
}

/* 火焰发光 */
.glow-fire {
  box-shadow: 0 0 30rpx rgba(255, 107, 53, 0.50);
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
  0%, 100% { box-shadow: 0 0 20rpx rgba(0, 212, 255, 0.40); }
  50% { box-shadow: 0 0 40rpx rgba(0, 212, 255, 0.65); }
}

@keyframes fire-breathe {
  0%, 100% {
    box-shadow: 0 0 20rpx rgba(255, 107, 53, 0.35);
  }
  50% {
    box-shadow: 0 0 40rpx rgba(255, 69, 0, 0.60);
  }
}

@keyframes circuit-flow {
  0% { opacity: 0.15; }
  50% { opacity: 0.50; }
  100% { opacity: 0.15; }
}

@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 20rpx rgba(255, 215, 0, 0.35); }
  50% { box-shadow: 0 0 40rpx rgba(255, 215, 0, 0.60); }
}

/* 顶部冰蓝光弧 */
.top-arc {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2rpx;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(0, 212, 255, 0.60) 20%,
    rgba(255, 107, 53, 0.60) 80%,
    transparent 100%);
  z-index: 9999;
  pointer-events: none;
}
</style>
