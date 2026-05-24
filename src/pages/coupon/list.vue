<template>
  <view class="page-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">我的优惠券</text>
      <view class="page-nav__action" />
    </view>

    <view class="coupon-tabs">
      <view
        class="coupon-tab"
        :class="{ active: currentTab === 'available' }"
        @click="currentTab = 'available'"
      >
        <text>可用</text>
        <view class="coupon-tab__count">
          <text>{{ availableCoupons.length }}</text>
        </view>
      </view>
      <view
        class="coupon-tab"
        :class="{ active: currentTab === 'used' }"
        @click="currentTab = 'used'"
      >
        <text>已使用</text>
        <view class="coupon-tab__count">
          <text>{{ usedCoupons.length }}</text>
        </view>
      </view>
      <view
        class="coupon-tab"
        :class="{ active: currentTab === 'expired' }"
        @click="currentTab = 'expired'"
      >
        <text>已过期</text>
        <view class="coupon-tab__count">
          <text>{{ expiredCoupons.length }}</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="coupon-list">
      <view v-if="loading && !currentList.length" class="loading-wrap">
        <view class="loading-spinner" />
        <text>加载中...</text>
      </view>

      <view v-if="currentTab === 'available'">
        <view
          class="coupon-card"
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          @click="useCoupon(coupon)"
        >
          <view class="coupon-card__left">
            <text class="coupon-card__price-symbol">¥</text>
            <text class="coupon-card__price-value">{{ coupon.amount }}</text>
            <text class="coupon-card__threshold">满{{ coupon.minAmount }}可用</text>
          </view>
          <view class="coupon-card__right">
            <view class="coupon-card__top">
              <text class="coupon-card__name">{{ coupon.name }}</text>
              <text class="coupon-card__range">{{ coupon.typeName }}</text>
            </view>
            <text class="coupon-card__date">有效期至 {{ formatDate(coupon.expireAt) }}</text>
            <view class="coupon-card__action">
              <text>立即使用</text>
            </view>
          </view>
          <view class="coupon-card__badge coupon-card__badge--active">
            <text>可用</text>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'used'">
        <view
          class="coupon-card coupon-card--disabled"
          v-for="coupon in usedCoupons"
          :key="coupon.id"
        >
          <view class="coupon-card__left">
            <text class="coupon-card__price-symbol">¥</text>
            <text class="coupon-card__price-value">{{ coupon.amount }}</text>
          </view>
          <view class="coupon-card__right">
            <text class="coupon-card__name">{{ coupon.name }}</text>
            <text class="coupon-card__date">使用时间 {{ formatDate(coupon.usedAt) }}</text>
          </view>
          <view class="coupon-card__badge coupon-card__badge--used">
            <text>已使用</text>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'expired'">
        <view
          class="coupon-card coupon-card--disabled"
          v-for="coupon in expiredCoupons"
          :key="coupon.id"
        >
          <view class="coupon-card__left">
            <text class="coupon-card__price-symbol">¥</text>
            <text class="coupon-card__price-value">{{ coupon.amount }}</text>
          </view>
          <view class="coupon-card__right">
            <text class="coupon-card__name">{{ coupon.name }}</text>
            <text class="coupon-card__date">过期时间 {{ formatDate(coupon.expireAt) }}</text>
          </view>
          <view class="coupon-card__badge coupon-card__badge--expired">
            <text>已过期</text>
          </view>
        </view>
      </view>

      <view v-if="!loading && currentList.length === 0" class="empty-state">
        <view class="empty-state__icon">券</view>
        <text class="empty-state__text">暂无优惠券</text>
      </view>

      <view class="bottom-placeholder" :style="{ height: (100 + safeAreaBottom) + 'px' }" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { marketingApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'

const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const currentTab = ref<'available' | 'used' | 'expired'>('available')
const loading = ref(false)

interface Coupon {
  id: string
  name: string
  amount: string
  minAmount: string
  expireAt: string
  usedAt?: string
  type: number
  typeName: string
}

const availableCoupons = ref<Coupon[]>([])
const usedCoupons = ref<Coupon[]>([])
const expiredCoupons = ref<Coupon[]>([])

const currentList = computed(() => {
  switch (currentTab.value) {
    case 'available': return availableCoupons.value
    case 'used': return usedCoupons.value
    case 'expired': return expiredCoupons.value
    default: return []
  }
})

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
  if (checkAuth()) loadCoupons()
})

async function loadCoupons() {
  loading.value = true
  try {
    const [availRes, usedRes, expiredRes] = await Promise.all([
      marketingApi.getMyCoupons({ status: 1 }),
      marketingApi.getMyCoupons({ status: 2 }),
      marketingApi.getMyCoupons({ status: 3 }),
    ])
    availableCoupons.value = availRes?.list || []
    usedCoupons.value = usedRes?.list || []
    expiredCoupons.value = expiredRes?.list || []
  } catch {} finally {
    loading.value = false
  }
}

