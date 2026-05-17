<template>
  <view class="page-container">
    <!-- 顶部安全区 -->
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 搜索栏 -->
    <view class="search-bar-wrapper">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索商品"
          placeholder-class="search-placeholder"
          disabled
          @click="goSearch"
        />
      </view>
      <view class="message-btn">
        <text class="message-icon">💬</text>
        <view class="message-badge" v-if="unreadCount > 0">{{ unreadCount }}</view>
      </view>
    </view>
    
    <!-- Banner 轮播 -->
    <view class="banner-wrapper">
      <swiper 
        class="banner" 
        :indicator-dots="true" 
        :autoplay="true" 
        :interval="3000"
        :circular="true"
        indicator-color="rgba(255,255,255,0.3)"
        indicator-active-color="#8B5CF6"
      >
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image class="banner-image" :src="banner.image" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </view>
    
    <!-- 快捷入口 -->
    <view class="quick-entry-grid">
      <view 
        class="quick-entry" 
        v-for="entry in quickEntries" 
        :key="entry.id"
        @click="onEntryClick(entry)"
      >
        <text class="entry-icon">{{ entry.icon }}</text>
        <text class="entry-label">{{ entry.name }}</text>
      </view>
    </view>
    
    <!-- 限时抢购 -->
    <view class="section">
      <view class="section-header">
        <view class="section-title-row">
          <text class="section-icon">🔥</text>
          <text class="section-title">限时抢购</text>
          <view class="countdown">
            <text class="countdown-text">{{ countdown }}</text>
          </view>
        </view>
        <view class="section-more" @click="goMore('flash')">
          <text>查看全部</text>
          <text class="arrow">></text>
        </view>
      </view>
      <scroll-view class="product-scroll" scroll-x>
        <view class="product-scroll-content">
          <view 
            class="flash-product-card" 
            v-for="product in flashProducts" 
            :key="product.id"
            @click="goProduct(product.id)"
          >
            <image class="flash-product-image" :src="product.image" mode="aspectFill" />
            <view class="flash-product-info">
              <text class="flash-product-name">{{ product.name }}</text>
              <view class="flash-product-bottom">
                <text class="flash-price">¥{{ product.price }}</text>
                <text class="flash-points">+{{ product.points }}积分</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 精选推荐 -->
    <view class="section">
      <view class="section-header">
        <view class="section-title-row">
          <text class="section-icon">📦</text>
          <text class="section-title">精选推荐</text>
        </view>
        <view class="section-more" @click="goMore('recommend')">
          <text>查看全部</text>
          <text class="arrow">></text>
        </view>
      </view>
      <view class="product-grid">
        <view 
          class="product-card" 
          v-for="product in recommendProducts" 
          :key="product.id"
          @click="goProduct(product.id)"
        >
          <image class="product-image" :src="product.image" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <view class="product-bottom">
              <text class="product-price">
                <text class="symbol">¥</text>{{ product.price }}
                <text class="points">+{{ product.points }}积分</text>
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部安全区 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(20)
const unreadCount = ref(3)
const countdown = ref('02:35:20')

// Banner 数据
const banners = ref([
  { id: 1, image: 'https://picsum.photos/750/400?random=1', link: '' },
  { id: 2, image: 'https://picsum.photos/750/400?random=2', link: '' },
  { id: 3, image: 'https://picsum.photos/750/400?random=3', link: '' }
])

// 快捷入口
const quickEntries = ref([
  { id: 1, name: '消费商城', icon: '🛍️', type: 'consume' },
  { id: 2, name: '换购商城', icon: '🔄', type: 'exchange' },
  { id: 3, name: '兑换商城', icon: '🎁', type: 'redeem' },
  { id: 4, name: '增值专区', icon: '📈', type: 'wealth' }
])

// 限时抢购商品
const flashProducts = ref([
  { id: 1, name: 'iPhone 15 Pro Max', price: 9999, points: 500, image: 'https://picsum.photos/300/300?random=10' },
  { id: 2, name: 'AirPods Pro 2', price: 1899, points: 95, image: 'https://picsum.photos/300/300?random=11' },
  { id: 3, name: '戴森吹风机', price: 2999, points: 150, image: 'https://picsum.photos/300/300?random=12' },
  { id: 4, name: 'SK-II 护肤套装', price: 1599, points: 80, image: 'https://picsum.photos/300/300?random=13' },
  { id: 5, name: '小米手环 8 Pro', price: 399, points: 20, image: 'https://picsum.photos/300/300?random=14' }
])

