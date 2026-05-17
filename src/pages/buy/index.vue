<template>
  <view class="page-container">
    <!-- 顶部安全区 -->
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">购买</text>
    </view>
    
    <!-- 商城切换 Tab -->
    <view class="mall-tabs">
      <view 
        class="mall-tab" 
        :class="{ active: currentMall === 'all' }"
        @click="switchMall('all')"
      >
        全部
      </view>
      <view 
        class="mall-tab" 
        :class="{ active: currentMall === 'consume' }"
        @click="switchMall('consume')"
      >
        消费商城
      </view>
      <view 
        class="mall-tab" 
        :class="{ active: currentMall === 'exchange' }"
        @click="switchMall('exchange')"
      >
        换购商城
      </view>
      <view 
        class="mall-tab" 
        :class="{ active: currentMall === 'redeem' }"
        @click="switchMall('redeem')"
      >
        兑换商城
      </view>
    </view>
    
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view 
        class="filter-item" 
        :class="{ active: sortType === 'default' }"
        @click="switchSort('default')"
      >
        综合
      </view>
      <view 
        class="filter-item" 
        :class="{ active: sortType === 'latest' }"
        @click="switchSort('latest')"
      >
        最新
      </view>
      <view 
        class="filter-item" 
        :class="{ active: sortType === 'sales' }"
        @click="switchSort('sales')"
      >
        销量
      </view>
      <view 
        class="filter-item price-filter"
        :class="{ active: sortType === 'price' }"
        @click="switchSort('price')"
      >
        价格
        <view class="price-arrows">
          <text :class="{ 'arrow-up': true, active: priceOrder === 'asc' }">▲</text>
          <text :class="{ 'arrow-down': true, active: priceOrder === 'desc' }">▼</text>
        </view>
      </view>
      <view class="filter-item" @click="showFilter = true">
        筛选
        <text class="filter-icon">⊞</text>
      </view>
    </view>
    
    <!-- 商品列表 -->
    <scroll-view 
      class="product-list" 
      scroll-y 
      @scrolltolower="loadMore"
    >
      <view class="product-grid">
        <view 
          class="product-card" 
          v-for="product in products" 
          :key="product.id"
          @click="goProduct(product.id)"
        >
          <image class="product-image" :src="product.image" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <view class="product-tags">
              <text v-if="product.type === 'exchange'" class="tag tag-purple">换购</text>
              <text v-if="product.type === 'redeem'" class="tag tag-gold">兑换</text>
            </view>
            <view class="product-bottom">
              <view class="price-row">
                <text class="product-price">
                  <text class="symbol">¥</text>{{ product.price }}
                </text>
                <text v-if="product.points" class="product-points">
                  +{{ product.points }}积分
                </text>
              </view>
              <view class="add-cart-btn" @click.stop="addToCart(product)">
                <text>🛒</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view v-if="loading" class="loading-more">
        <text>加载中...</text>
      </view>
      <view v-else-if="noMore" class="no-more">
        <text>没有更多了</text>
      </view>
      
      <view class="safe-area-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const statusBarHeight = ref(20)
const currentMall = ref('all')
const sortType = ref('default')
const priceOrder = ref('')
const showFilter = ref(false)
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)

// 商品数据
const products = ref([
  { id: 1, name: 'iPhone 15 Pro Max 256GB 深空黑', price: 9999, points: 500, type: 'consume', image: 'https://picsum.photos/400/400?random=30', sales: 1000 },
  { id: 2, name: 'AirPods Pro 2 代 MagSafe充电盒', price: 1899, points: 95, type: 'consume', image: 'https://picsum.photos/400/400?random=31', sales: 800 },
  { id: 3, name: '戴森吹风机 HD15 紫红色', price: 2999, points: 150, type: 'exchange', image: 'https://picsum.photos/400/400?random=32', sales: 500 },
  { id: 4, name: 'SK-II 护肤精华露 230ml', price: 1599, points: 80, type: 'consume', image: 'https://picsum.photos/400/400?random=33', sales: 1200 },
  { id: 5, name: '小米手环 8 Pro 石墨黑', price: 399, points: 20, type: 'consume', image: 'https://picsum.photos/400/400?random=34', sales: 2000 },
  { id: 6, name: '索尼 WH-1000XM5 头戴式耳机', price: 2499, points: 125, type: 'consume', image: 'https://picsum.photos/400/400?random=35', sales: 600 },
  { id: 7, name: '任天堂 Switch OLED 日版', price: 2299, points: 115, type: 'consume', image: 'https://picsum.photos/400/400?random=36', sales: 900 },
  { id: 8, name: '华为 Mate 60 Pro 12GB+512GB', price: 6999, points: 350, type: 'consume', image: 'https://picsum.photos/400/400?random=37', sales: 1500 },
  { id: 9, name: 'Apple Watch Ultra 2 49mm', price: 5999, points: 300, type: 'consume', image: 'https://picsum.photos/400/400?random=38', sales: 700 },
  { id: 10, name: '小米路由器 AX9000', price: 999, points: 50, type: 'exchange', image: 'https://picsum.photos/400/400?random=39', sales: 400 },
  { id: 11, name: '筋膜枪 Mini 静音款', price: 599, points: 0, type: 'redeem', image: 'https://picsum.photos/400/400?random=40', sales: 300 },
  { id: 12, name: '颈椎按摩仪 恒温热敷', price: 399, points: 0, type: 'redeem', image: 'https://picsum.photos/400/400?random=41', sales: 250 }
])

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
})

