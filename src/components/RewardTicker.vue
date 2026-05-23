<template>
  <view class="ticker">
    <view class="ticker__prefix">
      <text class="ticker__icon">💰</text>
    </view>
    <view class="ticker__track">
      <view class="ticker__content">
        <text v-for="(item, i) in doubled" :key="i" class="ticker__text">
          {{ item }}　·　
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const items = [
  '张** 成功申购 5000 积分理财',
  '李** 换购获 30% 消费积分返利',
  '王** 确认收货 +50 生态积分到账',
  '赵** 推荐好友奖励 +88 积分',
  '刘** 升级至 V4 会员享专属权益',
  '陈** 昨日理财分红已到账',
]

const doubled = computed(() => [...items, ...items])
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.ticker {
  display: flex;
  align-items: center;
  margin: 0 28rpx 16rpx;
  padding: 16rpx 20rpx;
  background: $ticker-bg;
  border: 1rpx solid $ticker-border;
  border-radius: $ticker-radius;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
  height: 72rpx;
  box-sizing: border-box;
}

.ticker__prefix {
  flex-shrink: 0;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
}

.ticker__icon {
  font-size: 26rpx;
  line-height: 1;
}

.ticker__track {
  flex: 1;
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
}

.ticker__content {
  display: inline-flex;
  white-space: nowrap;
  animation: ticker-scroll 28s linear infinite;
  will-change: transform;
}

.ticker__text {
  font-size: 24rpx;
  color: $ticker-text-color;
  font-weight: 500;
  letter-spacing: 0.3rpx;
}

@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
