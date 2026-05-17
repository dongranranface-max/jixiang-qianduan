<template>
  <view class="page-container">
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="page-header">
      <text class="page-title">兑换商城</text>
      <text class="page-sub">消费积分免费换商品</text>
    </view>

    <view class="user-points-banner">
      <text class="label">我的消费积分</text>
      <text class="value">{{ consumerPoints.toLocaleString() }}</text>
      <text class="tip">仅限消费积分兑换，兑换后不退</text>
    </view>

    <scroll-view scroll-y class="product-list">
      <view class="product-grid">
        <view
          v-for="item in products"
          :key="item.id"
          class="product-card"
          @click="goExchange(item)"
        >
          <image class="cover" :src="item.coverImage" mode="aspectFill" />
          <view class="info">
            <text class="name">{{ item.name }}</text>
            <view class="points-price">
              <text class="points">{{ item.requiredPoints }}积分</text>
              <text class="free">免费兑换</text>
            </view>
            <view :class="['exchange-btn', { disabled: consumerPoints < item.requiredPoints }]">
              {{ consumerPoints >= item.requiredPoints ? '立即兑换' : '积分不足' }}
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const statusBarHeight = ref(20)
const consumerPoints = ref(0)
const products = ref<any[]>([])

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  loadData()
})

function loadData() {
  // TODO: 调用 /api/v1/wallet/balance 获取消费积分
  consumerPoints.value = 0
  // TODO: 调用 /api/v1/products?type=redemption 获取兑换商品
}

function goExchange(item: any) {
  if (consumerPoints.value < item.requiredPoints) {
    uni.showToast({ title: '积分不足', icon: 'none' })
    return
  }
  uni.navigateTo({ url: `/pages/order/confirm?productId=${item.id}&mode=redeem` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding: 0 $spacing-lg;
}

.page-header {
  padding: $spacing-base 0;

  .page-title {
    font-size: 40rpx;
    font-weight: 700;
    color: $text-primary;
    display: block;
  }

  .page-sub {
    font-size: 24rpx;
    color: $primary;
    display: block;
    margin-top: 4rpx;
  }
}

.user-points-banner {
  background: linear-gradient(135deg, rgba($primary, 0.3) 0%, rgba($primary, 0.1) 100%);
  border: 1rpx solid rgba($primary, 0.3);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  text-align: center;
  margin-bottom: $spacing-base;

  .label {
    font-size: 24rpx;
    color: $text-secondary;
    display: block;
  }

  .value {
    font-size: 64rpx;
    font-weight: 700;
    color: $primary;
    display: block;
    margin: 8rpx 0;
  }

  .tip {
    font-size: 22rpx;
    color: $text-muted;
  }
}

.product-list {
  height: calc(100vh - 400rpx);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-base;
}

.product-card {
  background: $bg-card;
  border-radius: $radius-md;
  overflow: hidden;

  .cover {
    width: 100%;
    height: 280rpx;
    background: $bg-secondary;
  }

  .info {
    padding: $spacing-sm $spacing-base;

    .name {
      font-size: 26rpx;
      color: $text-primary;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .points-price {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin: 8rpx 0;

      .points {
        font-size: 32rpx;
        font-weight: 700;
        color: $primary;
      }

      .free {
        font-size: 20rpx;
        color: $text-muted;
        text-decoration: line-through;
      }
    }

    .exchange-btn {
      background: $primary;
      color: #000;
      font-size: 26rpx;
      font-weight: 600;
      text-align: center;
      padding: 12rpx;
      border-radius: 24rpx;

      &.disabled {
        background: $bg-secondary;
        color: $text-muted;
      }
    }
  }
}
</style>
