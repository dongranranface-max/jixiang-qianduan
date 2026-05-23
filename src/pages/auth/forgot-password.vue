<template>
  <view class="auth-page">

    <!-- ============================================
      顶部导航栏
    ============================================ -->
    <view class="auth-nav">
      <view class="auth-nav__left">
        <view class="back-btn" @click="goBack">
          <text class="back-btn__icon">←</text>
        </view>
        <view class="auth-nav__logo">
          <image class="auth-nav__logo-img" src="/static/logo.png" mode="aspectFit" />
        </view>
        <view class="auth-nav__text">
          <text class="auth-nav__name">集享公社</text>
          <text class="auth-nav__slogan">集轻奢 · 享财富</text>
        </view>
      </view>
      <text class="nav-link" @click="goLogin">登录</text>
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
      <view class="auth-card">

        <!-- ========== Step 1: 验证手机 ========== -->
        <template v-if="step === 1">
          <view class="auth-card__head">
            <text class="auth-card__title">短信验证</text>
            <text class="auth-card__sub">验证注册手机号后设置新密码</text>
          </view>

          <!-- 步骤指示器 -->
          <view class="step-bar">
            <view class="step-item is-active">
              <view class="step-item__dot">
                <text class="step-item__num">1</text>
              </view>
              <text class="step-item__label">验证手机</text>
            </view>
            <view class="step-connector" :class="{ 'is-done': step > 1 }" />
            <view class="step-item" :class="{ 'is-active': step > 1 }">
              <view class="step-item__dot">
                <text class="step-item__num">2</text>
              </view>
              <text class="step-item__label">设置密码</text>
            </view>
          </view>

          <!-- 手机号 -->
          <view class="field-group">
            <text class="field-label">注册手机号</text>
            <view class="field" :class="{ 'is-focused': focusState.phone, 'is-filled': form.phone.length === 11 }">
              <input
                class="field__input"
                v-model="form.phone"
                type="number"
                maxlength="11"
                placeholder="请输入注册手机号"
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

          <!-- 提交 -->
          <view
            class="btn-submit"
            :class="{ 'is-disabled': !canGoStep2, 'is-loading': submitting }"
            @click="goStep2"
          >
            <view v-if="!submitting" class="btn-submit__inner">
              <text class="btn-submit__text">下一步</text>
            </view>
            <view v-else class="btn-submit__loading">
              <view class="btn-submit__spinner" />
              <text class="btn-submit__loading-text">验证中...</text>
            </view>
          </view>
        </template>

        <!-- ========== Step 2: 设置新密码 ========== -->
        <template v-else>
          <view class="auth-card__head">
            <text class="auth-card__title">设置新密码</text>
            <text class="auth-card__sub">已为 <text class="phone-marked">{{ maskedPhone }}</text> 验证通过</text>
          </view>

          <!-- 步骤指示器 -->
          <view class="step-bar">
            <view class="step-item is-done">
              <view class="step-item__dot">
                <text class="step-item__icon">✓</text>
              </view>
              <text class="step-item__label">验证手机</text>
            </view>
            <view class="step-connector is-active" />
            <view class="step-item is-active">
              <view class="step-item__dot">
                <text class="step-item__num">2</text>
              </view>
              <text class="step-item__label">设置密码</text>
            </view>
          </view>

          <!-- 新密码 -->
          <view class="field-group">
            <text class="field-label">新密码</text>
            <view class="field" :class="{ 'is-focused': focusState.pwd, 'is-filled': form.password.length >= 6 }">
              <input
                class="field__input"
                v-model="form.password"
                :type="showPwd ? 'text' : 'password'"
                placeholder="6位以上，数字与字母组合"
                placeholder-class="field__placeholder"
                @focus="focusState.pwd = true"
                @blur="focusState.pwd = false"
                @input="onPwdInput"
              />
              <view class="field__eye" @click="showPwd = !showPwd">
                <text class="field__eye-icon">{{ showPwd ? '✦' : '✧' }}</text>
              </view>
            </view>
            <!-- 密码强度 -->
            <view v-if="form.password" class="pwd-strength">
              <view class="pwd-track">
                <view class="pwd-fill" :class="`pwd-fill--${pwdLevel}`" :style="{ width: pwdPercent + '%' }" />
              </view>
              <text class="pwd-hint">{{ pwdHint }}</text>
            </view>
          </view>

          <!-- 确认密码 -->
          <view class="field-group">
            <text class="field-label">确认新密码</text>
            <view class="field" :class="{ 'is-focused': focusState.confirm, 'is-filled': form.confirm.length >= 6 }">
              <input
                class="field__input"
                v-model="form.confirm"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="再次输入新密码"
                placeholder-class="field__placeholder"
                @focus="focusState.confirm = true"
                @blur="focusState.confirm = false"
              />
              <view class="field__eye" @click="showConfirm = !showConfirm">
                <text class="field__eye-icon">{{ showConfirm ? '✦' : '✧' }}</text>
              </view>
            </view>
            <text v-if="confirmDirty && form.confirm !== form.password" class="confirm-error">
              两次密码不一致，请检查
            </text>
          </view>

          <!-- 提交 -->
          <view
            class="btn-submit"
            :class="{ 'is-disabled': !canSubmit || submitting, 'is-loading': submitting }"
            @click="doReset"
          >
            <view v-if="!submitting" class="btn-submit__inner">
              <text class="btn-submit__text">确认重置</text>
            </view>
            <view v-else class="btn-submit__loading">
              <view class="btn-submit__spinner" />
              <text class="btn-submit__loading-text">提交中...</text>
            </view>
          </view>

          <!-- 返回上一步 -->
          <view class="back-step" @click="step = 1">
            <text class="back-step__link">← 返回上一步</text>
          </view>
        </template>

      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { authApi } from '@/utils/api'

