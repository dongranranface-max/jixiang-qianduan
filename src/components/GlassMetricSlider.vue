<template>
  <view class="metric-slider">
    <swiper class="metric-slider__swiper" :current="idx" circular @change="onChange">
      <swiper-item v-for="(m, i) in metrics" :key="i">
        <view class="metric-card glass-dashboard">
          <text class="metric-card__label">{{ m.label }}</text>
          <view class="metric-card__row">
            <text class="metric-card__value" :class="m.theme">{{ m.value }}</text>
            <text class="metric-card__unit">{{ m.unit }}</text>
          </view>
          <text class="metric-card__hint">{{ m.hint }}</text>
        </view>
      </swiper-item>
    </swiper>
    <view class="metric-slider__dots">
      <view v-for="(_, i) in metrics" :key="i" class="dot" :class="{ active: idx === i }" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { assetStore } from '@/store/asset'

const idx = ref(0)

const metrics = computed(() => [
  {
    label: '昨日分红',
    value: assetStore.yesterdayProfitDisplay,
    unit: '积分',
    hint: '等级日分红自动到账',
    theme: 'fire',
  },
  {
    label: '累计收益',
    value: assetStore.stateRef.totalEarnings.toLocaleString('zh-CN'),
    unit: '积分',
    hint: '含理财与推荐奖励',
    theme: 'ice',
  },
  {
    label: '小区业绩',
    value: assetStore.stateRef.teamPerformance.toLocaleString('zh-CN'),
    unit: '积分',
    hint: `当前 ${assetStore.levelName} · 距升级还差 ${assetStore.stateRef.upgradeNeed}`,
    theme: 'gold',
  },
])

function onChange(e: { detail: { current: number } }) {
  idx.value = e.detail.current
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.metric-slider { margin-bottom: 24rpx; }
.metric-slider__swiper { height: 200rpx; }
.metric-card {
  margin: 0 4rpx;
  padding: 28rpx 32rpx;
  height: 168rpx;
}
.metric-card__label { font-size: 24rpx; color: $text-muted; }
.metric-card__row {
  display: flex;
  align-items: baseline;
  margin-top: 12rpx;
}
.metric-card__value {
  font-size: 52rpx;
  font-weight: 800;
  &.ice { color: $primary-light; text-shadow: 0 0 20rpx rgba(0, 212, 255, 0.4); }
  &.fire { color: $accent-light; text-shadow: 0 0 20rpx rgba(255, 107, 53, 0.4); }
  &.gold { color: $gold-light; }
}
.metric-card__unit {
  font-size: 26rpx;
  color: $text-muted;
  margin-left: 8rpx;
}
.metric-card__hint { font-size: 22rpx; color: $text-muted; margin-top: 8rpx; }
.metric-slider__dots {
  display: flex;
  justify-content: center;
  gap: 10rpx;
  margin-top: 12rpx;
}
.dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: rgba(0, 212, 255, 0.2);
  &.active {
    width: 24rpx;
    border-radius: 5rpx;
    background: $primary;
  }
}
</style>
