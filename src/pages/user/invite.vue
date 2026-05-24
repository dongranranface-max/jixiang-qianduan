<template>
  <view class="page-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">邀请有礼</text>
      <view class="page-nav__action" />
    </view>

    <scroll-view scroll-y class="invite-body">
      <!-- Banner -->
      <view class="invite-banner">
        <view class="invite-banner__icon">邀</view>
        <text class="invite-banner__title">邀请好友加入</text>
        <text class="invite-banner__sub">好友消费，你躺赚{{ rewardConfig?.referralRewardRate || '10' }}%积分奖励</text>
        <text class="invite-banner__rule">无层级上限，永续收益</text>
      </view>

      <!-- 邀请码卡片 -->
      <view class="code-card">
        <text class="code-card__label">我的邀请码</text>
        <text class="code-card__code">{{ inviteCode }}</text>
        <view class="code-card__copy" @click="copyCode">
          <text>复制邀请码</text>
        </view>
      </view>

      <!-- 分享链接 -->
      <view class="share-section">
        <text class="section-head">分享链接</text>
        <view class="share-url">{{ shareUrl }}</view>
        <view class="share-btn" @click="shareInvite">
          <text>分享给好友</text>
        </view>
      </view>

      <!-- 奖励规则 -->
      <view class="rules-section">
        <text class="section-head">邀请奖励规则</text>
        <view class="rule-list">
          <view class="rule-card">
            <view class="rule-card__icon">邀</view>
            <view class="rule-card__body">
              <text class="rule-card__title">10% 无限级推荐奖励</text>
              <text class="rule-card__desc">你推荐的好友在商城任意消费，你都将获得该笔积分的 10% 作为推荐奖励，实时到账，无层级上限</text>
            </view>
          </view>
          <view class="rule-card">
            <view class="rule-card__icon">益</view>
            <view class="rule-card__body">
              <text class="rule-card__title">团队业绩计入小区理财</text>
              <text class="rule-card__desc">好友申购理财项目的积分，会计入你的小区业绩，帮助你升级会员等级，获得更高每日分红</text>
            </view>
          </view>
          <view class="rule-card">
            <view class="rule-card__icon">礼</view>
            <view class="rule-card__body">
              <text class="rule-card__title">好友注册即得启动积分</text>
              <text class="rule-card__desc">好友使用你的邀请码注册，将获得平台赠送的启动积分</text>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-placeholder" :style="{ height: (100 + safeAreaBottom) + 'px' }" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { referralApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'

const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const inviteCode = ref('')
const shareUrl = ref('')
const rewardConfig = ref<{ referralRewardRate?: string } | null>(null)

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
  if (checkAuth()) loadData()
})

async function loadData() {
  try {
    const [codeRes, configRes] = await Promise.all([
      referralApi.getInviteCode(),
      referralApi.getRewardConfig(),
    ])
    inviteCode.value = codeRes?.inviteCode || ''
    shareUrl.value = codeRes?.inviteUrl || `https://jixiang.com/register?code=${inviteCode.value}`
    rewardConfig.value = configRes
  } catch {
    inviteCode.value = ''
  }
}

function goBack() { uni.navigateBack() }

function copyCode() {
  uni.setClipboardData({
    data: inviteCode.value,
    success: () => uni.showToast({ title: '已复制', icon: 'success' }),
  })
}

function shareInvite() {
  uni.share({
    provider: 'weixin',
    type: 0,
    title: '邀请你加入ECO积分商城',
    scene: 'WXSceneSession',
    messageExt: `我的邀请码：${inviteCode.value}，注册即得积分！`,
    href: shareUrl.value,
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  @include page-bg;
  display: flex;
  flex-direction: column;
}

.status-bar { width: 100%; }

// ========== 导航栏 ==========
.page-nav {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx $spacing-base;
  background: rgba(249, 249, 249, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1rpx solid rgba(20, 20, 20, 0.04);

  &__back,
  &__action {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(12px);
    border: 1rpx solid rgba(20, 20, 20, 0.06);
    border-radius: 50%;
    font-size: 28rpx;
    color: $mineral-gray;
    flex-shrink: 0;
  }

  &__title {
    flex: 1;
    font-size: 32rpx;
    font-weight: 700;
    color: $mineral-gray;
    text-align: center;
  }
}

// ========== 内容区 ==========
.invite-body {
  flex: 1;
  padding: $spacing-base;
}

// ========== Banner ==========
.invite-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xl $spacing-lg;
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.60);
  border-radius: $radius-xl;
  box-shadow: $shadow-gold;
  margin-bottom: $spacing-base;

  &__icon {
    width: 100rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $warm-yellow;
    border: 2rpx solid $border-primary;
    border-radius: 50%;
    font-size: 36rpx;
    font-weight: 800;
    color: $accent-dark;
    margin-bottom: $spacing-base;
  }

  &__title {
    font-size: 40rpx;
    font-weight: 800;
    color: $text-primary;
    margin-bottom: 8rpx;
  }

  &__sub {
    font-size: 28rpx;
    color: $accent-dark;
    font-weight: 500;
    margin-bottom: 4rpx;
  }

  &__rule {
    font-size: 24rpx;
    color: $text-muted;
  }
}

// ========== 邀请码卡片 ==========
.code-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xl $spacing-lg;
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.60);
  border-radius: $radius-lg;
  box-shadow: $clay-shadow;
  margin-bottom: $spacing-base;

  &__label {
    font-size: 24rpx;
    color: $text-muted;
    margin-bottom: 12rpx;
  }

  &__code {
    font-family: $asset-balance-font;
    font-size: 64rpx;
    font-weight: 800;
    color: $mineral-gray;
    letter-spacing: 8rpx;
    margin-bottom: $spacing-base;
  }

  &__copy {
    height: 72rpx;
    padding: 0 48rpx;
    background: $accent-gradient;
    border-radius: $radius-full;
    box-shadow: $btn-gold-shadow;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 28rpx;
      font-weight: 700;
      color: #fff;
    }
  }
}

// ========== 分享区 ==========
.share-section {
  margin-bottom: $spacing-base;

  .share-url {
    background: rgba(255, 255, 255, 0.88);
    border: 1rpx solid $border-light;
    border-radius: $radius-md;
    padding: $spacing-base;
    font-size: 22rpx;
    color: $text-muted;
    word-break: break-all;
    margin: $spacing-base 0;
  }

  .share-btn {
    height: 88rpx;
    background: $mineral-gray;
    border-radius: $radius-full;
    box-shadow: $btn-brand-shadow;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 30rpx;
      font-weight: 700;
      color: $accent-light;
    }
  }
}

// ========== 规则区 ==========
.section-head {
  @include section-head;
  margin-bottom: $spacing-base;
}

.rule-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.rule-card {
  display: flex;
  gap: $spacing-base;
  padding: $spacing-base;
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.60);
  border-radius: $radius-lg;
  box-shadow: $clay-shadow;

  &__icon {
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $warm-yellow;
    border: 1rpx solid $border-primary;
    border-radius: 50%;
    font-size: 28rpx;
    font-weight: 800;
    color: $accent-dark;
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6rpx;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 700;
    color: $text-primary;
  }

  &__desc {
    font-size: 24rpx;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.bottom-placeholder { width: 100%; }
</style>