// 精选推荐商品
const recommendProducts = ref([
  { id: 6, name: '索尼 WH-1000XM5 降噪耳机', price: 2499, points: 125, image: 'https://picsum.photos/400/400?random=20' },
  { id: 7, name: '任天堂 Switch OLED', price: 2299, points: 115, image: 'https://picsum.photos/400/400?random=21' },
  { id: 8, name: '华为 Mate 60 Pro', price: 6999, points: 350, image: 'https://picsum.photos/400/400?random=22' },
  { id: 9, name: 'Apple Watch Ultra 2', price: 5999, points: 300, image: 'https://picsum.photos/400/400?random=23' }
])

// 倒计时定时器
let countdownTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // 获取状态栏高度
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
  
  // 启动倒计时
  countdownTimer = setInterval(() => {
    const parts = countdown.value.split(':')
    let hours = parseInt(parts[0])
    let minutes = parseInt(parts[1])
    let seconds = parseInt(parts[2])
    
    seconds--
    if (seconds < 0) {
      seconds = 59
      minutes--
      if (minutes < 0) {
        minutes = 59
        hours--
        if (hours < 0) {
          hours = 23
        }
      }
    }
    
    countdown.value = 
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0')
  }, 1000)
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

// 跳转搜索
function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' })
}

// 快捷入口点击
function onEntryClick(entry: { type: string }) {
  switch (entry.type) {
    case 'consume':
      uni.switchTab({ url: '/pages/buy/index' })
      break
    case 'exchange':
      uni.switchTab({ url: '/pages/buy/index' })
      break
    case 'redeem':
      uni.switchTab({ url: '/pages/buy/index' })
      break
    case 'wealth':
      uni.switchTab({ url: '/pages/wealth/index' })
      break
  }
}

// 查看更多
function goMore(type: string) {
  uni.switchTab({ url: '/pages/buy/index' })
}

// 查看商品详情
function goProduct(id: number) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding: 0 $spacing-lg;
}

.search-bar-wrapper {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  padding: $spacing-base 0;
  
  .search-bar {
    flex: 1;
  }
  
  .message-btn {
    position: relative;
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-card;
    backdrop-filter: blur(20px);
    border-radius: 50%;
    
    .message-icon {
      font-size: 40rpx;
    }
    
    .message-badge {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      min-width: 32rpx;
      height: 32rpx;
      background: $danger;
      border-radius: 16rpx;
      font-size: 20rpx;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8rpx;
    }
  }
}

.banner-wrapper {
  margin: $spacing-base 0;
}

.banner {
  width: 100%;
  height: 360rpx;
  border-radius: $radius-lg;
  overflow: hidden;
  
  .banner-image {
    width: 100%;
    height: 100%;
  }
}

.quick-entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-base;
  margin-bottom: $spacing-xl;
}

.quick-entry {
  .entry-icon {
    font-size: 56rpx;
  }
}

.section {
  margin-bottom: $spacing-xl;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-base;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  
  .section-icon {
    font-size: 36rpx;
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
  }
  
  .countdown {
    margin-left: $spacing-sm;
    
    .countdown-text {
      background: linear-gradient(135deg, $primary, $primary-dark);
      color: #fff;
      padding: 4rpx 16rpx;
      border-radius: 8rpx;
      font-size: 24rpx;
      font-weight: 600;
    }
  }
}

.section-more {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: $text-secondary;
  
  .arrow {
    margin-left: 4rpx;
  }
}

.product-scroll {
  width: 100%;
  white-space: nowrap;
}

.product-scroll-content {
  display: inline-flex;
  gap: $spacing-base;
  padding: $spacing-xs 0;
}

.flash-product-card {
  width: 240rpx;
  flex-shrink: 0;
  background: $bg-card;
  backdrop-filter: blur(20px);
  border: 1rpx solid $border-color;
  border-radius: $radius-md;
  overflow: hidden;
  
  .flash-product-image {
    width: 100%;
    height: 240rpx;
  }
  
  .flash-product-info {
    padding: $spacing-sm;
    
    .flash-product-name {
      font-size: 26rpx;
      color: $text-primary;
      @include line-clamp(1);
      display: block;
    }
    
    .flash-product-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: $spacing-xs;
      
      .flash-price {
        font-size: 28rpx;
        font-weight: 700;
        color: $primary;
      }
      
      .flash-points {
        font-size: 20rpx;
        color: $gold;
      }
    }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-base;
}

.product-card {
  .product-image {
    width: 100%;
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.02);
  }
  
  .product-info {
    padding: $spacing-base;
    
    .product-name {
      font-size: 28rpx;
      color: $text-primary;
      @include line-clamp(2);
      line-height: 1.4;
      margin-bottom: $spacing-sm;
      display: block;
    }
    
    .product-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .product-price {
      font-size: 32rpx;
      font-weight: 700;
      color: $primary;
      
      .symbol {
        font-size: 24rpx;
      }
      
      .points {
        font-size: 22rpx;
        color: $gold;
        margin-left: 8rpx;
        font-weight: 600;
      }
    }
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
