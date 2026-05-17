<template>
  <view class="page-container">
    <!-- 顶部安全区 -->
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text>←</text>
      </view>
      <view class="nav-tabs">
        <view 
          class="nav-tab" 
          :class="{ active: currentTab === 'detail' }"
          @click="currentTab = 'detail'"
        >
          商品
        </view>
        <view 
          class="nav-tab" 
          :class="{ active: currentTab === 'review' }"
          @click="currentTab = 'review'"
        >
          评价
        </view>
      </view>
      <view class="nav-share" @click="share">
        <text>⋮</text>
      </view>
    </view>
    
    <!-- 商品图片轮播 -->
    <swiper 
      class="product-swiper" 
      :indicator-dots="true"
      indicator-color="rgba(255,255,255,0.3)"
      indicator-active-color="#8B5CF6"
    >
      <swiper-item v-for="(img, index) in product.images" :key="index">
        <image class="product-image" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>
    
    <!-- 商品信息 -->
    <view class="product-info">
      <view class="price-row">
        <text class="current-price">
          <text class="symbol">¥</text>{{ product.price }}
        </text>
        <text class="original-price">¥{{ product.originalPrice }}</text>
      </view>
      
      <view class="name-row">
        <text class="product-name">{{ product.name }}</text>
      </view>
      
      <view class="tags-row">
        <text class="tag tag-purple" v-if="product.type === 'consume'">消费商城</text>
        <text class="tag tag-gold" v-if="product.type === 'exchange'">换购商城</text>
        <text class="tag tag-green" v-if="product.mallType === 'flash'">限时抢购</text>
        <text class="tag tag-outline">{{ product.description }}</text>
      </view>
      
      <view class="points-info">
        <text class="points-icon">💰</text>
        <text class="points-text">购买可得 {{ product.points }} 生态积分</text>
      </view>
    </view>
    
    <!-- 促销信息 -->
    <view class="promo-section" @click="showPromo = true">
      <view class="promo-label">
        <text class="promo-icon">🎁</text>
        <text>促销</text>
      </view>
      <view class="promo-content">
        <text v-if="promoList.length > 0" class="promo-text">{{ promoList[0] }}</text>
        <text v-else class="promo-empty">暂无促销</text>
      </view>
      <text class="promo-arrow">></text>
    </view>
    
    <!-- SKU 选择 -->
    <view class="sku-section" @click="showSkuModal = true">
      <view class="sku-label">
        <text class="sku-icon">📋</text>
        <text>已选</text>
      </view>
      <view class="sku-content">
        <text>{{ selectedSku || '请选择规格数量' }}</text>
      </view>
      <text class="sku-arrow">></text>
    </view>
    
    <!-- 商品详情 -->
    <view class="detail-section" v-if="currentTab === 'detail'">
      <view class="section-title">
        <text>商品详情</text>
      </view>
      <view class="detail-content">
        <image 
          v-for="(img, index) in product.detailImages" 
          :key="index"
          class="detail-image"
          :src="img" 
          mode="widthFix" 
        />
      </view>
    </view>
    
    <!-- 评价列表 -->
    <view class="review-section" v-if="currentTab === 'review'">
      <view class="review-summary">
        <view class="summary-score">
          <text class="score-value">{{ reviewStats.score }}</text>
          <text class="score-label">分</text>
        </view>
        <view class="summary-info">
          <view class="summary-row" v-for="item in reviewStats.tags" :key="item.name">
            <text class="tag-name">{{ item.name }}</text>
            <view class="tag-bar">
              <view class="tag-fill" :style="{ width: item.percent + '%' }"></view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="review-list">
        <view class="review-item" v-for="review in reviewList" :key="review.id">
          <view class="review-header">
            <image class="review-avatar" :src="review.avatar" mode="aspectFill" />
            <view class="review-user">
              <text class="user-name">{{ review.userName }}</text>
              <view class="review-rating">
                <text v-for="i in 5" :key="i" :class="i <= review.rating ? 'star-fill' : 'star'">⭐</text>
              </view>
            </view>
            <text class="review-date">{{ review.date }}</text>
          </view>
          <text class="review-content">{{ review.content }}</text>
          <view class="review-images" v-if="review.images && review.images.length > 0">
            <image 
              v-for="(img, idx) in review.images" 
              :key="idx"
              class="review-image"
              :src="img"
              mode="aspectFill"
            />
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-icons">
        <view class="action-icon-item" @click="toggleFavorite">
          <text :class="isFavorite ? 'icon-active' : ''">{{ isFavorite ? '❤️' : '🤍' }}</text>
          <text class="icon-label">收藏</text>
        </view>
        <view class="action-icon-item" @click="goCart">
          <text>🛒</text>
          <view v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</view>
          <text class="icon-label">购物车</text>
        </view>
      </view>
      <view class="action-buttons">
        <view class="btn-add-cart" @click="showSkuModal = true">加入购物车</view>
        <view class="btn-buy-now" @click="buyNow">立即购买</view>
      </view>
    </view>
    
    <!-- SKU 弹窗 -->
    <view class="sku-modal" v-if="showSkuModal" @click="showSkuModal = false">
      <view class="sku-panel" @click.stop>
        <view class="sku-header">
          <image class="sku-image" :src="product.images[0]" mode="aspectFill" />
          <view class="sku-info">
            <text class="sku-price">¥{{ product.price }}</text>
            <text class="sku-stock">库存: {{ product.stock }}</text>
          </view>
          <view class="sku-close" @click="showSkuModal = false">×</view>
        </view>
        
        <view class="sku-content">
          <view class="sku-spec" v-for="spec in product.specs" :key="spec.name">
            <text class="spec-name">{{ spec.name }}</text>
            <view class="spec-options">
              <view 
                v-for="option in spec.options" 
                :key="option"
                class="spec-option"
                :class="{ active: selectedSpecs[spec.name] === option }"
                @click="selectSpec(spec.name, option)"
              >
                {{ option }}
              </view>
            </view>
          </view>
          
          <view class="quantity-row">
            <text class="quantity-label">数量</text>
            <view class="quantity-stepper">
              <view class="stepper-btn" @click="quantity > 1 && quantity--">-</view>
              <text class="stepper-value">{{ quantity }}</text>
              <view class="stepper-btn" @click="quantity++">+</view>
            </view>
          </view>
        </view>
        
        <view class="sku-footer">
          <view class="btn-add-cart-lg" @click="addToCart">加入购物车</view>
          <view class="btn-buy-now-lg" @click="buyNow">立即购买</view>
        </view>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const statusBarHeight = ref(20)
