<template>
  <view class="page-container">
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }" />

    <!-- 页面导航 -->
    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">商品详情</text>
      <view class="page-nav__action" @click="goHome"><text>首</text></view>
    </view>

    <!-- 商品不存在 -->
    <view v-if="!loading && !product.id" class="empty-state">
      <view class="empty-state__icon">商</view>
      <text class="empty-state__text">商品不存在或已下架</text>
      <view class="empty-state__btn" @click="goHome">
        <text>返回首页</text>
      </view>
    </view>

    <template v-else>
      <!-- 加载骨架屏 -->
      <view v-if="loading" class="detail-skeleton">
        <view class="sk-banner shimmer" />
        <view class="sk-content">
          <view class="sk-line sk-long shimmer" />
          <view class="sk-line sk-short shimmer" />
          <view class="sk-line sk-medium shimmer" />
        </view>
      </view>

      <template v-else>
        <!-- ========== 商品轮播图 ========== -->
        <view class="gallery-wrap">
          <swiper
            class="gallery-swiper"
            :current="currentSwiper"
            @change="onSwiperChange"
            autoplay
            interval="4000"
            circular
          >
            <swiper-item
              v-for="(img, idx) in galleryImages"
              :key="idx"
              class="gallery-item"
            >
              <LaxImage :src="img" mode="aspectFill" class="gallery-img" />
            </swiper-item>
          </swiper>

          <!-- 轮播指示器 -->
          <view class="gallery-dots">
            <view
              v-for="(_, idx) in galleryImages"
              :key="idx"
              class="gallery-dot"
              :class="{ active: currentSwiper === idx }"
            />
          </view>

          <!-- 图片计数 -->
          <view class="gallery-counter">
            <text>{{ currentSwiper + 1 }}/{{ galleryImages.length }}</text>
          </view>
        </view>

        <!-- ========== 价格 + 换购公式 ========== -->
        <view class="price-section">
          <view class="price-card">
            <!-- 价格行 -->
            <view class="price-row">
              <template v-if="product.type === 3">
                <!-- 兑换型：仅积分 -->
                <view class="price-main price-main--points">
                  <text class="price-points-value">{{ product.requiredPoints }}</text>
                  <text class="price-points-unit">消费积分</text>
                </view>
              </template>
              <template v-else-if="product.type === 2">
                <!-- 换购型：¥X = 现金 + N积分 -->
                <view class="price-main price-main--exchange">
                  <text class="price-cash">¥{{ product.price }}</text>
                  <text class="price-plus">+</text>
                  <text class="price-points">{{ product.requiredPoints }}积分</text>
                </view>
                <view class="exchange-formula">
                  <text>换购价 = ¥{{ product.price }} 现金 + {{ product.requiredPoints }} 消费积分</text>
                </view>
              </template>
              <template v-else>
                <!-- 消费型 -->
                <view class="price-main price-main--cash">
                  <text class="price-cash">¥{{ product.price }}</text>
                </view>
                <view v-if="product.pointsEarned" class="earn-hint">
                  <text>🎁 购买即返 {{ product.pointsEarned }} 积分</text>
                </view>
              </template>
            </view>

            <!-- 商品名称 + 分类标签 -->
            <view class="product-meta">
              <text class="product-name">{{ product.name }}</text>
              <view class="product-tags">
                <text class="product-tag">类型：{{ typeName(product.type) }}</text>
                <text v-if="product.categoryName" class="product-tag">{{ product.categoryName }}</text>
              </view>
            </view>

            <!-- 销量 -->
            <view v-if="product.salesCount" class="sales-row">
              <text class="sales-text">已售 {{ formatSales(product.salesCount) }}</text>
            </view>
          </view>
        </view>

        <!-- ========== 商品详情 ========== -->
        <view class="detail-section">
          <view class="detail-section__title">
            <text>商品详情</text>
          </view>
          <view class="detail-content" v-html="product.description || '<p style=\'color:#8A8A8A;text-align:center;\' >暂无详情</p>'" />
        </view>

        <!-- ========== 底部购买栏 ========== -->
        <view class="bottom-bar">
          <!-- 首页入口 -->
          <view class="bottom-bar__home" @click="goHome">
            <text class="bottom-bar__home-icon">首</text>
          </view>

          <!-- 购买按钮 -->
          <view class="bottom-bar__cta" @click="handleBuy">
            <template v-if="product.type === 3">
              <text>立即兑换</text>
            </template>
            <template v-else-if="product.type === 2">
              <text>立即换购</text>
            </template>
            <template v-else>
              <text>立即购买</text>
            </template>
          </view>
        </view>
      </template>
    </template>

    <view class="safe-area-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { productApi } from '@/utils/api'
