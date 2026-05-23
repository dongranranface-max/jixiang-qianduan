<template>
  <view class="auth-page">

    <!-- ============================================
      深色毛玻璃背景
    ============================================ -->
    <view class="auth-bg">
      <!-- 渐变光晕装饰 -->
      <view class="bg-glow bg-glow--tl" />
      <view class="bg-glow bg-glow--br" />
    </view>

    <!-- ============================================
      顶部导航栏
    ============================================ -->
    <view class="auth-nav">
      <view class="auth-nav__brand">
        <view class="auth-nav__logo">
          <image class="auth-nav__logo-img" src="/static/logo.png" mode="aspectFit" />
        </view>
        <text class="auth-nav__name">集享公社</text>
      </view>
      <text class="auth-nav__link" @click="goRegister">注册</text>
    </view>

    <!-- ============================================
      表单卡片（磨砂毛玻璃）
    ============================================ -->
    <view class="auth-card">
      <view class="auth-card__inner">

        <!-- 标题 -->
        <view class="auth-card__head">
          <text class="auth-card__title">欢迎回来</text>
          <text class="auth-card__sub">请输入您的账号信息</text>
        </view>

        <!-- 分隔线 -->
        <view class="gold-line" />

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
              @focus="onFocus('phone')"
              @blur="onBlur('phone')"
            />
            <view class="field__bar" />
          </view>
        </view>

        <!-- 密码 -->
        <view class="field-group">
          <text class="field-label">登录密码</text>
          <view
            class="field"
            :class="{ 'is-focused': focusState.pwd, 'is-filled': form.password.length >= 6 }"
          >
            <input
              class="field__input"
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              placeholder="请输入登录密码"
              placeholder-class="field__placeholder"
              @focus="onFocus('pwd')"
              @blur="onBlur('pwd')"
            />
            <view class="field__bar" />
            <view class="field__eye" @click="showPwd = !showPwd">
              <text class="field__eye-icon">{{ showPwd ? '⊙' : '◉' }}</text>
            </view>
          </view>
        </view>

        <!-- 忘记密码 -->
        <view class="row row--end">
          <text class="link" @click="goForgot">忘记密码？</text>
        </view>

        <!-- 提交按钮 -->
        <view
          class="btn-submit"
          :class="{ 'is-loading': submitting }"
          @click="doLogin"
        >
          <view v-if="!submitting" class="btn-submit__inner">
            <text class="btn-submit__text">登 录</text>
          </view>
          <view v-else class="btn-submit__loading">
            <view class="btn-submit__spinner" />
            <text class="btn-submit__loading-text">登录中...</text>
          </view>
        </view>

      </view>
    </view>

    <!-- ============================================
      底部隐私
    ============================================ -->
    <view class="auth-footer">
      <text class="auth-footer__text">
        登录即表示同意
        <text class="auth-footer__link">《用户协议》</text>
        和
        <text class="auth-footer__link">《隐私政策》</text>
      </text>
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

// ============================================
//  全屏深色页面
// ============================================
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
//  深色背景装饰
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
//  顶部导航栏
// ============================================
.auth-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(16rpx + env(safe-area-inset-top)) 40rpx 20rpx;
  position: relative;
  z-index: 10;
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
    background: rgba(184, 152, 118, 0.12);
    border: 1rpx solid rgba(184, 152, 118, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;

    &-img {
      width: 48rpx;
      height: 48rpx;
      display: block;
    }
  }

  &__name {
    font-size: 32rpx;
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

// ============================================
//  磨砂玻璃表单卡片
// ============================================
.auth-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48rpx 32rpx;
  position: relative;
  z-index: 10;

  &__inner {
    width: 100%;
    max-width: 600rpx;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1rpx solid rgba(184, 152, 118, 0.18);
    border-radius: 40rpx;
    padding: 56rpx 48rpx;
    box-sizing: border-box;
  }

  &__head {
    margin-bottom: 40rpx;
  }

  &__title {
    display: block;
    font-size: 52rpx;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 0;
    margin-bottom: 10rpx;
    line-height: 1.1;
  }

  &__sub {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 400;
    line-height: 1.4;
  }
}

// 铜金分隔线
.gold-line {
  height: 1rpx;
  background: linear-gradient(90deg, rgba(184, 152, 118, 0.5) 0%, rgba(184, 152, 118, 0.1) 70%, transparent 100%);
  margin-bottom: 40rpx;
}

// ============================================
//  字段组
// ============================================
.field-group {
  margin-bottom: 32rpx;
}

.field-label {
  display: block;
  font-size: 23rpx;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  margin-bottom: 12rpx;
  letter-spacing: 1rpx;
  text-transform: uppercase;
}

.field {
  position: relative;

  &__input {
    width: 100%;
    height: 88rpx;
    background: transparent;
    border: none;
    border-radius: 0;
    font-size: 30rpx;
    font-weight: 500;
    color: #FFFFFF;
    padding: 0;
    box-sizing: border-box;

    &::placeholder { color: rgba(255, 255, 255, 0.25); font-weight: 400; }
    &:focus { outline: none; }
  }

  // 底部铜金条
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

  // 眼睛
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
//  操作链接
// ============================================
.row {
  display: flex;
  margin-bottom: 36rpx;

  &--end { justify-content: flex-end; }
  &--between { justify-content: space-between; }
}

.link {
  font-size: 24rpx;
  color: $bronze-gold;
  font-weight: 500;
}

// ============================================
//  提交按钮（铜金渐变）
// ============================================
.btn-submit {
  height: 104rpx;
  border-radius: 52rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8rpx 32rpx rgba(184, 152, 118, 0.25), inset 0 1rpx 0 rgba(255,255,255,0.1);

  &:active {
    transform: scale(0.985);
    box-shadow: 0 4rpx 16rpx rgba(184, 152, 118, 0.2);
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

// ============================================
//  底部协议
// ============================================
.auth-footer {
  padding: 24rpx 40rpx 48rpx;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
  flex-shrink: 0;

  &__text {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.3);
    text-align: center;
    line-height: 1.6;
  }

  &__link {
    color: $bronze-gold;
    font-weight: 500;
    opacity: 0.8;
  }
}
</style>