<template>
  <view class="auth-page">

    <!-- 顶部导航栏（白底）-->
    <view class="auth-nav">
      <view class="auth-nav__brand">
        <view class="auth-nav__logo">
          <image class="auth-nav__logo-img" src="/static/logo.png" mode="aspectFit" />
        </view>
        <view class="auth-nav__text">
          <text class="auth-nav__name">集享公社</text>
          <text class="auth-nav__slogan">集轻奢·享财富</text>
        </view>
      </view>
      <view class="auth-nav__actions">
        <text class="nav-link" @click="goLogin">登录</text>
      </view>
    </view>

    <!-- Logo 展示区 -->
    <view class="brand-hero">
      <view class="brand-hero__logo-wrap">
        <image class="brand-hero__logo" src="/static/logo.png" mode="aspectFit" />
      </view>
      <view class="brand-hero__glow" />
    </view>

    <!-- 表单区 -->
    <view class="auth-body">
      <scroll-view scroll-y class="auth-scroll">
        <view class="auth-card">

          <view class="auth-card__head">
            <text class="auth-card__title">创建账号</text>
            <text class="auth-card__sub">开启您的生态积分之旅</text>
          </view>

          <!-- 手机号 -->
          <view class="field-group">
            <text class="field-label">手机号</text>
            <view
              class="field"
              :class="{ 'is-focused': focusState.phone, 'is-filled': form.phone.length === 11 }"
            >
              <input
                class="field__input"
                v-model="form.phone"
                type="number"
                maxlength="11"
                placeholder="请输入手机号"
                placeholder-class="field__placeholder"
                @focus="focusState.phone = true"
                @blur="focusState.phone = false"
              />
              <view class="field__line" />
            </view>
          </view>

          <!-- 验证码 -->
          <view class="field-group">
            <text class="field-label">短信验证码</text>
            <view
              class="field"
              :class="{ 'is-focused': focusState.code, 'is-filled': form.code.length === 6 }"
            >
              <input
                class="field__input"
                v-model="form.code"
                type="number"
                maxlength="6"
                placeholder="请输入6位验证码"
                placeholder-class="field__placeholder"
                @focus="focusState.code = true"
                @blur="focusState.code = false"
              />
              <view class="field__line" />
            </view>
            <view class="code-btn-row">
              <view
                class="code-btn"
                :class="{ 'is-counting': countdown > 0 || sending }"
                @click="sendCode"
              >
                <text>{{ codeBtnText }}</text>
              </view>
            </view>
          </view>

          <!-- 密码 -->
          <view class="field-group">
            <text class="field-label">设置密码</text>
            <view
              class="field"
              :class="{ 'is-focused': focusState.pwd, 'is-filled': form.password.length >= 6 }"
            >
              <input
                class="field__input"
                v-model="form.password"
                :type="showPwd ? 'text' : 'password'"
                placeholder="6位以上，数字与字母组合"
                placeholder-class="field__placeholder"
                @focus="focusState.pwd = true"
                @blur="focusState.pwd = false"
              />
              <view class="field__line" />
              <view class="field__eye" @click="showPwd = !showPwd">
                <text class="field__eye-icon">{{ showPwd ? '⊙' : '◉' }}</text>
              </view>
            </view>
          </view>

          <!-- 邀请码 -->
          <view class="field-group">
            <text class="field-label">邀请码 <text class="field-label__must">必填</text></text>
            <view
              class="field field--muted"
              :class="{ 'is-focused': focusState.invite, 'is-filled': form.inviteCode.length > 0 }"
            >
              <input
                class="field__input"
                v-model="form.inviteCode"
                placeholder="请输入邀请码"
                placeholder-class="field__placeholder"
                @focus="focusState.invite = true"
                @blur="focusState.invite = false"
              />
              <view class="field__line" />
            </view>
          </view>

          <!-- 协议勾选 -->
          <view class="terms-row">
            <view class="terms-check" @click="agreed = !agreed">
              <view class="check-square" :class="{ 'is-checked': agreed }">
                <text v-if="agreed" class="check-square__icon">✓</text>
              </view>
            </view>
            <text class="terms-text">
              我已阅读并同意
              <text class="terms-link">《用户协议》</text>
              和
              <text class="terms-link">《隐私政策》</text>
            </text>
          </view>

          <!-- 提交按钮 -->
          <view
            class="btn-submit"
            :class="{ 'is-disabled': !agreed || submitting, 'is-loading': submitting }"
            @click="doRegister"
          >
            <view v-if="!submitting" class="btn-submit__inner">
              <text class="btn-submit__text">注册</text>
            </view>
            <view v-else class="btn-submit__loading">
              <view class="btn-submit__spinner" />
              <text class="btn-submit__loading-text">注册中...</text>
            </view>
          </view>

        </view>
      </scroll-view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { authApi } from '@/utils/api'