const statusBarHeight = ref(20)
const step = ref(1)
const submitting = ref(false)
const sending = ref(false)
const showPwd = ref(false)
const showConfirm = ref(false)
const countdown = ref(0)
const confirmDirty = ref(false)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const focusState = reactive({
  phone: false,
  code: false,
  pwd: false,
  confirm: false,
})

const form = ref({
  phone: '',
  code: '',
  password: '',
  confirm: '',
})

// #ifdef MP-WEIXIN
const app = getApp()
statusBarHeight.value = app.globalData?.statusBarHeight || 20
// #endif
// #ifdef H5
statusBarHeight.value = (uni as any).getSystemInfoSync()?.statusBarHeight || 20
// #endif

const maskedPhone = computed(() => {
  const p = form.value.phone
  return p.length === 11 ? `${p.slice(0, 3)}****${p.slice(7)}` : p
})

const codeBtnText = computed(() => {
  if (sending.value) return '发送中'
  if (countdown.value > 0) return `${countdown.value}s`
  return '获取验证码'
})

const canGoStep2 = computed(() =>
  /^1\d{10}$/.test(form.value.phone) && /^\d{6}$/.test(form.value.code)
)

const pwdLevel = ref(0)
const pwdPercent = ref(0)
const pwdHint = ref('')

const canSubmit = computed(() =>
  form.value.password.length >= 6 && form.value.confirm === form.value.password
)

function goBack() {
  if (step.value === 2) { step.value = 1; return }
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/auth/login' }) })
}
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

function goStep2() {
  if (!canGoStep2.value) return uni.showToast({ title: '请完成手机号与验证码', icon: 'none' })
  step.value = 2
}

function onPwdInput() {
  const p = form.value.password
  let level = 0
  if (p.length >= 6) level = 1
  if (p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p)) level = 2
  if (p.length >= 10 && /[A-Za-z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p)) level = 3
  pwdLevel.value = level
  pwdPercent.value = level === 0 ? Math.min(33, (p.length / 6) * 33) : level * 33
  const hints = ['', '强度一般', '强度良好', '强度优秀']
  pwdHint.value = p.length ? hints[level] || '' : ''
}

