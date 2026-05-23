<template>
  <view class="auth-page">

    <!-- ============================================
      顶部导航栏
    ============================================ -->
    <view class="auth-nav">
      <view class="auth-nav__brand">
        <view class="auth-nav__logo">
          <image class="auth-nav__logo-img" src="/static/logo.png" mode="aspectFit" />
        </view>
        <view class="auth-nav__text">
          <text class="auth-nav__name">集享公社</text>
          <text class="auth-nav__slogan">集轻奢 · 享财富</text>
        </view>
      </view>
      <view class="auth-nav__actions">
        <text class="nav-link" @click="goRegister">注册账号</text>
      </view>
    </view>

    <!-- ============================================
      品牌英雄区
    ============================================ -->
    <view class="brand-hero">
      <!-- 外圈光晕 -->
      <view class="brand-hero__halo" />
      <!-- LOGO 卡片 -->
      <view class="brand-hero__logo-card">
        <image class="brand-hero__logo" src="/static/logo.png" mode="aspectFit" />
      </view>
      <!-- 底部暖光 -->
      <view class="brand-hero__warm-glow" />
    </view>

    <!-- ============================================
      表单区域
    ============================================ -->
    <view class="auth-body">
      <view class="auth-card">

        <!-- 标题 -->
        <view class="auth-card__head">
          <text class="auth-card__title">欢迎回来</text>
          <text class="auth-card__sub">请输入您的账号信息登录</text>
        </view>

        <!-- 手机号 -->
        <view class="field-group">
          <text class="field-label">手机号</text>
          <view class="field" :class="{ 'is-focused': focusState.phone, 'is-filled': form.phone.length === 11 }">
            <input
              class="field__input"
              v-model="form.phone"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              placeholder-class="field__placeholder"
              @focus="onFocus('phone')"
              @blur="onBlur('phone')"
            />
          </view>
        </view>

        <!-- 密码 -->
        <view class="field-group">
          <text class="field-label">登录密码</text>
          <view class="field" :class="{ 'is-focused': focusState.pwd, 'is-filled': form.password.length >= 6 }">
            <input
              class="field__input"
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              placeholder="请输入登录密码"
              placeholder-class="field__placeholder"
              @focus="onFocus('pwd')"
              @blur="onBlur('pwd')"
            />
            <view class="field__eye" @click="showPwd = !showPwd">
              <text class="field__eye-icon">{{ showPwd ? '✦' : '✧' }}</text>
            </view>
          </view>
        </view>

        <!-- 忘记密码 -->
        <view class="forget-row">
          <text class="forget-link" @click="goForgot">忘记密码？</text>
        </view>

        <!-- 提交按钮 -->
        <view class="btn-submit" :class="{ 'is-loading': submitting }" @click="doLogin">
          <view v-if="!submitting" class="btn-submit__inner">
            <text class="btn-submit__text">登 录</text>
          </view>
          <view v-else class="btn-submit__loading">
            <view class="btn-submit__spinner" />
            <text class="btn-submit__loading-text">登录中...</text>
          </view>
        </view>

        <!-- 底部协议 -->
        <view class="auth-footer">
          <text class="auth-footer__text">
            登录即表示同意
            <text class="auth-footer__link">《用户协议》</text>
            和
            <text class="auth-footer__link">《隐私政策》</text>
          </text>
        </view>

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

const token = uni.getStorageSync('token')
if (token) {
  setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 100)
}

function onFocus(field: 'phone' | 'pwd') { focusState[field] = true }
function onBlur(field: 'phone' | 'pwd') { focusState[field] = false }

function goRegister() { uni.navigateTo({ url: '/pages/auth/register' }) }
function goForgot() { uni.navigateTo({ url: '/pages/auth/forgot-password' }) }

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

.auth-page {
  width: 100vw;
  min-height: 100vh;
  background: $bg-primary;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

// ============================================
//  顶部导航栏
// ============================================
.auth-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(16rpx + env(safe-area-inset-top)) 44rpx 14rpx;
  background: $bg-primary;
  flex-shrink: 0;

  &__brand {
    display: flex;
    align-items: center;
    gap: 18rpx;
  }

  &__logo {
    @include logo-card;
    width: 68rpx;
    height: 68rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;

    &-img {
      width: 44rpx;
      height: 44rpx;
      display: block;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 5rpx;
  }

  &__name {
    font-size: 30rpx;
    font-weight: 800;
    color: $mineral-gray;
    letter-spacing: 1.5rpx;
    line-height: 1;
  }

  &__slogan {
    font-size: 19rpx;
    color: $bronze-gold;
    font-weight: 400;
    letter-spacing: 0.6rpx;
    line-height: 1;
  }

  &__actions { flex-shrink: 0; }
}

.nav-link {
  font-size: 27rpx;
  color: $bronze-gold;
  font-weight: 600;
  padding: 8rpx 2rpx;
  letter-spacing: 0.5rpx;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 4rpx;
    left: 0;
    right: 0;
    height: 2rpx;
    background: $bronze-gold;
    border-radius: 2rpx;
    opacity: 0.5;
  }
}