const statusBarHeight = ref(20)
const submitting = ref(false)
const sending = ref(false)
const showPwd = ref(false)
const agreed = ref(false)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const focusState = reactive({
  phone: false,
  code: false,
  pwd: false,
  invite: false,
})

const form = ref({
  phone: '',
  code: '',
  password: '',
  inviteCode: '',
})

// #ifdef MP-WEIXIN
const app = getApp()
statusBarHeight.value = app.globalData?.statusBarHeight || 20
// #endif
// #ifdef H5
statusBarHeight.value = (uni as any).getSystemInfoSync()?.statusBarHeight || 20
// #endif

const codeBtnText = computed(() => {
  if (sending.value) return '发送中'
  if (countdown.value > 0) return `${countdown.value}s`
  return '获取验证码'
})

function goLogin() { uni.redirectTo({ url: '/pages/auth/login' }) }

async function sendCode() {
  if (countdown.value > 0 || sending.value) return
  if (!/^1\d{10}$/.test(form.value.phone)) {
    return uni.showToast({ title: '请输入正确手机号', icon: 'none' })
  }
  sending.value = true
  try {
    await authApi.sendResetSmsCode(form.value.phone)
    uni.showToast({ title: '验证码已发送', icon: 'success' })
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value -= 1
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (e: any) {
    uni.showToast({ title: e.message || '发送失败', icon: 'none' })
  } finally {
    sending.value = false
  }
}

async function doRegister() {
  if (submitting.value) return
  if (!/^1\d{10}$/.test(form.value.phone)) {
    return uni.showToast({ title: '请输入手机号', icon: 'none' })
  }
  if (!/^\d{6}$/.test(form.value.code)) {
    return uni.showToast({ title: '请输入6位验证码', icon: 'none' })
  }
  if (form.value.password.length < 6) {
    return uni.showToast({ title: '密码至少6位', icon: 'none' })
  }
  if (!agreed.value) {
    return uni.showToast({ title: '请先阅读并同意用户协议', icon: 'none' })
  }
  if (!form.value.inviteCode) {
    return uni.showToast({ title: '请输入邀请码', icon: 'none' })
  }

  submitting.value = true
  uni.showLoading({ title: '注册中...' })
  try {
    await authApi.register(
      form.value.phone,
      form.value.password,
      form.value.inviteCode || undefined,
      form.value.code
    )
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => uni.redirectTo({ url: '/pages/auth/login' }), 1200)
  } catch (e: any) {
    uni.showToast({ title: e.message || '注册失败', icon: 'none' })
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
  padding: calc(16rpx + env(safe-area-inset-top)) 40rpx 16rpx;
  background: $bg-primary;
  flex-shrink: 0;

  &__brand {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  &__logo {
    width: 72rpx;
    height: 72rpx;
    border-radius: 20rpx;
    background: $mineral-gray;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 4rpx 16rpx rgba(47, 53, 66, 0.15);

    &-img {
      width: 48rpx;
      height: 48rpx;
      display: block;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
  }

  &__name {
    font-size: 32rpx;
    font-weight: 700;
    color: $mineral-gray;
    letter-spacing: 1rpx;
    line-height: 1;
  }

  &__slogan {
    font-size: 20rpx;
    color: $mineral-blue;
    letter-spacing: 0.5rpx;
    line-height: 1;
  }

  &__actions { flex-shrink: 0; }
}

.nav-link {
  font-size: 28rpx;
  color: $accent-dark;
  font-weight: 600;
  padding: 8rpx 4rpx;
}

// ============================================
//  Logo 展示区
// ============================================
.brand-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36rpx 0 20rpx;
  position: relative;
  flex-shrink: 0;

  &__logo-wrap {
    width: 140rpx;
    height: 140rpx;
    border-radius: 36rpx;
    background: $mineral-gray;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    z-index: 2;
    box-shadow: 0 8rpx 32rpx rgba(47, 53, 66, 0.2);
  }

  &__logo {
    width: 96rpx;
    height: 96rpx;
    display: block;
  }

  &__glow {
    width: 200rpx;
    height: 60rpx;
    background: radial-gradient(ellipse at center, rgba(184, 152, 118, 0.15) 0%, transparent 70%);
    margin-top: -10rpx;
    position: relative;
    z-index: 1;
  }
}

// ============================================
//  表单区
// ============================================
.auth-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx 32rpx 32rpx;
}

.auth-scroll {
  flex: 1;
  width: 100%;
  max-width: 620rpx;
  &::-webkit-scrollbar { display: none; width: 0; height: 0; }
}

.auth-card {
  width: 100%;
  background: $bg-secondary;
  border-radius: $radius-xl;
  padding: 40rpx 40rpx 48rpx;
  box-shadow: 0 2rpx 24rpx rgba(47, 53, 66, 0.05);
  border: 1rpx solid rgba(20, 20, 20, 0.05);

  &__head { margin-bottom: 32rpx; }

  &__title {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    color: $mineral-gray;
    letter-spacing: 0;
    margin-bottom: 10rpx;
    line-height: 1.1;
  }

  &__sub {
    display: block;
    font-size: 26rpx;
    color: $text-muted;
    font-weight: 400;
    line-height: 1.4;
  }
}

// ============================================
//  字段组
// ============================================
.field-group {
  margin-bottom: 24rpx;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 23rpx;
  color: $text-secondary;
  font-weight: 500;
  margin-bottom: 10rpx;
  letter-spacing: 0.5rpx;

  &__must {
    font-size: 20rpx;
    color: $accent-dark;
    font-weight: 400;
  }
}

.field {
  position: relative;

  &__input {
    width: 100%;
    height: 84rpx;
    background: transparent;
    border: none;
    border-radius: 0;
    font-size: 30rpx;
    font-weight: 500;
    color: $mineral-gray;
    padding: 0;
    box-sizing: border-box;

    &::placeholder { color: $text-muted; font-weight: 400; }
    &:focus { outline: none; }
  }

  &__line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2rpx;
    background: rgba(20, 20, 20, 0.08);
    transition: background 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2rpx;
      background: linear-gradient(90deg, $accent-dark, $bronze-gold);
      border-radius: 2rpx;
      transition: width 0.4s ease;
    }

    .is-focused & {
      &::after { width: 100%; }
    }
    .is-filled & {
      &::after { width: 100%; }
    }
  }

  &__eye {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &-icon {
      font-size: 32rpx;
      color: $text-muted;
      line-height: 1;
    }
  }

  &--muted {
    .field__input {
      font-size: 28rpx;
      color: $text-muted;
      &::placeholder { color: rgba(112, 123, 140, 0.45); }
    }
    .field__line { height: 1rpx; opacity: 0.5; }
  }
}

