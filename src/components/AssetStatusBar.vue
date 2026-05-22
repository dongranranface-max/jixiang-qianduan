<template>
  <view class="asset-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="asset-bar__inner">
      <BrandLogo size="sm" :show-text="false" />
      <scroll-view scroll-x class="asset-bar__scroll" :show-scrollbar="false">
        <view class="asset-bar__chips">
          <view class="chip chip--total">
            <text class="chip__label">总资产</text>
            <text class="chip__value">{{ assetStore.totalAssetsDisplay }}</text>
          </view>
          <view class="chip">
            <text class="chip__label">生态积分</text>
            <text class="chip__value chip__value--ice">{{ assetStore.ecoPointsDisplay }}</text>
          </view>
          <view class="chip">
            <text class="chip__label">消费积分</text>
            <text class="chip__value chip__value--fire">{{ assetStore.consumerPointsDisplay }}</text>
          </view>
          <view class="chip">
            <text class="chip__label">今日分红</text>
            <text class="chip__value chip__value--gold">+{{ assetStore.yesterdayProfitDisplay }}</text>
          </view>
        </view>
      </scroll-view>
      <view class="asset-bar__profit" @click="goWealth">
        <text class="asset-bar__profit-label">增值</text>
        <text class="asset-bar__profit-arrow">›</text>
      </view>
    </view>
    <view class="asset-bar__formula">生态 + 消费 + 待收分红</view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { assetStore } from '@/store/asset'
import BrandLogo from '@/components/BrandLogo.vue'

const statusBarHeight = ref(20)

onMounted(() => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 20
})

function goWealth() {
  uni.navigateTo({ url: '/pages/wealth/index' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.asset-bar {
  position: sticky;
  top: 0;
  z-index: 200;
  background: linear-gradient(
    180deg,
    rgba(47, 53, 66, 0.96) 0%,
    rgba(47, 53, 66, 0.90) 100%
  );
  border-bottom: 1rpx solid rgba(112, 123, 140, 0.12);
  backdrop-filter: blur(24px);
}

.asset-bar__inner {
  display: flex;
  align-items: center;
  padding: 12rpx 20rpx 8rpx;
  gap: 12rpx;
}

.asset-bar__scroll {
  flex: 1;
  white-space: nowrap;
}

.asset-bar__chips {
  display: inline-flex;
  gap: 12rpx;
}

.chip {
  display: inline-flex;
  flex-direction: column;
  padding: 10rpx 20rpx;
  background: rgba(112, 123, 140, 0.08);
  border: 1rpx solid rgba(112, 123, 140, 0.15);
  border-radius: 16rpx;
  min-width: 140rpx;
}
.chip--total {
  background: linear-gradient(135deg, rgba(112, 123, 140, 0.12), rgba(184, 152, 118, 0.08));
  border-color: rgba(112, 123, 140, 0.28);
}
.chip__label {
  font-size: 18rpx;
  color: $text-muted;
}
.chip__value {
  font-size: 26rpx;
  font-weight: 800;
  color: $text-primary;
  margin-top: 4rpx;
}
.chip__value--ice { color: $primary-light; }
.chip__value--fire { color: $accent-light; }
.chip__value--gold { color: $bronze-light; }

.asset-bar__profit {
  flex-shrink: 0;
  padding: 12rpx 16rpx;
  background: rgba(184, 152, 118, 0.18);
  border: 1rpx solid rgba(184, 152, 118, 0.35);
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.asset-bar__profit-label {
  font-size: 22rpx;
  color: $bronze-light;
  font-weight: 700;
}
.asset-bar__profit-arrow {
  color: $bronze-light;
  font-size: 28rpx;
}

.asset-bar__formula {
  font-size: 18rpx;
  color: rgba(112, 123, 140, 0.5);
  text-align: center;
  padding-bottom: 10rpx;
}
</style>
