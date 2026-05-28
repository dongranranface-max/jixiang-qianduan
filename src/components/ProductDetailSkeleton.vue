<template>
  <view class="detail-skeleton">
    <!-- 轮播图骨架 -->
    <view class="sk-gallery shimmer" />

    <!-- 价格区骨架 -->
    <view class="sk-price-section glass-card">
      <view class="sk-line sk-price shimmer" />
      <view class="sk-row">
        <view class="sk-line sk-tag shimmer" />
        <view class="sk-line sk-tag shimmer" />
      </view>
    </view>

    <!-- SKU选择器骨架 -->
    <view class="sk-sku-section glass-card">
      <view class="sk-label shimmer" />
      <view class="sk-sku-row">
        <view class="sk-sku-item shimmer" />
        <view class="sk-sku-item shimmer" />
        <view class="sk-sku-item shimmer" />
      </view>
    </view>

    <!-- 商品描述骨架 -->
    <view class="sk-desc-section glass-card">
      <view class="sk-label shimmer" />
      <view class="sk-line shimmer" />
      <view class="sk-line shimmer" />
      <view class="sk-line sk-line--short shimmer" />
    </view>

    <!-- 底部操作栏骨架 -->
    <view class="sk-bottom-bar">
      <view class="sk-bottom-btn shimmer" />
    </view>
  </view>
</template>

<script setup lang="ts">
// Product Detail Skeleton - v5.2 spec L2 page-level loading
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.detail-skeleton {
  min-height: 100dvh;
  background: $bg-primary;
  padding-bottom: 140rpx; // 为底部操作栏留空间
}

.sk-gallery {
  width: 100%;
  height: 750rpx;
  background: rgba(47, 53, 66, 0.07);
}

.sk-price-section,
.sk-sku-section,
.sk-desc-section {
  margin: $spacing-base $spacing-base 0;
  border-radius: $radius-lg;
}

.sk-line {
  height: 32rpx;
  border-radius: $radius-sm;
  background: rgba(47, 53, 66, 0.07);
  position: relative;
  overflow: hidden;

  &--short {
    width: 60%;
    height: 24rpx;
  }
}

.sk-price {
  height: 56rpx;
  width: 40%;
  margin-bottom: 16rpx;
}

.sk-row {
  display: flex;
  gap: 12rpx;
}

.sk-tag {
  width: 100rpx;
  height: 32rpx;
}

.sk-label {
  width: 120rpx;
  height: 28rpx;
  border-radius: $radius-sm;
  background: rgba(47, 53, 66, 0.07);
  margin-bottom: 16rpx;
}

.sk-sku-row {
  display: flex;
  gap: 12rpx;
}

.sk-sku-item {
  width: 120rpx;
  height: 64rpx;
  border-radius: $radius-md;
  background: rgba(47, 53, 66, 0.07);
}

.sk-desc-section {
  margin-top: $spacing-sm;
}

.sk-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: $bg-secondary;
  display: flex;
  align-items: center;
  padding: 0 $spacing-base;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.sk-bottom-btn {
  width: 100%;
  height: 88rpx;
  border-radius: $radius-full;
  background: rgba(47, 53, 66, 0.07);
}
</style>