function goBack() { uni.navigateBack() }
function useCoupon(_coupon: Coupon) { uni.navigateTo({ url: '/pages/buy/index' }) }
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  @include page-bg;
  display: flex;
  flex-direction: column;
}

.status-bar { width: 100%; }

// ========== 导航栏 ==========
.page-nav {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx $spacing-base;
  background: rgba(249, 249, 249, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1rpx solid rgba(20, 20, 20, 0.04);

  &__back,
  &__action {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.88);
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
  }
}

// ========== Tab 切换 ==========
.coupon-tabs {
  display: flex;
  padding: 0 $spacing-base;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1rpx solid $border-light;
}

.coupon-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 88rpx;
  border-bottom: 4rpx solid transparent;
  transition: all 0.2s ease;

  text {
    font-size: 28rpx;
    font-weight: 500;
    color: $text-secondary;
  }

  &.active {
    border-bottom-color: $accent-dark;

    text { color: $mineral-gray; font-weight: 700; }
  }

  &__count {
    min-width: 36rpx;
    height: 36rpx;
    padding: 0 8rpx;
    background: $bg-tertiary;
    border-radius: $radius-full;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 20rpx;
      font-weight: 600;
      color: $text-muted;
    }
  }

  &.active &__count {
    background: rgba(184, 152, 118, 0.12);

    text { color: $accent-dark; }
  }
}

// ========== 列表 ==========
.coupon-list {
  flex: 1;
  padding: $spacing-base;
}

.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 120rpx;
  font-size: 28rpx;
  color: $text-muted;
}

.loading-spinner {
  width: 56rpx;
  height: 56rpx;
  border: 3rpx solid rgba(184, 152, 118, 0.2);
  border-top-color: $accent-dark;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

// ========== 优惠券卡片 ==========
.coupon-card {
  display: flex;
  background: $mineral-gray;
  border-radius: $radius-lg;
  overflow: hidden;
  position: relative;
  margin-bottom: $spacing-base;
  box-shadow: 0 8rpx 32rpx rgba(47, 53, 66, 0.18);
  transition: transform 0.2s ease;

  &:active { transform: scale(0.99); }

  &--disabled {
    background: $bg-tertiary;

    .coupon-card__price-value { color: $text-muted; }
    .coupon-card__right { opacity: 0.5; }
  }

  &__left {
    width: 200rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-base;
    background: linear-gradient(145deg, $accent 0%, $accent-dark 100%);
    flex-shrink: 0;
    gap: 4rpx;
  }

  &__price-symbol {
    font-size: 24rpx;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
  }

  &__price-value {
    font-family: $asset-balance-font;
    font-size: 56rpx;
    font-weight: 800;
    color: #fff;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    letter-spacing: -1rpx;
  }

  &__threshold {
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 4rpx;
  }

  &__right {
    flex: 1;
    padding: $spacing-base;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 6rpx;
  }

  &__top {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
  }

  &__name {
    font-size: 28rpx;
    font-weight: 700;
    color: $text-primary;
  }

  &__range {
    font-size: 22rpx;
    color: $text-muted;
  }

  &__date {
    font-size: 22rpx;
    color: $text-muted;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
    padding: 8rpx 24rpx;
    background: $accent-gradient;
    border-radius: $radius-full;
    margin-top: 6rpx;

    text {
      font-size: 22rpx;
      font-weight: 700;
      color: #fff;
    }
  }

  &__badge {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6rpx 20rpx;
    border-radius: 0 $radius-lg 0 $radius-sm;

    text {
      font-size: 18rpx;
      font-weight: 700;
    }

    &--active {
      background: $warm-yellow;
      text { color: $accent-dark; }
    }

    &--used {
      background: $text-muted;
      text { color: #fff; }
    }

    &--expired {
      background: $bg-tertiary;
      text { color: $text-muted; }
    }
  }
}

// ========== 空状态 ==========
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 40rpx;
  text-align: center;

  &__icon {
    width: 120rpx;
    height: 120rpx;
    line-height: 120rpx;
    text-align: center;
    font-size: 48rpx;
    font-weight: 800;
    background: $warm-yellow;
    border: 1rpx solid $border-primary;
    border-radius: 50%;
    color: $accent-dark;
    margin-bottom: 24rpx;
  }

  &__text {
    font-size: 30rpx;
    font-weight: 600;
    color: $text-primary;
  }
}

.bottom-placeholder { width: 100%; }
</style>
