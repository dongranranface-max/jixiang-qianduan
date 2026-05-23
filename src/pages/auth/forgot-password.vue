<template>
  <view class="auth-page">

    <!-- 深色背景装饰 -->
    <view class="auth-bg">
      <view class="bg-glow bg-glow--tl" />
      <view class="bg-glow bg-glow--br" />
    </view>

    <!-- 顶部导航栏 -->
    <view class="auth-nav">
      <view class="auth-nav__left">
        <view class="back-btn" @click="goBack">
          <text class="back-btn__icon">←</text>
        </view>
        <view class="auth-nav__logo">
          <image class="auth-nav__logo-img" src="/static/logo.png" mode="aspectFit" />
        </view>
        <text class="auth-nav__name">集享公社</text>
      </view>
      <text class="auth-nav__link" @click="goLogin">登录</text>
    </view>

    <!-- 表单卡片 -->
    <view class="auth-card">
      <view class="auth-card__inner">

        <!-- ========== Step 1: 验证手机 ========== -->
        <template v-if="step === 1">
          <view class="auth-card__head">
            <text class="auth-card__title">短信验证</text>
            <view class="auth-card__sub-rows">
              <text class="auth-card__sub">验证注册手机号后</text>
              <text class="auth-card__sub">设置新密码</text>
            </view>
          </view>

          <view class="gold-line" />

          <!-- 步骤条 -->
          <view class="step-bar">
            <view class="step-bar__item is-active">
              <view class="step-bar__dot">1</view>
              <text class="step-bar__label">验证手机</text>
            </view>
            <view class="step-bar__line" />
            <view class="step-bar__item">
              <view class="step-bar__dot">2</view>
              <text class="step-bar__label">设置密码</text>
            </view>
          </view>

          <!-- 手机号 -->
          <view class="field-group">
            <text class="field-label">注册手机号</text>
            <view
              class="field"
              :class="{ 'is-focused': focusState.phone, 'is-filled': form.phone.length === 11 }"
            >
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
              <view class="field__bar" />
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
              <view class="field__bar" />
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

          <!-- 提交 -->
          <view
            class="btn-submit"
            :class="{ 'is-disabled': !canGoStep2 }"
            @click="goStep2"
          >
            <view class="btn-submit__inner">
              <text class="btn-submit__text">下一步</text>
            </view>
          </view>
        </template>

        <!-- ========== Step 2: 设置密码 ========== -->
        <template v-else>
          <view class="auth-card__head">
            <text class="auth-card__title">设置新密码</text>
            <text class="auth-card__sub">
              已为 <text class="phone-marked">{{ maskedPhone }}</text> 验证通过
            </text>
          </view>

          <view class="gold-line" />

          <!-- 步骤条 -->
          <view class="step-bar">
            <view class="step-bar__item is-done">
              <view class="step-bar__dot step-bar__dot--done">✓</view>
              <text class="step-bar__label">验证手机</text>
            </view>
            <view class="step-bar__line is-active" />
            <view class="step-bar__item is-active">
              <view class="step-bar__dot">2</view>
              <text class="step-bar__label">设置密码</text>
            </view>
          </view>

          <!-- 新密码 -->
          <view class="field-group">
            <text class="field-label">新密码</text>
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
              <view class="field__bar" />
              <view class="field__eye" @click="showPwd = !showPwd">
                <text class="field__eye-icon">{{ showPwd ? '⊙' : '◉' }}</text>
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
          </view>

          <!-- 确认密码 -->
          <view class="field-group">
            <text class="field-label">确认新密码</text>
            <view
              class="field"
              :class="{ 'is-focused': focusState.confirm, 'is-filled': form.confirm.length >= 6 }"
            >
              <input
                class="field__input"
                v-model="form.confirm"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="再次输入新密码"
                placeholder-class="field__placeholder"
                @focus="focusState.confirm = true"
                @blur="focusState.confirm = false"
              />
              <view class="field__bar" />
              <view class="field__eye" @click="showConfirm = !showConfirm">
                <text class="field__eye-icon">{{ showConfirm ? '⊙' : '◉' }}</text>
              </view>
            </view>
            <text v-if="confirmDirty && form.confirm !== form.password" class="confirm-error">
              两次密码不一致
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

          <view class="back-step">
            <text class="back-step__link" @click="step = 1">← 返回上一步</text>
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
  background: #0F1520;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

// ============================================
//  背景装饰
// ============================================
.auth-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;

  &--tl {
    width: 600rpx;
    height: 600rpx;
    top: -200rpx;
    left: -150rpx;
    background: radial-gradient(circle, rgba(184, 152, 118, 0.12) 0%, transparent 70%);
  }

  &--br {
    width: 500rpx;
    height: 500rpx;
    bottom: -150rpx;
    right: -100rpx;
    background: radial-gradient(circle, rgba(65, 75, 94, 0.4) 0%, transparent 70%);
  }
}

