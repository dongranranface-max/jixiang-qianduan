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
        <text class="nav-link" @click="goLogin">登录</text>
      </view>
    </view>

    <!-- ============================================
      品牌英雄区
    ============================================ -->
    <view class="brand-hero">
      <view class="brand-hero__halo" />
      <view class="brand-hero__logo-card">
        <image class="brand-hero__logo" src="/static/logo.png" mode="aspectFit" />
      </view>
      <view class="brand-hero__warm-glow" />
    </view>

    <!-- ============================================
      表单区域
    ============================================ -->
    <view class="auth-body">
      <scroll-view scroll-y class="auth-scroll" :show-scrollbar="false">
        <view class="auth-card">

          <!-- 标题 -->
          <view class="auth-card__head">
            <text class="auth-card__title">创建账号</text>
            <text class="auth-card__sub">开启您的生态积分财富之旅</text>
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
                @focus="focusState.phone = true"
                @blur="focusState.phone = false"
              />
            </view>
          </view>

          <!-- 验证码 -->
          <view class="field-group">
            <text class="field-label">短信验证码</text>
            <view class="field-row">
              <view class="field field--shrink" :class="{ 'is-focused': focusState.code, 'is-filled': form.code.length === 6 }">
                <input
                  class="field__input"
                  v-model="form.code"
                  type="number"
                  maxlength="6"
                  placeholder="6位验证码"
                  placeholder-class="field__placeholder"
                  @focus="focusState.code = true"
                  @blur="focusState.code = false"
                />
              </view>
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
            <view class="field" :class="{ 'is-focused': focusState.pwd, 'is-filled': form.password.length >= 6 }">
              <input
                class="field__input"
                v-model="form.password"
                :type="showPwd ? 'text' : 'password'"
                placeholder="6位以上，数字与字母组合"
                placeholder-class="field__placeholder"
                @focus="focusState.pwd = true"
                @blur="focusState.pwd = false"
              />
              <view class="field__eye" @click="showPwd = !showPwd">
                <svg v-if="showPwd" class="field__eye-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
                </svg>
                <svg v-else class="field__eye-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </view>
            </view>
          </view>

          <!-- 邀请码（选填，弱化处理） -->
          <view class="field-group field-group--muted">
            <text class="field-label">邀请码 <text class="field-label__optional">（选填）</text></text>
            <view class="field field--muted" :class="{ 'is-focused': focusState.invite }">
              <input
                class="field__input"
                v-model="form.inviteCode"
                placeholder="如有邀请码请输入"
                placeholder-class="field__placeholder"
                @focus="focusState.invite = true"
                @blur="focusState.invite = false"
              />
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
            :class="{
              'is-disabled': !agreed || submitting || !form.phone || !form.code || form.password.length < 6,
              'is-loading': submitting
            }"
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
  padding: 32rpx 0 18rpx;
  position: relative;
  flex-shrink: 0;

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
  padding: 8rpx 36rpx 0;
}

.auth-scroll {
  flex: 1;
  width: 100%;
  max-width: 620rpx;

  &::-webkit-scrollbar { display: none; width: 0; height: 0; }
}

.auth-card {
  width: 100%;
  @include auth-card;
  padding: 40rpx 44rpx 48rpx;

  &__head {
    margin-bottom: 36rpx;
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
  margin-bottom: 24rpx;

  &--muted {
    opacity: 0.5;
    .field-label { font-weight: 400; }
  }
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: $text-secondary;
  font-weight: 500;
  margin-bottom: 12rpx;
  letter-spacing: 0.5rpx;

  &__optional {
    font-size: 20rpx;
    color: $text-muted;
    font-weight: 400;
  }
}

.field {
  @include auth-input;
  padding: 0 28rpx;
  position: relative;
  overflow: hidden;

  &--shrink {
    flex: 1;
    margin-right: 16rpx;
  }

  &--muted {
    background: rgba(255, 255, 255, 0.48);
    border-style: dashed;
    opacity: 1;

    .field__input { color: $text-muted; }
  }

  &__input {
    width: 100%;
    height: 96rpx;
    background: transparent;
    border: none;
    border-radius: 0;
    font-size: 30rpx;
    font-weight: 500;
    color: $mineral-gray;
    padding: 0;
    box-sizing: border-box;

    &::placeholder { color: rgba(138, 138, 138, 0.6); font-weight: 400; }
    &:focus { outline: none; }
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

    &-svg {
      width: 36rpx;
      height: 36rpx;
      color: $text-muted;
      transition: color 0.2s ease;
      flex-shrink: 0;
    }
  }
}

// ============================================
//  验证码行
// ============================================
.field-row {
  display: flex;
  align-items: center;
}

.code-btn {
  @include btn-brand-outline;
  height: 96rpx;
  padding: 0 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23rpx;
  color: $bronze-gold;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;

  &.is-counting {
    color: $text-muted;
    border-color: rgba(47, 53, 66, 0.10);
  }
}

// ============================================
//  协议勾选
// ============================================
.terms-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-bottom: 32rpx;
  margin-top: 8rpx;
}

.terms-check {
  flex-shrink: 0;
  padding-top: 1rpx;
}

.check-square {
  width: 40rpx;
  height: 40rpx;
  border-radius: 10rpx;
  border: 1.5rpx solid rgba(47, 53, 66, 0.15);
  background: rgba(255, 255, 255, 0.70);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  box-shadow: inset 0 2rpx 6rpx rgba(47, 53, 66, 0.04);

  &.is-checked {
    background: $bronze-gold;
    border-color: $bronze-gold;
    box-shadow: 0 4rpx 16rpx rgba(184, 152, 118, 0.30);
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
  color: rgba(20, 20, 20, 0.42);
  line-height: 1.65;
  flex: 1;
  letter-spacing: 0.2rpx;
}

.terms-link {
  color: $bronze-gold;
  font-weight: 600;
  transition: opacity 0.2s;
  &:active { opacity: 0.6; }
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

  &.is-disabled {
    @include btn-brand-disabled;
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
</style>