<template>
  <view class="asset-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <!-- 深色金融毛玻璃资产卡片 -->
    <view class="asset-card">
      <!-- 左侧：品牌 + 总资产 -->
      <view class="asset-card__left">
        <view class="asset-card__logo-wrap">
          <image
            class="asset-card__logo"
            src="/static/logo.png"
            mode="aspectFit"
            width="32"
            height="32"
          />
        </view>
        <view class="asset-card__balance">
          <text class="asset-card__balance-label">总资产</text>
          <view class="asset-card__balance-row">
            <text class="asset-card__balance-value">
              {{ hidden ? '****' : assetStore.totalAssetsDisplay }}
            </text>
            <view class="asset-card__eye" @click="toggleHidden">
              <svg v-if="!hidden" class="eye-icon" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 右侧：昨日收益 -->
      <view class="asset-card__profit" @click="goWealth">
        <text class="asset-card__profit-tag">昨日收益</text>
        <text class="asset-card__profit-value">+{{ hidden ? '**' : assetStore.yesterdayProfitDisplay }}</text>
        <view class="asset-card__profit-arrow">
          <text>增值 ›</text>
        </view>
      </view>
    </view>

    <!-- 积分明细 -->
    <view class="asset-strip">
      <view class="asset-strip__item">
        <text class="asset-strip__label">生态积分</text>
        <text class="asset-strip__value asset-strip__value--ice">
          {{ hidden ? '****' : assetStore.ecoPointsDisplay }}
        </text>
      </view>
      <view class="asset-strip__divider" />
      <view class="asset-strip__item">
        <text class="asset-strip__label">消费积分</text>
        <text class="asset-strip__value asset-strip__value--fire">
          {{ hidden ? '****' : assetStore.consumerPointsDisplay }}
        </text>
      </view>
      <view class="asset-strip__divider" />
      <view class="asset-strip__item">
        <text class="asset-strip__label">待收分红</text>
        <text class="asset-strip__value asset-strip__value--gold">
          {{ hidden ? '****' : '—' }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { assetStore } from '@/store/asset'

const statusBarHeight = ref(20)
const hidden = ref(false)

statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 20

function toggleHidden() {
  hidden.value = !hidden.value
}

function goWealth() {
  uni.switchTab({ url: '/pages/wealth/index' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

// 深色毛玻璃资产卡片
.asset-card {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin: 0 28rpx 16rpx;
  padding: 24rpx;
  background: $asset-card-bg;
  border: 1rpx solid $asset-card-border;
  border-radius: $asset-card-radius;
  box-shadow: $asset-card-shadow;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;

  // 左上角光晕装饰
  &::before {
    content: '';
    position: absolute;
    top: -20rpx;
    left: -20rpx;
    width: 160rpx;
    height: 160rpx;
    background: radial-gradient(circle, rgba(184, 152, 118, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }
}

.asset-card__left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.asset-card__logo-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(212, 180, 131, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.asset-card__logo {
  width: 40rpx;
  height: 40rpx;
  display: block;
}

.asset-card__balance {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.asset-card__balance-label {
  font-size: $asset-label-size;
  color: $asset-label-color;
  font-weight: $asset-label-weight;
}

.asset-card__balance-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.asset-card__balance-value {
  font-family: $asset-balance-font;
  font-size: $asset-balance-size;
  font-weight: $asset-balance-weight;
  color: $asset-balance-color;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5rpx;
  line-height: 1;
}

.asset-card__eye {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.eye-icon {
  width: 32rpx;
  height: 32rpx;
  color: $asset-eye-color;
  transition: color 0.2s ease;
  display: block;

  &:active {
    color: $asset-eye-active;
  }
}

// 右侧昨日收益
.asset-card__profit {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding-left: 24rpx;
  border-left: 1rpx solid rgba(212, 180, 131, 0.12);
  gap: 6rpx;
}

.asset-card__profit-tag {
  font-size: $asset-label-size;
  color: $asset-label-color;
  font-weight: $asset-label-weight;
}

.asset-card__profit-value {
  font-family: $asset-balance-font;
  font-size: $asset-profit-size;
  font-weight: $asset-profit-weight;
  color: $asset-profit-color;
  font-variant-numeric: tabular-nums;
}

.asset-card__profit-arrow {
  font-size: 20rpx;
  color: rgba(184, 152, 118, 0.6);
  font-weight: 600;

  text {
    letter-spacing: 0.5rpx;
  }
}

// 积分明细条
.asset-strip {
  display: flex;
  align-items: center;
  margin: 0 28rpx 20rpx;
  padding: 20rpx 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.asset-strip__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 0 16rpx;
}

.asset-strip__label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 500;
}

.asset-strip__value {
  font-family: $asset-balance-font;
  font-size: 30rpx;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #fff;

  &--ice { color: rgba(212, 196, 174, 0.85); }
  &--fire { color: rgba(212, 180, 131, 0.9); }
  &--gold { color: $bronze-light; }
}

.asset-strip__divider {
  width: 1rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}
</style>
