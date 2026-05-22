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
        <text class="brand-nav-link" @click="goLogin">登录</text>
      </view>
    </view>

    <!-- ============================================
      表单区域
    ============================================ -->
    <view class="auth-form-area">
      <scroll-view class="auth-scroll" scroll-y>
        <view class="auth-form-inner">

          <!-- 页面标题 -->
          <view class="form-header">
            <text class="form-header__title">创建账号</text>
            <text class="form-header__sub">开启您的生态积分之旅</text>
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
              @focus="focusState.phone = true"
              @blur="focusState.phone = false"
            />
            <view class="field-line" />
            <view class="field-glow" />
          </view>

          <!-- 验证码 -->
          <view
            class="field-wrap"
            :class="{ 'is-focused': focusState.code, 'is-filled': form.code.length === 6 }"
          >
            <input
              class="field-input"
              v-model="form.code"
              type="number"
              maxlength="6"
              placeholder="短信验证码"
              placeholder-class="field-placeholder"
              @focus="focusState.code = true"
              @blur="focusState.code = false"
            />
            <view class="field-line" />
            <view class="field-glow" />
          </view>

          <!-- 验证码按钮（独立成行） -->
          <view class="code-btn-row">
            <view
              class="code-btn"
              :class="{ 'is-counting': countdown > 0 || sending }"
              @click="sendCode"
            >
              <text>{{ codeBtnText }}</text>
            </view>
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
              placeholder="设置登录密码（6位以上）"
              placeholder-class="field-placeholder"
              @focus="focusState.pwd = true"
              @blur="focusState.pwd = false"
            />
            <view class="field-line" />
            <view class="field-glow" />
            <view class="field-toggle" @click="showPwd = !showPwd">
              <text class="field-toggle__icon">{{ showPwd ? '⊙' : '◉' }}</text>
            </view>
          </view>

          <!-- 邀请码（必填）-->
          <view
            class="field-wrap field-wrap--muted"
            :class="{ 'is-focused': focusState.invite, 'is-filled': form.inviteCode.length > 0 }"
          >
            <input
              class="field-input"
              v-model="form.inviteCode"
              placeholder="请输入邀请码"
              placeholder-class="field-placeholder"
              @focus="focusState.invite = true"
              @blur="focusState.invite = false"
            />
            <view class="field-line" />
            <view class="field-glow" />
          </view>

          <!-- 提交按钮 -->
          <view
            class="submit-btn"
            :class="{ 'is-disabled': !agreed || submitting, 'is-loading': submitting }"
            @click="doRegister"
          >
            <view v-if="!submitting" class="submit-btn__inner">
              <text class="submit-btn__text">注 册</text>
            </view>
            <view v-else class="submit-btn__loading">
              <view class="loading-spinner" />
              <text class="loading-text">注册中...</text>
            </view>
          </view>

          <!-- 协议勾选 -->
          <view class="terms-row">
            <view class="terms-check" @click="agreed = !agreed">
              <view class="check-box" :class="{ 'is-checked': agreed }">
                <text v-if="agreed" class="check-box__icon">✓</text>
              </view>
            </view>
            <text class="terms-text">
              我已阅读并同意
              <text class="terms-link">《用户协议》</text>
              和
              <text class="terms-link">《隐私政策》</text>
            </text>
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

function goLogin() {
  uni.redirectTo({ url: '/pages/auth/login' })
}

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

.auth-scroll {
  flex: 1;
  height: calc(100vh - env(safe-area-inset-top) - 120rpx);
  &::-webkit-scrollbar { display: none; width: 0; height: 0; }
}

.auth-form-inner {
  padding: 64rpx 48rpx 80rpx;
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

  &.is-focused {
    .field-line { width: 100%; }
    .field-glow { opacity: 1; }
  }

  &.is-filled {
    .field-line { width: 100%; }
  }

  // 邀请码弱化
  &--muted {
    .field-input {
      font-size: 28rpx;
      color: $text-muted;
      &::placeholder { color: rgba(112, 123, 140, 0.5); }
    }
    .field-line {
      height: 2rpx;
      opacity: 0.5;
    }
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

// ============================================
//  验证码按钮（独立成行）
// ============================================
.code-btn-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 48rpx;
  margin-top: -16rpx;
}

.code-btn {
  height: 72rpx;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(142, 116, 89, 0.08);
  border: 1rpx solid rgba(142, 116, 89, 0.28);
  border-radius: 36rpx;
  font-size: 26rpx;
  color: $accent-dark;
  font-weight: 600;
  transition: all 0.3s ease;

  &:active {
    background: rgba(142, 116, 89, 0.15);
    transform: scale(0.98);
  }

  &.is-counting {
    color: $text-muted;
    background: transparent;
    border-color: rgba(20, 20, 20, 0.08);
  }
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(47, 53, 66, 0.15);
  }

  &.is-disabled {
    opacity: 0.45;
    pointer-events: none;
  }

  &.is-loading {
    opacity: 0.75;
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
//  协议勾选
// ============================================
.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-top: 32rpx;
}

.terms-check {
  flex-shrink: 0;
  padding-top: 2rpx;
}

.check-box {
  width: 44rpx;
  height: 44rpx;
  border-radius: 10rpx;
  border: 2rpx solid rgba(20, 20, 20, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &.is-checked {
    background: $accent-dark;
    border-color: $accent-dark;
  }

  &__icon {
    font-size: 22rpx;
    color: #FFFFFF;
    font-weight: 700;
  }
}

.terms-text {
  font-size: 24rpx;
  color: $text-muted;
  line-height: 1.6;
  flex: 1;
}

.terms-link {
  color: $accent-dark;
  font-weight: 600;
}
</style>