import { checkAuth, requireAuth } from '@/utils/auth'
import { assetStore } from '@/store/asset'
import LaxImage from '@/components/lazy/LaxImage.vue'

interface Query {
  id?: string | number
  type?: string | number
}

const statusBarHeight = ref(20)
const loading = ref(false)
const product = ref<any>({})
const currentSwiper = ref(0)

const query = ref<Query>({})

onMounted(() => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 20
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const options = (current as any)?.options || {}
  query.value = {
    id: options.id,
    type: options.type ? Number(options.type) : 1,
  }
  loadProduct()
})

onShow(() => {
  if (product.value.id) {
    assetStore.fetchBalance()
  }
})

async function loadProduct() {
  if (!query.value.id) return
  loading.value = true
  try {
    const res = await productApi.getDetail(query.value.id)
    product.value = res || {}
  } catch {
    product.value = {}
  } finally {
    loading.value = false
  }
}

const galleryImages = computed(() => {
  const imgs = product.value.galleryImages || product.value.images || []
  if (!imgs.length && product.value.coverImage) {
    return [product.value.coverImage]
  }
  return imgs.length ? imgs : ['/static/logo.png']
})

function typeName(type: number) {
  const map = { 1: '消费', 2: '换购', 3: '兑换' }
  return map[type] || '消费'
}

function formatSales(n: number) {
  if (!n) return '0'
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  return String(n)
}

function onSwiperChange(e: any) {
  currentSwiper.value = e.detail.current
}

function goBack() { uni.navigateBack() }
function goHome() { uni.switchTab({ url: '/pages/index/index' }) }

function handleBuy() {
  if (!requireAuth()) return
  const type = product.value.type || 1
  const id = product.value.id
  if (type === 3) {
    // 积分兑换 → 直接下单
    uni.navigateTo({ url: `/pages/order/confirm?type=3&productId=${id}&quantity=1` })
  } else {
    // 消费/换购 → 加入购物车或直接下单
    uni.navigateTo({ url: `/pages/order/confirm?type=${type}&productId=${id}&quantity=1` })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, #F9F9F9 0%, #F0EDE8 100%);
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

.safe-area-top { width: 100%; }

.page-nav {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx $spacing-base;

  &__back,
  &__action {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border: 1rpx solid rgba(20, 20, 20, 0.06);
    border-radius: 50%;
    font-size: 28rpx;
    color: $mineral-gray;
    flex-shrink: 0;
  }

  &__title {
    flex: 1;
    font-size: 32rpx;
    font-weight: 700;
    color: $mineral-gray;
    text-align: center;
    letter-spacing: 0.5rpx;
  }
}

// ========== 轮播图 ==========
.gallery-wrap {
  position: relative;
  width: 100%;
  background: $bg-tertiary;
}

.gallery-swiper {
  width: 100%;
  height: 750rpx;
}

.gallery-item {
  width: 100%;
  height: 100%;
}

.gallery-img {
  width: 100%;
  height: 100%;
  display: block;
}

.gallery-dots {
  position: absolute;
  bottom: 24rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10rpx;
  z-index: 2;
}

.gallery-dot {
  width: 32rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;

  &.active {
    background: #fff;
    width: 48rpx;
  }
}

.gallery-counter {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  z-index: 2;
  padding: 6rpx 16rpx;
  background: rgba(47, 53, 66, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20rpx;

  text {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
}

// ========== 价格区块 ==========
.price-section {
  margin: $spacing-base;
}

.price-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.6);
  border-radius: $radius-lg;
  box-shadow: $clay-shadow;
  padding: $spacing-lg;
}

.price-row {
  margin-bottom: $spacing-base;
}

.price-main {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 8rpx;

  &--cash {
    .price-cash {
      font-family: $asset-balance-font;
      font-size: 56rpx;
      font-weight: 700;
      color: $mineral-gray;
      font-variant-numeric: tabular-nums;
      letter-spacing: -1rpx;
    }
  }

  &--points {
    .price-points-value {
      font-family: $asset-balance-font;
      font-size: 56rpx;
      font-weight: 700;
      color: $accent-dark;
      font-variant-numeric: tabular-nums;
    }

    .price-points-unit {
      font-size: 28rpx;
      color: $accent-dark;
      font-weight: 600;
    }
  }

  &--exchange {
    .price-cash {
      font-family: $asset-balance-font;
      font-size: 48rpx;
      font-weight: 700;
      color: $mineral-gray;
      font-variant-numeric: tabular-nums;
    }

    .price-plus {
      font-size: 32rpx;
      color: $text-muted;
      font-weight: 600;
    }

    .price-points {
      font-family: $asset-balance-font;
      font-size: 36rpx;
      font-weight: 700;
      color: $accent-dark;
      font-variant-numeric: tabular-nums;
    }
  }
}

.exchange-formula {
  display: inline-flex;
  padding: 8rpx 16rpx;
  background: rgba(184, 152, 118, 0.08);
  border: 1rpx solid rgba(184, 152, 118, 0.20);
  border-radius: $radius-full;

  text {
    font-size: 22rpx;
    color: $accent-dark;
    font-weight: 500;
  }
}

.earn-hint {
  display: inline-flex;
  padding: 6rpx 16rpx;
  background: rgba(90, 122, 106, 0.08);
  border: 1rpx solid rgba(90, 122, 106, 0.20);
  border-radius: $radius-full;

  text {
    font-size: 22rpx;
    color: $success;
    font-weight: 500;
  }
}

.product-meta {
  padding-top: $spacing-base;
  border-top: 1rpx solid $border-light;
}

.product-name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.product-tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  background: rgba(47, 53, 66, 0.06);
  color: $text-secondary;
  border-radius: 20rpx;
  border: 1rpx solid rgba(47, 53, 66, 0.08);
}

.sales-row {
  margin-top: 12rpx;
}

.sales-text {
  font-size: 24rpx;
  color: $text-muted;
}

// ========== 详情区 ==========
.detail-section {
  margin: $spacing-base;

  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: $spacing-base;
  }
}

