<template>
  <view class="auth-page">

    <!-- ============================================
      移动端顶部品牌横条
    ============================================ -->
    <view class="auth-brand-bar">
      <view class="brand-left">
        <view class="brand-logo-sm">
          <image class="brand-logo-sm__img" src="/static/logo.png" mode="aspectFit" />
        </view>
        <view class="brand-info">
          <text class="brand-info__name">集享公社</text>
          <text class="brand-info__slogan">集轻奢·享财富</text>
        </view>
      </view>
      <view class="brand-right">
        <text class="brand-nav-link" @click="goRegister">注册</text>
      </view>
    </view>

    <!-- ============================================
      表单区域
    ============================================ -->
    <view class="auth-form-area">
      <view class="auth-form-inner">

        <!-- 页面标题 -->
        <view class="form-header">
          <text class="form-header__title">欢迎回来</text>
          <text class="form-header__sub">请输入您的账号信息</text>
        </view>

        <!-- 手机号 -->
        <view
          class="field-wrap"
          :class="{ 'is-focused': focusState.phone, 'is-filled': form.phone.length === 11 }"
        >
          <input
            class="field-input"
            v-model="form.phone"
            type="number"
            maxlength="11"
            placeholder="手机号"
            placeholder-class="field-placeholder"
            @focus="onFocus('phone')"
            @blur="onBlur('phone')"
          />
          <view class="field-line" />
          <view class="field-glow" />
        </view>

        <!-- 密码 -->
        <view
          class="field-wrap"
          :class="{ 'is-focused': focusState.pwd, 'is-filled': form.password.length >= 6 }"
        >
          <input
            class="field-input"
            v-model="form.password"
            :type="showPwd ? 'text' : 'password'"
            placeholder="登录密码"
            placeholder-class="field-placeholder"
            @focus="onFocus('pwd')"
            @blur="onBlur('pwd')"
          />
          <view class="field-line" />
          <view class="field-glow" />
          <view class="field-toggle" @click="showPwd = !showPwd">
            <text class="field-toggle__icon">{{ showPwd ? '⊙' : '◉' }}</text>
          </view>
        </view>

        <!-- 忘记密码 -->
        <view class="forget-row">
          <text class="forget-link" @click="goForgot">忘记密码？</text>
        </view>

        <!-- 提交按钮 -->
        <view
          class="submit-btn"
          :class="{ 'is-loading': submitting }"
          @click="doLogin"
        >
          <view v-if="!submitting" class="submit-btn__inner">
            <text class="submit-btn__text">登 录</text>
          </view>
          <view v-else class="submit-btn__loading">
            <view class="loading-spinner" />
            <text class="loading-text">登录中...</text>
          </view>
        </view>

        <!-- 第三方登录占位（暂不开放）-->
        <view class="third-section" style="display:none;"></view>

        <!-- 隐私条款 -->
        <text class="privacy-text">
          登录即表示同意《用户协议》和《隐私政策》
        </text>

      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authApi } from '@/utils/api'

const statusBarHeight = ref(20)
const submitting = ref(false)
const showPwd = ref(false)

const focusState = reactive({ phone: false, pwd: false })

const form = ref({
  phone: '',
  password: '',
})

// #ifdef MP-WEIXIN
const app = getApp()
statusBarHeight.value = app.globalData?.statusBarHeight || 20
// #endif
// #ifdef H5
statusBarHeight.value = (uni as any).getSystemInfoSync()?.statusBarHeight || 20
// #endif

// 自动登录跳转
const token = uni.getStorageSync('token')
if (token) {
  setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 100)
}

function onFocus(field: 'phone' | 'pwd') {
  focusState[field] = true
}
function onBlur(field: 'phone' | 'pwd') {
  focusState[field] = false
}

function goRegister() {
  uni.navigateTo({ url: '/pages/auth/register' })
}

function goForgot() {
  uni.navigateTo({ url: '/pages/auth/forgot-password' })
}

