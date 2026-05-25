<template>
  <view class="page-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">个人资料</text>
      <view class="page-nav__action" />
    </view>

    <scroll-view scroll-y class="page-body">
      <view class="profile-card">
        <view class="profile-card__row">
          <text class="profile-card__label">手机号</text>
          <text class="profile-card__value">{{ profile.phone || '-' }}</text>
        </view>

        <view class="profile-card__row">
          <text class="profile-card__label">昵称</text>
          <input
            v-model="nickname"
            class="profile-card__input"
            placeholder="请输入昵称"
            placeholder-class="profile-card__placeholder"
            maxlength="20"
          />
        </view>

        <view class="profile-card__row">
          <text class="profile-card__label">会员等级</text>
          <text class="profile-card__value">{{ profile.levelName || profile.level || 'V1' }}</text>
        </view>
      </view>

      <view class="submit-btn" :class="{ 'submit-btn--loading': saving }" @click="doSave">
        <text>{{ saving ? '保存中...' : '保存' }}</text>
      </view>

      <view class="bottom-placeholder" :style="{ height: (100 + safeAreaBottom) + 'px' }" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'

interface Profile {
  phone?: string
  nickname?: string
  level?: string
  levelName?: string
  [key: string]: unknown
}

const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const saving = ref(false)
const profile = ref<Profile>({})
const nickname = ref('')

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
  if (checkAuth()) loadProfile()
})

async function loadProfile() {
  try {
    const data = await userApi.getProfile<Profile>()
    profile.value = data || {}
    nickname.value = profile.value.nickname || ''
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

function goBack() { uni.navigateBack() }

async function doSave() {
  if (saving.value) return
  saving.value = true
  try {
    await userApi.updateProfile({ nickname: nickname.value })
    uni.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  } catch (err: { message?: string }) {
    uni.showToast({ title: err?.message || '保存失败', icon: 'none' })
  } finally {
    saving.value = false
  }
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

  &__back, &__action {
    width: 64rpx; height: 64rpx;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(12px);
    border: 1rpx solid rgba(20, 20, 20, 0.06);
    border-radius: 50%;
    font-size: 28rpx; color: $mineral-gray; flex-shrink: 0;
  }

  &__title {
    flex: 1; font-size: 32rpx; font-weight: 700;
    color: $mineral-gray; text-align: center;
  }
}

// ========== 内容区 ==========
.page-body {
  flex: 1;
  padding: $spacing-base;
}

// ========== 资料卡片 ==========
.profile-card {
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.60);
  border-radius: $radius-xl;
  box-shadow: $clay-shadow;
  padding: 0 $spacing-lg;
  margin-bottom: $spacing-lg;
}

.profile-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 104rpx;
  padding: $spacing-base 0;
  border-bottom: 1rpx solid $border-light;

  &:last-child { border-bottom: none; }
}

.profile-card__label {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  flex-shrink: 0;
}

.profile-card__value {
  font-size: 28rpx;
  color: $text-secondary;
  text-align: right;
}

.profile-card__input {
  flex: 1;
  font-size: 28rpx;
  color: $text-primary;
  text-align: right;
  min-width: 0;
}

.profile-card__placeholder { color: $text-muted; font-size: 28rpx; }

// ========== 提交按钮 ==========
.submit-btn {
  height: 96rpx;
  background: $accent-gradient;
  border-radius: 48rpx;
  box-shadow: $btn-gold-shadow;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  text { font-size: 32rpx; font-weight: 700; color: #fff; }
  &:active { transform: scale(0.98); }
  &--loading { opacity: 0.7; pointer-events: none; }
}

.bottom-placeholder { width: 100%; }
</style>