const currentTab = ref('detail')
const showSkuModal = ref(false)
const showPromo = ref(false)
const quantity = ref(1)
const isFavorite = ref(false)
const cartCount = ref(2)

const selectedSpecs = ref<Record<string, string>>({})

const product = ref({
  id: 1,
  name: 'iPhone 15 Pro Max 256GB 深空黑色 钛金属边框',
  price: 9999,
  originalPrice: 10999,
  points: 500,
  type: 'consume',
  mallType: '',
  description: '正品保障 · 急速发货',
  stock: 100,
  images: [
    'https://picsum.photos/750/750?random=50',
    'https://picsum.photos/750/750?random=51',
    'https://picsum.photos/750/750?random=52'
  ],
  detailImages: [
    'https://picsum.photos/750/1200?random=60',
    'https://picsum.photos/750/1200?random=61',
    'https://picsum.photos/750/1200?random=62'
  ],
  specs: [
    { name: '颜色', options: ['深空黑', '银色', '金色', '钛蓝色'] },
    { name: '存储', options: ['128GB', '256GB', '512GB', '1TB'] }
  ]
})

const promoList = ref([
  '满5000减200 · 限时优惠',
  '新用户首单立减100'
])

const reviewStats = ref({
  score: 4.8,
  tags: [
    { name: '品质很好', percent: 85 },
    { name: '物流很快', percent: 70 },
    { name: '服务态度好', percent: 60 }
  ]
})

const reviewList = ref([
  {
    id: 1,
    userName: '用户1234',
    avatar: 'https://picsum.photos/100/100?random=70',
    rating: 5,
    date: '2026-05-10',
    content: '非常满意！包装很好，发货很快，手机是正品，和描述一致。',
    images: [
      'https://picsum.photos/200/200?random=80'
    ]
  },
  {
    id: 2,
    userName: '用户5678',
    avatar: 'https://picsum.photos/100/100?random=71',
    rating: 4,
    date: '2026-05-08',
    content: '整体不错，就是配送稍微慢了点。',
    images: []
  }
])

const selectedSku = computed(() => {
  const specs = Object.values(selectedSpecs.value)
  if (specs.length === product.value.specs.length) {
    return specs.join(' / ') + ` × ${quantity.value}`
  }
  return ''
})

function goBack() {
  uni.navigateBack()
}

function share() {
  uni.showShareMenu()
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
  uni.showToast({
    title: isFavorite.value ? '收藏成功' : '取消收藏',
    icon: 'success'
  })
}

function goCart() {
  uni.switchTab({ url: '/pages/cart/index' })
}

function selectSpec(name: string, option: string) {
  selectedSpecs.value[name] = option
}