async function doReset() {
  if (submitting.value || !canSubmit.value) return
  confirmDirty.value = true
  if (form.value.confirm !== form.value.password) {
    return uni.showToast({ title: '两次密码不一致', icon: 'none' })
  }
  submitting.value = true
  uni.showLoading({ title: '重置中...', mask: true })
  try {
    await authApi.resetPassword(form.value.phone, form.value.code.trim(), form.value.password)
    uni.showToast({ title: '密码已重置', icon: 'success' })
    setTimeout(() => uni.redirectTo({ url: '/pages/auth/login' }), 1200)
  } catch (e: any) {
    uni.showToast({ title: e.message || '重置失败', icon: 'none' })
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
  padding: calc(14rpx + env(safe-area-inset-top)) 36rpx 14rpx;
  background: $bg-primary;
  flex-shrink: 0;

  &__left {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  &__logo {
    @include logo-card;
    width: 64rpx;
    height: 64rpx;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;

    &-img {
      width: 42rpx;
      height: 42rpx;
      display: block;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 5rpx;
  }

  &__name {
    font-size: 28rpx;
    font-weight: 800;
    color: $mineral-gray;
    letter-spacing: 1.2rpx;
    line-height: 1;
  }

  &__slogan {
    font-size: 18rpx;
    color: $bronze-gold;
    font-weight: 400;
    letter-spacing: 0.5rpx;
    line-height: 1;
  }

  &__actions { flex-shrink: 0; }
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
  background: rgba(47, 53, 66, 0.05);

  &:active { background: rgba(47, 53, 66, 0.10); }

  &__icon {
    font-size: 32rpx;
    color: $mineral-gray;
    font-weight: 500;
    line-height: 1;
  }
}

.nav-link {
  font-size: 26rpx;
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
  padding: 28rpx 0 16rpx;
  position: relative;
  flex-shrink: 0;

  &__halo {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 300rpx;
    height: 180rpx;
    background: radial-gradient(ellipse at 50% 40%, rgba(184, 152, 118, 0.12) 0%, transparent 68%);
    pointer-events: none;
  }

  &__logo-card {
    @include logo-card;
    width: 132rpx;
    height: 132rpx;
    border-radius: 34rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  &__logo {
    width: 86rpx;
    height: 86rpx;
    display: block;
  }

  &__warm-glow {
    width: 200rpx;
    height: 48rpx;
    background: radial-gradient(ellipse at 50% 50%, rgba(184, 152, 118, 0.16) 0%, transparent 68%);
    margin-top: -6rpx;
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

.auth-card {
  width: 100%;
  max-width: 600rpx;
  @include auth-card;
  padding: 40rpx 44rpx;

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

.phone-marked {
  color: $bronze-gold;
  font-weight: 600;
}

// ============================================
//  步骤指示器
// ============================================
.step-bar {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 0 12rpx;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  flex-shrink: 0;

  &__dot {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    background: rgba(47, 53, 66, 0.06);
    border: 1.5rpx solid rgba(47, 53, 66, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease;
  }

  &__num {
    font-size: 24rpx;
    font-weight: 700;
    color: $text-muted;
    line-height: 1;
    transition: color 0.4s;
  }

  &__icon {
    font-size: 22rpx;
    font-weight: 700;
    color: $success;
    line-height: 1;
  }

  &__label {
    font-size: 22rpx;
    color: $text-muted;
    font-weight: 400;
    white-space: nowrap;
    transition: color 0.3s;
  }

  // 进行中状态
  &.is-active {
    .step-item__dot {
      background: rgba(184, 152, 118, 0.10);
      border-color: $bronze-gold;
      box-shadow: 0 0 0 6rpx rgba(184, 152, 118, 0.12);
    }
    .step-item__num { color: $bronze-gold; }
    .step-item__label { color: $mineral-gray; font-weight: 500; }
  }

  // 已完成状态
  &.is-done {
    .step-item__dot {
      background: rgba(90, 122, 106, 0.10);
      border-color: $success;
    }
    .step-item__label { color: $success; }
  }
}

.step-connector {
  flex: 1;
  height: 2rpx;
  background: rgba(47, 53, 66, 0.08);
  margin: 0 16rpx;
  margin-bottom: 30rpx;
  border-radius: 2rpx;
  transition: background 0.4s ease;
  position: relative;
  overflow: hidden;

  &.is-active {
    background: $bronze-gold;
  }

  &.is-done::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $success;
  }
}

// ============================================
//  字段组
// ============================================
.field-group {
  margin-bottom: 24rpx;
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

  &--shrink {
    flex: 1;
    margin-right: 16rpx;
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

    &-icon {
      font-size: 30rpx;
      color: $text-muted;
      line-height: 1;
      transition: color 0.2s;
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
  padding: 0 24rpx;
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
//  密码强度
// ============================================
.pwd-strength {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 12rpx;
}

.pwd-track {
  flex: 1;
  height: 6rpx;
  background: rgba(47, 53, 66, 0.06);
  border-radius: 3rpx;
  overflow: hidden;
}

.pwd-fill {
  height: 100%;
  border-radius: 3rpx;
  transition: width 0.3s ease, background 0.3s ease;

  &--1 { background: $warning; }
  &--2 { background: $primary; }
  &--3 { background: $success; }
}

.pwd-hint {
  font-size: 21rpx;
  color: $text-muted;
  flex-shrink: 0;
}

// ============================================
//  确认错误
// ============================================
.confirm-error {
  display: block;
  font-size: 22rpx;
  color: $danger;
  margin-top: 10rpx;
  letter-spacing: 0.2rpx;
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
    letter-spacing: 4rpx;
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
//  返回上一步
// ============================================
.back-step {
  margin-top: 28rpx;
  display: flex;
  justify-content: center;

  &__link {
    font-size: 24rpx;
    color: $text-muted;
    font-weight: 500;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    transition: color 0.2s, background 0.2s;
    letter-spacing: 0.3rpx;

    &:active {
      color: $mineral-gray;
      background: rgba(47, 53, 66, 0.05);
    }
  }
}
</style>