async function doLogin() {
  if (submitting.value) return
  if (!form.value.phone || form.value.phone.length !== 11) {
    return uni.showToast({ title: '请输入11位手机号', icon: 'none' })
  }
  if (!form.value.password || form.value.password.length < 6) {
    return uni.showToast({ title: '密码至少6位', icon: 'none' })
  }

  submitting.value = true
  uni.showLoading({ title: '登录中...' })
  try {
    await authApi.login(form.value.phone, form.value.password)
    const { assetStore } = await import('@/store/asset')
    await assetStore.fetchBalance()
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 1200)
  } catch (e: any) {
    uni.showToast({ title: e.message || '登录失败', icon: 'none' })
  } finally {
    submitting.value = false
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

// ============================================
//  全屏移动端布局
// ============================================
.auth-page {
  width: 100vw;
  min-height: 100vh;
  background: $bg-primary;
  display: flex;
  flex-direction: column;
}

// ============================================
//  顶部品牌横条
// ============================================
.auth-brand-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(20rpx + env(safe-area-inset-top)) 32rpx 20rpx;
  background: $mineral-gray;
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.brand-logo-sm {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: rgba(184, 152, 118, 0.15);
  border: 1rpx solid rgba(184, 152, 118, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  &__img {
    width: 48rpx;
    height: 48rpx;
    display: block;
    border-radius: 0;
  }
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 2rpx;

  &__name {
    font-size: 30rpx;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 1rpx;
    line-height: 1.2;
  }

  &__slogan {
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.5rpx;
    line-height: 1.2;
  }
}

.brand-right {
  flex-shrink: 0;
}

.brand-nav-link {
  font-size: 28rpx;
  color: $accent-dark;
  font-weight: 600;
  padding: 8rpx 0;
}

// ============================================
//  表单区域
// ============================================
.auth-form-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.auth-form-inner {
  flex: 1;
  padding: 64rpx 48rpx 48rpx;
  display: flex;
  flex-direction: column;
}

// 页面标题
.form-header {
  margin-bottom: 56rpx;

  &__title {
    display: block;
    font-size: 44rpx;
    font-weight: 700;
    color: $text-primary;
    letter-spacing: 0;
    margin-bottom: 10rpx;
  }

  &__sub {
    display: block;
    font-size: 26rpx;
    color: $text-muted;
    font-weight: 400;
  }
}

// ============================================
//  输入框
// ============================================
.field-wrap {
  position: relative;
  margin-bottom: 48rpx;

  .field-input {
    width: 100%;
    height: 96rpx;
    padding: 0 8rpx;
    background: transparent;
    border: none;
    border-radius: 0;
    font-size: 30rpx;
    font-weight: 500;
    color: $text-primary;
    letter-spacing: 0;
    box-sizing: border-box;

    &::placeholder { color: $text-muted; font-weight: 400; }
    &:focus { outline: none; background: transparent; }
  }

  // 金色底线
  .field-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3rpx;
    background: linear-gradient(90deg, $accent 0%, $gold-light 50%, $accent 100%);
    border-radius: 3rpx 3rpx 0 0;
    transition: width 0.4s ease;
  }

  // 聚焦光晕
  .field-glow {
    position: absolute;
    bottom: -8rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    height: 32rpx;
    background: radial-gradient(ellipse at center, rgba(184, 152, 118, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  // 聚焦态
  &.is-focused {
    .field-line { width: 100%; }
    .field-glow { opacity: 1; }
  }

  // 填满态
  &.is-filled {
    .field-line { width: 100%; }
  }
}

// 密码显示切换
.field-toggle {
  position: absolute;
  right: 8rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &__icon {
    font-size: 32rpx;
    color: $text-muted;
    line-height: 1;
  }
}

// 忘记密码
.forget-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 48rpx;
}

.forget-link {
  font-size: 26rpx;
  color: $accent-dark;
  font-weight: 500;
}

// ============================================
//  提交按钮
// ============================================
.submit-btn {
  height: 100rpx;
  border-radius: 50rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8rpx 32rpx rgba(47, 53, 66, 0.2);

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(47, 53, 66, 0.15);
  }

  &__inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $mineral-gray;
    border-radius: inherit;
  }

  &__text {
    font-size: 32rpx;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 6rpx;
  }

  &__loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $mineral-gray;
    border-radius: inherit;
  }

  &.is-loading {
    opacity: 0.75;
  }
}

.loading-spinner {
  width: 36rpx;
  height: 36rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 12rpx;
}

.loading-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 2rpx;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// ============================================
//  隐私条款
// ============================================
.privacy-text {
  margin-top: 40rpx;
  font-size: 22rpx;
  color: $text-muted;
  text-align: center;
  line-height: 1.6;
  opacity: 0.7;
}
</style>