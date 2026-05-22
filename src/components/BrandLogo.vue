<template>
  <view class="brand-logo" :class="[`brand-logo--${size}`]">
    <image class="brand-logo__img" src="/static/logo.png" mode="aspectFit" />
    <view v-if="showText" class="brand-logo__text">
      <text class="brand-logo__name">{{ BRAND_NAME }}</text>
      <text v-if="tagline" class="brand-logo__tag">{{ tagline }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { BRAND_NAME } from '@/config'

withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    showText?: boolean
    tagline?: string
  }>(),
  { size: 'md', showText: true, tagline: '消费即投资' }
)
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.brand-logo__img {
  border-radius: 50%;
  box-shadow: 0 0 20rpx rgba(196, 165, 116, 0.4);
}
.brand-logo--sm .brand-logo__img { width: 48rpx; height: 48rpx; }
.brand-logo--md .brand-logo__img { width: 64rpx; height: 64rpx; }
.brand-logo--lg .brand-logo__img { width: 96rpx; height: 96rpx; }

.brand-logo__text { display: flex; flex-direction: column; line-height: 1.2; }
.brand-logo__name {
  font-size: 30rpx;
  font-weight: 800;
  background: linear-gradient(90deg, $accent-dark 0%, $gold 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.brand-logo--lg .brand-logo__name { font-size: 40rpx; }
.brand-logo__tag {
  font-size: 20rpx;
  color: $text-muted;
  margin-top: 4rpx;
}
</style>