// ============================================
//  导航栏
// ============================================
.auth-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(12rpx + env(safe-area-inset-top)) 32rpx 16rpx;
  position: relative;
  z-index: 10;
  flex-shrink: 0;

  &__left {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  &__logo {
    width: 68rpx;
    height: 68rpx;
    border-radius: 18rpx;
    background: rgba(184, 152, 118, 0.12);
    border: 1rpx solid rgba(184, 152, 118, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;

    &-img {
      width: 46rpx;
      height: 46rpx;
      display: block;
    }
  }

  &__name {
    font-size: 30rpx;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 1rpx;
  }

  &__link {
    font-size: 28rpx;
    color: $bronze-gold;
    font-weight: 600;
    padding: 8rpx 4rpx;
  }
}

// 返回按钮
.back-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &__icon {
    font-size: 32rpx;
    color: #FFFFFF;
    line-height: 1;
  }
}

// ============================================
//  磨砂玻璃卡片
// ============================================
.auth-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24rpx 32rpx 48rpx;
  position: relative;
  z-index: 10;
}

.auth-card__inner {
  width: 100%;
  max-width: 600rpx;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1rpx solid rgba(184, 152, 118, 0.18);
  border-radius: 40rpx;
  padding: 48rpx 44rpx;
  box-sizing: border-box;
}

.auth-card__head {
  margin-bottom: 32rpx;
}

.auth-card__title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0;
  margin-bottom: 12rpx;
  line-height: 1.1;
}

.auth-card__sub-rows {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.auth-card__sub {
  display: block;
  font-size: 25rpx;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
}

.phone-marked {
  color: $bronze-gold;
  font-weight: 600;
}

.gold-line {
  height: 1rpx;
  background: linear-gradient(90deg, rgba(184, 152, 118, 0.5) 0%, rgba(184, 152, 118, 0.1) 70%, transparent 100%);
  margin-bottom: 32rpx;
}

// ============================================
//  步骤指示器
// ============================================
.step-bar {
  display: flex;
  align-items: center;
  margin-bottom: 36rpx;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
  }

  &__dot {
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22rpx;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.03);
    transition: all 0.35s ease;

    &--done {
      background: $success;
      border-color: $success;
      color: #fff;
      font-size: 24rpx;
    }
  }

  &__label {
    font-size: 21rpx;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 500;
    white-space: nowrap;
  }

  &__line {
    flex: 1;
    height: 2rpx;
    background: rgba(255, 255, 255, 0.08);
    margin: 0 16rpx;
    margin-bottom: 32rpx;
    transition: background 0.35s ease;

    &.is-active {
      background: rgba(184, 152, 118, 0.5);
    }
  }

  &__item.is-active &__dot {
    border-color: $bronze-gold;
    background: rgba(184, 152, 118, 0.15);
    color: $bronze-gold;
    box-shadow: 0 0 16rpx rgba(184, 152, 118, 0.3);
  }

  &__item.is-active &__label {
    color: $bronze-gold;
    font-weight: 600;
  }

  &__item.is-done &__label {
    color: $success;
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
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  margin-bottom: 10rpx;
  letter-spacing: 1rpx;
  text-transform: uppercase;
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
    color: #FFFFFF;
    padding: 0;
    box-sizing: border-box;

    &::placeholder { color: rgba(255, 255, 255, 0.2); font-weight: 400; }
    &:focus { outline: none; }
  }

  &__bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2rpx;
    background: rgba(184, 152, 118, 0.2);
    transition: background 0.35s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2rpx;
      background: linear-gradient(90deg, $bronze-gold, $bronze-light);
      border-radius: 2rpx;
      transition: width 0.4s ease;
    }

    .is-focused & {
      background: rgba(184, 152, 118, 0.5);
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
      color: rgba(255, 255, 255, 0.4);
      line-height: 1;
    }
  }
}

// ============================================
//  验证码按钮（独立成行）
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
  border: 1.5rpx solid rgba(184, 152, 118, 0.5);
  border-radius: 30rpx;
  font-size: 23rpx;
  color: $bronze-gold;
  font-weight: 600;
  letter-spacing: 0.5rpx;
  transition: all 0.3s ease;

  &:active {
    background: rgba(184, 152, 118, 0.1);
    transform: scale(0.98);
  }

  &.is-counting {
    color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

// ============================================
//  密码强度
// ============================================
.pwd-strength {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 10rpx;
}

.pwd-track {
  flex: 1;
  height: 6rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3rpx;
  overflow: hidden;
}

.pwd-fill {
  height: 100%;
  border-radius: 3rpx;
  transition: width 0.25s ease, background 0.25s ease;

  &--1 { background: $warning; }
  &--2 { background: $primary; }
  &--3 { background: $success; }
}

.pwd-hint {
  font-size: 21rpx;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

// ============================================
//  确认错误
// ============================================
.confirm-error {
  display: block;
  font-size: 22rpx;
  color: $danger;
  margin-top: 8rpx;
}

// ============================================
//  提交按钮
// ============================================
.btn-submit {
  height: 104rpx;
  border-radius: 52rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8rpx 32rpx rgba(184, 152, 118, 0.25), inset 0 1rpx 0 rgba(255,255,255,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:active {
    transform: scale(0.985);
    box-shadow: 0 4rpx 16rpx rgba(184, 152, 118, 0.2);
  }

  &.is-disabled {
    opacity: 0.4;
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
    background: linear-gradient(135deg, $bronze-gold 0%, $bronze-dark 100%);
    border-radius: inherit;
  }

  &__text {
    font-size: 30rpx;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 4rpx;
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

// ============================================
//  返回上一步
// ============================================
.back-step {
  margin-top: 24rpx;
  text-align: center;

  &__link {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 500;
  }
}
</style>