function addToCart() {
  if (Object.keys(selectedSpecs.value).length < product.value.specs.length) {
    uni.showToast({ title: '请选择完整规格', icon: 'none' })
    return
  }
  cartCount.value++
  showSkuModal.value = false
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}

function buyNow() {
  if (Object.keys(selectedSpecs.value).length < product.value.specs.length) {
    showSkuModal.value = true
    return
  }
  uni.navigateTo({ url: '/pages/order/confirm' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding-bottom: 120rpx;
}

.nav-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  gap: 32rpx;
  
  .nav-back, .nav-share {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #fff;
  }
  
  .nav-tabs {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 48rpx;
    
    .nav-tab {
      font-size: 30rpx;
      color: $text-secondary;
      padding-bottom: 8rpx;
      border-bottom: 4rpx solid transparent;
      
      &.active {
        color: #fff;
        border-bottom-color: $primary;
        font-weight: 600;
      }
    }
  }
}

.product-swiper {
  width: 100%;
  height: 750rpx;
  
  .product-image {
    width: 100%;
    height: 100%;
  }
}

.product-info {
  padding: $spacing-lg;
  background: $bg-card;
  margin: $spacing-base;
  border-radius: $radius-md;
  backdrop-filter: blur(20px);
  
  .price-row {
    display: flex;
    align-items: baseline;
    gap: $spacing-base;
    margin-bottom: $spacing-base;
    
    .current-price {
      font-size: 56rpx;
      font-weight: 700;
      color: $primary;
      
      .symbol {
        font-size: 36rpx;
      }
    }
    
    .original-price {
      font-size: 28rpx;
      color: $text-muted;
      text-decoration: line-through;
    }
  }
  
  .name-row {
    margin-bottom: $spacing-sm;
    
    .product-name {
      font-size: 32rpx;
      font-weight: 600;
      color: $text-primary;
      line-height: 1.4;
    }
  }
  
  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    margin-bottom: $spacing-base;
  }
  
  .points-info {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-base;
    background: rgba($gold, 0.1);
    border-radius: $radius-sm;
    width: fit-content;
    
    .points-icon {
      font-size: 28rpx;
    }
    
    .points-text {
      font-size: 24rpx;
      color: $gold;
    }
  }
}

.promo-section, .sku-section {
  display: flex;
  align-items: center;
  padding: $spacing-base $spacing-lg;
  background: $bg-card;
  margin: 0 $spacing-base $spacing-sm;
  border-radius: $radius-md;
  backdrop-filter: blur(20px);
  
  .promo-label, .sku-label {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: 28rpx;
    color: $text-secondary;
    width: 140rpx;
    
    .promo-icon, .sku-icon {
      font-size: 32rpx;
    }
  }
  
  .promo-content, .sku-content {
    flex: 1;
    font-size: 28rpx;
    color: $text-primary;
    
    .promo-empty {
      color: $text-muted;
    }
  }
  
  .promo-arrow, .sku-arrow {
    color: $text-muted;
    font-size: 28rpx;
  }
}

.detail-section {
  padding: $spacing-lg;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-base;
  }
  
  .detail-content {
    .detail-image {
      width: 100%;
      display: block;
    }
  }
}