function switchMall(mall: string) {
  currentMall.value = mall
  page.value = 1
  noMore.value = false
}

function switchSort(type: string) {
  if (type === 'price') {
    if (sortType.value === 'price') {
      priceOrder.value = priceOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortType.value = 'price'
      priceOrder.value = 'asc'
    }
  } else {
    sortType.value = type
  }
}

function loadMore() {
  if (loading.value || noMore.value) return
  loading.value = true
  setTimeout(() => {
    page.value++
    if (page.value > 3) {
      noMore.value = true
    }
    loading.value = false
  }, 1000)
}

function goProduct(id: number) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

function addToCart(product: any) {
  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding: 0 $spacing-lg;
  display: flex;
  flex-direction: column;
}

.safe-area-top {
  width: 100%;
}

.page-header {
  padding: $spacing-base 0;
  
  .page-title {
    font-size: 40rpx;
    font-weight: 700;
    color: $text-primary;
  }
}

.mall-tabs {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-base 0;
  border-bottom: 1rpx solid $border-color;
  
  .mall-tab {
    font-size: 32rpx;
    color: $text-secondary;
    padding-bottom: $spacing-sm;
    border-bottom: 4rpx solid transparent;
    transition: all 0.3s ease;
    
    &.active {
      color: $primary;
      border-bottom-color: $primary;
      font-weight: 600;
    }
  }
}

.filter-bar {
  display: flex;
  align-items: center;
  padding: $spacing-base 0;
  gap: $spacing-lg;
  
  .filter-item {
    font-size: 28rpx;
    color: $text-secondary;
    display: flex;
    align-items: center;
    gap: 4rpx;
    
    &.active {
      color: $primary;
      font-weight: 600;
    }
    
    &.price-filter {
      .price-arrows {
        display: flex;
        flex-direction: column;
        
        text {
          font-size: 16rpx;
          color: $text-muted;
          line-height: 1;
          
          &.active {
            color: $primary;
          }
        }
      }
    }
    
    .filter-icon {
      font-size: 24rpx;
      margin-left: 4rpx;
    }
  }
}

.product-list {
  flex: 1;
  padding-top: $spacing-base;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-base;
  padding-bottom: $spacing-lg;
}

.product-card {
  background: $bg-card;
  backdrop-filter: blur(20px);
  border: 1rpx solid $border-color;
  border-radius: $radius-md;
  overflow: hidden;
  
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
      display: block;
    }
    
    .product-tags {
      margin-top: $spacing-xs;
      
      .tag {
        font-size: 18rpx;
        padding: 2rpx 12rpx;
        border-radius: 6rpx;
      }
    }
    
    .product-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: $spacing-sm;
      
      .price-row {
        display: flex;
        align-items: baseline;
        gap: $spacing-xs;
      }
      
      .product-price {
        font-size: 32rpx;
        font-weight: 700;
        color: $primary;
        
        .symbol {
          font-size: 24rpx;
        }
      }
      
      .product-points {
        font-size: 22rpx;
        color: $gold;
        font-weight: 600;
      }
      
      .add-cart-btn {
        width: 56rpx;
        height: 56rpx;
        background: linear-gradient(135deg, $primary, $primary-dark);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
      }
    }
  }
}

.loading-more,
.no-more {
  text-align: center;
  padding: $spacing-xl 0;
  color: $text-secondary;
  font-size: 26rpx;
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