// ============================================
//  品牌英雄区
// ============================================
.brand-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36rpx 0 20rpx;
  position: relative;
  flex-shrink: 0;

  // 外圈暖色光晕
  &__halo {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 320rpx;
    height: 200rpx;
    background: radial-gradient(ellipse at 50% 40%, rgba(184, 152, 118, 0.13) 0%, transparent 68%);
    pointer-events: none;
  }

  // LOGO 卡片
  &__logo-card {
    @include logo-card;
    width: 148rpx;
    height: 148rpx;
    border-radius: 38rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  &__logo {
    width: 96rpx;
    height: 96rpx;
    display: block;
  }

  // 底部暖光
  &__warm-glow {
    width: 220rpx;
    height: 56rpx;
    background: radial-gradient(ellipse at 50% 50%, rgba(184, 152, 118, 0.18) 0%, transparent 68%);
    margin-top: -8rpx;
    position: relative;
    z-index: 1;
  }
}

// ============================================
//  表单区域
// ============================================
.auth-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 36rpx 0;
}

.auth-card {
  width: 100%;
  max-width: 600rpx;
  @include auth-card;
  padding: 44rpx 44rpx 40rpx;

  &__head {
    margin-bottom: 40rpx;
  }

  &__title {
    display: block;
    font-size: 52rpx;
    font-weight: 800;
    color: $mineral-gray;
    letter-spacing: 0;
    margin-bottom: 12rpx;
    line-height: 1.1;
  }

  &__sub {
    display: block;
    font-size: 26rpx;
    color: $text-muted;
    font-weight: 400;
    line-height: 1.55;
  }
}

// ============================================
//  字段组
// ============================================
.field-group {
  margin-bottom: 28rpx;
}

.field-label {
  display: block;
  font-size: 22rpx;
  color: $text-secondary;
  font-weight: 500;
  margin-bottom: 12rpx;
  letter-spacing: 0.5rpx;
}

.field {
  @include auth-input;
  padding: 0 28rpx;
  position: relative;
  overflow: hidden;

  &__input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    border-radius: 0;
    font-size: 30rpx;
    font-weight: 500;
    color: $mineral-gray;
    padding: 0;
    box-sizing: border-box;

    &::placeholder { color: rgba(138, 138, 138, 0.6); font-weight: 400; }
    &:focus { outline: none; background: transparent; }
  }

  &__eye {
    position: absolute;
    right: 8rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &-icon {
      font-size: 30rpx;
      color: $text-muted;
      line-height: 1;
      transition: color 0.2s;
    }
  }
}

// ============================================
//  忘记密码
// ============================================
.forget-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 36rpx;
}

.forget-link {
  font-size: 24rpx;
  color: $bronze-gold;
  font-weight: 500;
  letter-spacing: 0.3rpx;
  opacity: 0.85;
  transition: opacity 0.2s;

  &:active { opacity: 0.55; }
}

// ============================================
//  提交按钮
// ============================================
.btn-submit {
  height: 104rpx;
  border-radius: 52rpx;
  overflow: hidden;
  position: relative;

  &:active {
    transform: scale(0.984);
  }

  &.is-loading { opacity: 0.72; }

  &__inner,
  &__loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $btn-brand-gradient;
    border-radius: inherit;
    box-shadow: $btn-brand-shadow;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%);
      pointer-events: none;
    }
  }

  &__text {
    font-size: 30rpx;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 6rpx;
  }

  &__spinner {
    width: 30rpx;
    height: 30rpx;
    border: 2.5rpx solid rgba(255, 255, 255, 0.28);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 12rpx;
  }

  &__loading-text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: 2rpx;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// ============================================
//  底部协议
// ============================================
.auth-footer {
  margin-top: 36rpx;
  display: flex;
  justify-content: center;

  &__text {
    font-size: 22rpx;
    color: rgba(20, 20, 20, 0.38);
    text-align: center;
    line-height: 1.7;
    letter-spacing: 0.2rpx;
  }

  &__link {
    color: $bronze-gold;
    font-weight: 500;
  }
}
</style>