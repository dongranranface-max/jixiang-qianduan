<template>
  <view class="auth-page">

    <!-- ============================================
      移动端顶部品牌横条（含返回按钮）
    ============================================ -->
    <view class="auth-brand-bar">
      <view class="brand-left">
        <view class="back-btn" @click="goBack">
          <text class="back-btn__icon">←</text>
        </view>
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

          <!-- 步骤指示器 -->
          <view class="step-indicator">
            <view class="step-item" :class="{ 'is-active': step === 1, 'is-done': step > 1 }">
              <view class="step-item__circle">
                <text v-if="step > 1" class="step-item__check">✓</text>
                <text v-else>1</text>
              </view>
              <text class="step-item__label">验证手机</text>
            </view>
            <view class="step-connector" :class="{ 'is-done': step > 1 }" />
            <view class="step-item" :class="{ 'is-active': step === 2 }">
              <view class="step-item__circle">2</view>
              <text class="step-item__label">设置密码</text>
            </view>
          </view>

          <!-- ========== Step 1: 验证手机 ========== -->
          <template v-if="step === 1">
            <view class="form-header">
              <text class="form-header__title">短信验证</text>
              <view class="form-header__sub-row">
                <text class="form-header__sub">验证注册手机号后</text>
                <text class="form-header__sub">设置新密码</text>
              </view>
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
                placeholder="注册时的手机号"
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
                placeholder="请输入6位验证码"
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

            <!-- 提交按钮 -->
            <view
              class="submit-btn"
              :class="{ 'is-disabled': !canGoStep2 }"
              @click="goStep2"
            >
              <view class="submit-btn__inner">
                <text class="submit-btn__text">下一步</text>
              </view>
            </view>
          </template>

          <!-- ========== Step 2: 设置密码 ========== -->
          <template v-else>
            <view class="form-header">
              <text class="form-header__title">设置新密码</text>
              <text class="form-header__sub">
                已为 <text class="highlight-phone">{{ maskedPhone }}</text> 验证通过
              </text>
            </view>

            <!-- 新密码 -->
            <view
              class="field-wrap"
              :class="{ 'is-focused': focusState.pwd, 'is-filled': form.password.length >= 6 }"
            >
              <input
                class="field-input"
                v-model="form.password"
                :type="showPwd ? 'text' : 'password'"
                placeholder="新密码（6位以上）"
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

            <!-- 密码强度 -->
            <view v-if="form.password" class="pwd-strength">
              <view class="pwd-track">
                <view
                  class="pwd-fill"
                  :class="`pwd-fill--${pwdLevel}`"
                  :style="{ width: pwdPercent + '%' }"
                />
              </view>
              <text class="pwd-hint">{{ pwdHint }}</text>
            </view>

            <!-- 确认新密码 -->
            <view
              class="field-wrap"
              :class="{ 'is-focused': focusState.confirm, 'is-filled': form.confirm.length >= 6 }"
            >
              <input
                class="field-input"
                v-model="form.confirm"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="再次输入新密码"
                placeholder-class="field-placeholder"
                @focus="focusState.confirm = true"
                @blur="focusState.confirm = false"
              />
              <view class="field-line" />
              <view class="field-glow" />
              <view class="field-toggle" @click="showConfirm = !showConfirm">
                <text class="field-toggle__icon">{{ showConfirm ? '⊙' : '◉' }}</text>
              </view>
            </view>

            <!-- 确认密码错误 -->
            <text v-if="confirmDirty && form.confirm !== form.password" class="confirm-error">
              两次密码不一致
            </text>

            <!-- 提交按钮 -->
            <view
              class="submit-btn"
              :class="{ 'is-disabled': !canSubmit || submitting, 'is-loading': submitting }"
              @click="doReset"
            >
              <view v-if="!submitting" class="submit-btn__inner">
                <text class="submit-btn__text">确认重置</text>
              </view>
              <view v-else class="submit-btn__loading">
                <view class="loading-spinner" />
                <text class="loading-text">提交中...</text>
              </view>
            </view>

            <!-- 返回上一步 -->
            <view class="back-step-row">
              <text class="back-step-link" @click="step = 1">← 返回上一步</text>
            </view>
          </template>

        </view>
      </scroll-view>
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
  if (step.value === 2) {
    step.value = 1
    return
  }
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/auth/login' }) })
}

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