.review-section {
  padding: $spacing-lg;
  
  .review-summary {
    display: flex;
    align-items: center;
    gap: $spacing-xl;
    padding: $spacing-lg;
    background: $bg-card;
    border-radius: $radius-md;
    margin-bottom: $spacing-lg;
    
    .summary-score {
      text-align: center;
      
      .score-value {
        font-size: 72rpx;
        font-weight: 700;
        color: $gold;
      }
      
      .score-label {
        font-size: 24rpx;
        color: $text-secondary;
      }
    }
    
    .summary-info {
      flex: 1;
      
      .summary-row {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-bottom: 8rpx;
        
        .tag-name {
          font-size: 24rpx;
          color: $text-secondary;
          width: 140rpx;
        }
        
        .tag-bar {
          flex: 1;
          height: 12rpx;
          background: rgba(255,255,255,0.1);
          border-radius: 6rpx;
          
          .tag-fill {
            height: 100%;
            background: $primary;
            border-radius: 6rpx;
          }
        }
      }
    }
  }
  
  .review-item {
    padding: $spacing-base 0;
    border-bottom: 1rpx solid $border-light;
    
    .review-header {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-sm;
      
      .review-avatar {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
      }
      
      .review-user {
        flex: 1;
        
        .user-name {
          font-size: 28rpx;
          color: $text-primary;
        }
        
        .review-rating {
          .star-fill {
            font-size: 20rpx;
          }
          
          .star {
            font-size: 20rpx;
            opacity: 0.3;
          }
        }
      }
      
      .review-date {
        font-size: 24rpx;
        color: $text-muted;
      }
    }
    
    .review-content {
      font-size: 28rpx;
      color: $text-primary;
      line-height: 1.5;
    }
    
    .review-images {
      display: flex;
      gap: $spacing-sm;
      margin-top: $spacing-sm;
      
      .review-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: $radius-sm;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(30px);
  border-top: 1rpx solid $border-color;
  gap: $spacing-base;
  
  .action-icons {
    display: flex;
    gap: $spacing-lg;
    
    .action-icon-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4rpx;
      font-size: 40rpx;
      
      .icon-label {
        font-size: 20rpx;
        color: $text-secondary;
      }
      
      .cart-badge {
        position: absolute;
        top: -8rpx;
        right: -16rpx;
        min-width: 32rpx;
        height: 32rpx;
        background: $danger;
        border-radius: 16rpx;
        font-size: 20rpx;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .icon-active {
        color: $danger;
      }
    }
  }
  
  .action-buttons {
    flex: 1;
    display: flex;
    gap: $spacing-sm;
    
    .btn-add-cart, .btn-buy-now {
      flex: 1;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 40rpx;
      font-size: 30rpx;
      font-weight: 600;
    }
    
    .btn-add-cart {
      background: linear-gradient(135deg, rgba($primary, 0.3), rgba($primary, 0.1));
      border: 2rpx solid $primary;
      color: $primary;
    }
    
    .btn-buy-now {
      background: linear-gradient(135deg, $primary, $primary-dark);
      color: #fff;
    }
  }
}

.sku-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  
  .sku-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: $bg-primary;
    border-radius: $radius-lg $radius-lg 0 0;
    max-height: 80vh;
    overflow-y: auto;
    
    .sku-header {
      display: flex;
      align-items: center;
      padding: $spacing-lg;
      border-bottom: 1rpx solid $border-color;
      position: relative;
      
      .sku-image {
        width: 180rpx;
        height: 180rpx;
        border-radius: $radius-sm;
      }
      
      .sku-info {
        flex: 1;
        margin-left: $spacing-base;
        
        .sku-price {
          font-size: 44rpx;
          font-weight: 700;
          color: $primary;
          display: block;
        }
        
        .sku-stock {
          font-size: 24rpx;
          color: $text-secondary;
          margin-top: 8rpx;
        }
      }
      
      .sku-close {
        position: absolute;
        top: $spacing-base;
        right: $spacing-base;
        font-size: 48rpx;
        color: $text-muted;
      }
    }
    
    .sku-content {
      padding: $spacing-lg;
      
      .sku-spec {
        margin-bottom: $spacing-lg;
        
        .spec-name {
          font-size: 28rpx;
          color: $text-primary;
          margin-bottom: $spacing-sm;
          display: block;
        }
        
        .spec-options {
          display: flex;
          flex-wrap: wrap;
          gap: $spacing-sm;
          
          .spec-option {
            padding: 12rpx 32rpx;
            background: $bg-card;
            border: 2rpx solid $border-color;
            border-radius: $radius-sm;
            font-size: 26rpx;
            color: $text-primary;
            
            &.active {
              background: rgba($primary, 0.2);
              border-color: $primary;
              color: $primary;
            }
          }
        }
      }
      
      .quantity-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .quantity-label {
          font-size: 28rpx;
          color: $text-primary;
        }
        
        .quantity-stepper {
          display: flex;
          align-items: center;
          gap: $spacing-base;
          
          .stepper-btn {
            width: 56rpx;
            height: 56rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: $bg-card;
            border-radius: $radius-sm;
            font-size: 32rpx;
            color: $text-primary;
            
            &:active {
              background: $bg-card-hover;
            }
          }
          
          .stepper-value {
            font-size: 32rpx;
            font-weight: 600;
            color: $text-primary;
            min-width: 60rpx;
            text-align: center;
          }
        }
      }
    }
    
    .sku-footer {
      display: flex;
      gap: $spacing-sm;
      padding: $spacing-lg;
      padding-bottom: calc($spacing-lg + constant(safe-area-inset-bottom));
      padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
      border-top: 1rpx solid $border-color;
      
      .btn-add-cart-lg, .btn-buy-now-lg {
        flex: 1;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 44rpx;
        font-size: 32rpx;
        font-weight: 600;
      }
      
      .btn-add-cart-lg {
        background: linear-gradient(135deg, rgba($primary, 0.3), rgba($primary, 0.1));
        border: 2rpx solid $primary;
        color: $primary;
      }
      
      .btn-buy-now-lg {
        background: linear-gradient(135deg, $primary, $primary-dark);
        color: #fff;
      }
    }
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
