<template>
  <view class="ticker glass-card">
    <text class="ticker__icon">⚡</text>
    <view class="ticker__track">
      <view class="ticker__content">
        <text v-for="(t, i) in doubled" :key="i" class="ticker__item">{{ t }}　　</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const items = [
  '用户 138****6721 申购跨境理财 +580 积分',
  '用户 159****3308 换购获 30% 消费积分',
  '用户 186****9012 确认收货 +50 生态积分',
  '用户 177****4455 推荐奖励 +88 积分',
  '用户 135****7788 升级至 V4 会员',
]

const doubled = computed(() => [...items, ...items])
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.ticker {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  margin-bottom: 28rpx;
  overflow: hidden;
}
.ticker__icon { font-size: 28rpx; margin-right: 12rpx; color: $primary; }
.ticker__track { flex: 1; overflow: hidden; }
.ticker__content {
  display: inline-flex;
  white-space: nowrap;
  animation: ticker-scroll 30s linear infinite;
}
.ticker__item { font-size: 24rpx; color: $text-secondary; }
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