function goStep2() {
  if (!canGoStep2.value) {
    return uni.showToast({ title: '请完成手机号与验证码', icon: 'none' })
  }
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
    await authApi.resetPassword(
      form.value.phone,
      form.value.code.trim(),
      form.value.password
    )
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
  padding: calc(16rpx + env(safe-area-inset-top)) 24rpx 16rpx;
  background: $mineral-gray;
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  &__icon {
    font-size: 32rpx;
    color: #FFFFFF;
    font-weight: 400;
    line-height: 1;
  }
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
  padding: 56rpx 48rpx 80rpx;
  display: flex;
  flex-direction: column;
}

// 页面标题
.form-header {
  margin-bottom: 48rpx;

  &__title {
    display: block;
    font-size: 44rpx;
    font-weight: 700;
    color: $text-primary;
    letter-spacing: 0;
    margin-bottom: 12rpx;
  }

  &__sub-row {
    display: flex;
    flex-direction: column;
    gap: 2rpx;
  }

  &__sub {
    display: block;
    font-size: 25rpx;
    color: $text-muted;
    line-height: 1.5;
  }
}

.highlight-phone {
  color: $accent-dark;
  font-weight: 600;
}

// ============================================
//  步骤指示器
// ============================================
.step-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 48rpx;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;

  &__circle {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(20, 20, 20, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    font-weight: 700;
    color: $text-muted;
    background: $bg-secondary;
    transition: all 0.4s ease;
  }

  &__check {
    font-size: 24rpx;
    color: #FFFFFF;
  }

  &__label {
    font-size: 22rpx;
    color: $text-muted;
    font-weight: 500;
    white-space: nowrap;
  }

  &.is-active__circle {
    border-color: $accent-dark;
    background: $accent-dark;
    color: #FFFFFF;
    box-shadow: 0 4rpx 16rpx rgba(142, 116, 89, 0.35);
  }

  &.is-active &__circle {
    border-color: $accent-dark;
    background: $accent-dark;
    color: #FFFFFF;
    box-shadow: 0 4rpx 16rpx rgba(142, 116, 89, 0.35);
  }

  &.is-active &__label {
    color: $accent-dark;
    font-weight: 600;
  }

  &.is-done &__circle {
    border-color: $success;
    background: $success;
    color: #FFFFFF;
  }

  &.is-done &__label {
    color: $success;
  }
}

.step-connector {
  flex: 1;
  height: 2rpx;
  background: rgba(20, 20, 20, 0.1);
  margin: 0 12rpx;
  margin-bottom: 36rpx;
  transition: background 0.4s ease;

  &.is-done {
    background: $success;
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
//  密码强度
// ============================================
.pwd-strength {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 48rpx;
  margin-top: -16rpx;
}

.pwd-track {
  flex: 1;
  height: 8rpx;
  background: $bg-tertiary;
  border-radius: 9999rpx;
  overflow: hidden;
}

.pwd-fill {
  height: 100%;
  border-radius: 9999rpx;
  transition: width 0.25s ease, background 0.25s ease;

  &--1 { background: $warning; }
  &--2 { background: $primary; }
  &--3 { background: $success; }
}

.pwd-hint {
  font-size: 22rpx;
  color: $text-muted;
  flex-shrink: 0;
}

// ============================================
//  确认密码错误
// ============================================
.confirm-error {
  display: block;
  font-size: 22rpx;
  color: $danger;
  margin-top: -16rpx;
  margin-bottom: 32rpx;
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
//  返回上一步
// ============================================
.back-step-row {
  margin-top: 28rpx;
  text-align: center;
}

.back-step-link {
  font-size: 24rpx;
  color: $text-muted;
  font-weight: 500;
}
</style>