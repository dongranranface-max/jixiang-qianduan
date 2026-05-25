<template>
  <view class="skeleton-grid">
    <view v-for="i in count" :key="i" class="skeleton-item">
      <!-- 图片区 -->
      <view class="skeleton-image shimmer" />
      <!-- 信息区 -->
      <view class="skeleton-body">
        <view class="skeleton-title shimmer" />
        <view class="skeleton-title sk-short shimmer" />
        <view class="skeleton-price-row">
          <view class="skeleton-price shimmer" />
          <view class="skeleton-tag shimmer" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  count?: number
}>()
</script>

<script lang="ts">
export default {
  name: 'SkeletonProductGrid',
  options: { virtualHost: true },
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  padding: 0 $spacing-base;
}

.skeleton-item {
  background: $bg-secondary;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $clay-shadow;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 1;
  background: $warm-yellow;
}

.skeleton-body {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.skeleton-title {
  height: 28rpx;
  border-radius: 8rpx;
  background: $warm-yellow;
  width: 90%;

  &.sk-short {
    width: 60%;
    height: 24rpx;
  }
}

.skeleton-price-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 4rpx;
}

.skeleton-price {
  height: 28rpx;
  width: 80rpx;
  border-radius: 8rpx;
  background: $warm-yellow;
}

.skeleton-tag {
  height: 28rpx;
  width: 100rpx;
  border-radius: 8rpx;
  background: $warm-blue;
}
</style>
