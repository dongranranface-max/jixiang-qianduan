<template>
  <transition name="banner">
    <view v-if="visible" class="network-banner" :class="'network-banner--' + type">
      <text class="network-banner__text">{{ message }}</text>
    </view>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type BannerType = 'offline' | 'reconnecting' | 'online'

const visible = ref(false)
const type = ref<BannerType>('offline')
const message = ref('')

const bannerConfig = {
  offline: {
    message: '当前网络不可用，部分功能暂不可用',
    duration: 0, // 不自动消失
  },
  reconnecting: {
    message: '网络连接中...',
    duration: 0,
  },
  online: {
    message: '网络已恢复',
    duration: 2000,
  },
}

let hideTimer: ReturnType<typeof setTimeout> | null = null

function showBanner(newType: BannerType) {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  type.value = newType
  message.value = bannerConfig[newType].message
  visible.value = true

  if (bannerConfig[newType].duration > 0) {
    hideTimer = setTimeout(() => {
      visible.value = false
    }, bannerConfig[newType].duration)
  }
}

function hideBanner() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  visible.value = false
}

const unsubscribe: (() => void) | null = null

onMounted(() => {
  // 注册网络状态变化监听
  uni.onNetworkStatusChange((res) => {
    if (!res.isConnected) {
      showBanner('offline')
    } else if (res.networkType !== 'none') {
      showBanner('reconnecting')
      // 模拟检测到网络真正可用（延迟2秒后显示恢复）
      setTimeout(() => {
        showBanner('online')
      }, 2000)
    }
  })

  // 初始化检测
  uni.getNetworkType({
    success: (res) => {
      if (res.networkType === 'none' || res.networkType === 'unknown') {
        showBanner('offline')
      }
    },
  })
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
})
</script>

<style lang="scss" scoped>
.network-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 64rpx;
  // 顶部安全区
  padding-top: calc(env(safe-area-inset-top) + 8rpx);

  &--offline {
    background: rgba(47, 53, 66, 0.95);
    .network-banner__text {
      color: #ffffff;
    }
  }

  &--reconnecting {
    background: rgba(212, 133, 10, 0.90);
    .network-banner__text {
      color: #ffffff;
    }
  }

  &--online {
    background: rgba(61, 139, 110, 0.90);
    .network-banner__text {
      color: #ffffff;
    }
  }

  &__text {
    font-size: 28rpx;
    font-weight: 500;
    letter-spacing: 0.5rpx;
  }
}

// 过渡动画
.banner-enter-active {
  animation: banner-slide-down 0.25s ease-out;
}

.banner-leave-active {
  animation: banner-slide-up 0.20s ease-in;
}

@keyframes banner-slide-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes banner-slide-up {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}
</style>