// ============================================
//  验证码按钮
// ============================================
.code-btn-row {
  margin-top: 14rpx;
  display: flex;
}

.code-btn {
  height: 60rpx;
  padding: 0 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1.5rpx solid rgba(142, 116, 89, 0.4);
  border-radius: 30rpx;
  font-size: 23rpx;
  color: $accent-dark;
  font-weight: 600;
  transition: all 0.3s ease;

  &:active {
    background: rgba(142, 116, 89, 0.08);
    transform: scale(0.98);
  }

  &.is-counting {
    color: $text-muted;
    border-color: rgba(20, 20, 20, 0.1);
  }
}

// ============================================
//  协议勾选
// ============================================
.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
  margin-bottom: 28rpx;
}

.terms-check { flex-shrink: 0; padding-top: 2rpx; }

.check-square {
  width: 40rpx;
  height: 40rpx;
  border-radius: 10rpx;
  border: 1.5rpx solid rgba(20, 20, 20, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &.is-checked {
    background: $accent-dark;
    border-color: $accent-dark;
  }

  &__icon {
    font-size: 20rpx;
    color: #FFFFFF;
    font-weight: 700;
    line-height: 1;
  }
}

.terms-text {
  font-size: 23rpx;
  color: $text-muted;
  line-height: 1.6;
  flex: 1;
}

.terms-link {
  color: $accent-dark;
  font-weight: 600;
}

// ============================================
//  提交按钮
// ============================================
.btn-submit {
  height: 100rpx;
  border-radius: 50rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 6rpx 28rpx rgba(47, 53, 66, 0.18);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:active {
    transform: scale(0.985);
    box-shadow: 0 3rpx 14rpx rgba(47, 53, 66, 0.12);
  }

  &.is-disabled {
    opacity: 0.45;
    pointer-events: none;
  }

  &.is-loading { opacity: 0.75; }

  &__inner,
  &__loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $mineral-gray;
    border-radius: inherit;
  }

  &__text {
    font-size: 30rpx;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 6rpx;
  }

  &__spinner {
    width: 32rpx;
    height: 32rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.3);
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
</style>