.detail-content {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.6);
  border-radius: $radius-lg;
  box-shadow: $clay-shadow;
  padding: $spacing-lg;
  overflow: hidden;

  // 使富文本内容样式美观
  :deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: $radius-md;
  }

  :deep(p) {
    font-size: 28rpx;
    color: $text-primary;
    line-height: 1.7;
    margin-bottom: 16rpx;
  }
}

// ========== 底部购买栏 ==========
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx $spacing-base;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1rpx solid rgba(20, 20, 20, 0.06);
  box-shadow: 0 -8rpx 32rpx rgba(47, 53, 66, 0.06);

  &__home {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border: 1rpx solid rgba(20, 20, 20, 0.06);
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.95);
      background: rgba(47, 53, 66, 0.04);
    }

    &-icon {
      font-size: 24rpx;
      font-weight: 700;
      color: $mineral-gray;
    }
  }

  &__cta {
    flex: 1;
    height: 88rpx;
    background: $btn-gold-gradient;
    border-radius: $radius-full;
    box-shadow: $btn-gold-shadow;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 700;
    color: #fff;
    letter-spacing: 2rpx;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:active {
      transform: scale(0.97);
      box-shadow: $btn-gold-shadow-active;
    }
  }
}

// ========== 骨架屏 ==========
.detail-skeleton {
  .sk-banner {
    width: 100%;
    height: 750rpx;
    background: $bg-tertiary;
  }

  .sk-content {
    padding: $spacing-lg;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .sk-line {
    height: 28rpx;
    border-radius: 8rpx;
    background: $bg-tertiary;

    &.sk-long { width: 80%; }
    &.sk-medium { width: 55%; }
    &.sk-short { width: 35%; }
  }
}

.shimmer {
  animation: shim 1.4s ease-in-out infinite;
}

@keyframes shim {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 40rpx;
  text-align: center;

  &__icon {
    width: 140rpx;
    height: 140rpx;
    line-height: 140rpx;
    text-align: center;
    font-size: 56rpx;
    font-weight: 800;
    background: $warm-yellow;
    border: 1rpx solid $border-primary;
    border-radius: 50%;
    color: $accent-dark;
    margin-bottom: 32rpx;
  }

  &__text {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 40rpx;
  }

  &__btn {
    height: 80rpx;
    padding: 0 56rpx;
    background: $btn-gold-gradient;
    border-radius: $radius-full;
    box-shadow: $btn-gold-shadow;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 30rpx;
      font-weight: 700;
      color: #fff;
      letter-spacing: 1rpx;
    }
  }
}
</style>
