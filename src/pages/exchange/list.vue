<template>
  <view class="page-container">
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="page-header">
      <text class="page-title">换购商城</text>
      <text class="page-sub">生态积分抵现金</text>
    </view>

    <view class="mall-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: currentTab === tab.key }]"
        @click="currentTab = tab.key"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <scroll-view scroll-y class="product-list" @scrolltolower="loadMore">
      <view class="product-grid">
        <view
          v-for="item in filteredProducts"
          :key="item.id"
          class="product-card"
          @click="goDetail(item)"
        >
          <image class="cover" :src="item.coverImage" mode="aspectFill" />
          <view class="info">
            <text class="name">{{ item.name }}</text>
            <view class="price-row">
              <text class="price">¥{{ item.price }}</text>
              <text class="points-tag">+{{ item.ecoPoints }}积分</text>
            </view>
            <view class="exchange-row">
              <text class="exchange-label">可用{{ item.ecoPoints }}积分抵扣</text>
              <text class="exchange-btn">立即换购</text>
            </view>
          </view>
        </view>
      </view>
      <view v-if="loading" class="loading">加载中...</view>
      <view v-if="!loading && products.length === 0" class="empty">暂无换购商品</view>
    </scroll-view>

    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const statusBarHeight = ref(20)
const currentTab = ref('all')
const products = ref<any[]>([])
const loading = ref(false)

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'digital', label: '数码' },
  { key: 'home', label: '家居' },
  { key: 'food', label: '食品' },
]

const filteredProducts = computed(() => {
  if (currentTab.value === 'all') return products.value
  return products.value
})

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  loadProducts()
})

function loadProducts() {
  // TODO: 调用 API
  // uni.request({ url: '/api/v1/products?type=exchange' })
}

function loadMore() {
  loadProducts()
}

function goDetail(item: any) {
  uni.navigateTo({ url: `/pages/product/detail?id=${item.id}&mode=exchange` })
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
  padding: $spacing-base 0 $spacing-base;

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

.mall-tabs {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-base;
  border-bottom: 1rpx solid $border-color;

  .tab-item {
    padding-bottom: $spacing-sm;
    font-size: 28rpx;
    color: $text-secondary;

    &.active {
      color: $primary;
      border-bottom: 4rpx solid $primary;
    }
  }
}

.product-list {
  height: calc(100vh - 300rpx);
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
    height: 320rpx;
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

    .price-row {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-top: 8rpx;

      .price {
        font-size: 32rpx;
        font-weight: 700;
        color: $danger;
      }

      .points-tag {
        font-size: 20rpx;
        color: $primary;
        background: rgba($primary, 0.15);
        padding: 2rpx 12rpx;
        border-radius: 8rpx;
      }
    }

    .exchange-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8rpx;

      .exchange-label {
        font-size: 20rpx;
        color: $text-muted;
      }

      .exchange-btn {
        font-size: 22rpx;
        color: $bg-primary;
        background: $primary;
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
      }
    }
  }
}

.loading, .empty {
  text-align: center;
  padding: $spacing-xl;
  color: $text-muted;
  font-size: 26rpx;
}
</style>
