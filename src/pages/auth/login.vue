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

        <!-- 分割线 -->
        <view class="divider-row">
          <view class="divider" />
          <text class="divider__text">其他登录方式</text>
          <view class="divider" />
        </view>

        <!-- 第三方登录 -->
        <view class="third-party">
          <view class="third-party__item" @click="thirdPartyLogin('wechat')">
            <view class="third-party__icon">
              <svg class="third-party__svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.667c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 6.847c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.108.24-.243 0-.06-.022-.12-.038-.173l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.59a5.794 5.794 0 0 0-.406-.056zm-1.834 2.994c.536 0 .97.44.97.983a.976.976 0 0 1-.97.983.976.976 0 0 1-.97-.983c0-.542.434-.983.97-.983zm4.857 0c.536 0 .97.44.97.983a.976.976 0 0 1-.97.983.976.976 0 0 1-.97-.983c0-.542.434-.983.97-.983z" fill="#07C160"/>
              </svg>
            </view>
            <text class="third-party__label">微信</text>
          </view>
          <view class="third-party__item" @click="thirdPartyLogin('alipay')">
            <view class="third-party__icon">
              <svg class="third-party__svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.03 2 11c0 2.76 1.36 5.22 3.49 6.87L4.23 21.5a.5.5 0 0 0 .61.61l3.63-1.26C9.78 21.72 10.86 22 12 22c5.52 0 10-4.03 10-9S17.52 2 12 2zm.32 13.49c-.47.2-.98.32-1.52.32-.38 0-.75-.06-1.1-.16L9.5 16H8.4c-.6 0-1.1-.4-1.25-.96l-.5-1.9-1.6-6.1A7.94 7.94 0 0 1 12 4.5c.38 0 .75.04 1.1.1l2.2 8.35c.11.43.5.73.95.73h1.1c.42 0 .8-.25.96-.64l.52-1.33a8.02 8.02 0 0 1-.05-.28z" fill="#1677FF"/>
              </svg>
            </view>
            <text class="third-party__label">支付宝</text>
          </view>
          <view class="third-party__item" @click="thirdPartyLogin('apple')">
            <view class="third-party__icon">
              <svg class="third-party__svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 12.54c-.02-1.52 1.23-2.27 1.29-2.3-.7-1.03-1.8-1.17-2.18-1.19-1.03-.1-2 .6-2.52.6-.54 0-1.37-.58-2.26-.56C10.5 8.77 7.89 10.6 7.89 14.18c0 4.37 3.55 6.73 8.68 6.73 4.1 0 6.9-2.6 6.9-6.4-.08-.88-1.03-2.21-2.52-2.97zM14.82 4.36c.9-1.12 1.5-2.67 1.33-4.22-1.29.05-2.85.86-3.77 1.96-.8.93-1.5 2.42-1.32 3.84 1.45.11 2.94-.82 3.76-1.58z" fill="currentColor"/>
              </svg>
            </view>
            <text class="third-party__label">Apple</text>
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

function thirdPartyLogin(type: 'wechat' | 'alipay' | 'apple') {
  uni.showToast({ title: '暂未开放', icon: 'none' })
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
  margin-top: 32rpx;
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

// ============================================
//  分割线
// ============================================
.divider-row {
  display: flex;
  align-items: center;
  margin: 28rpx 0 24rpx;
  gap: 20rpx;
}

.divider {
  flex: 1;
  height: 1rpx;
  background: rgba(47, 53, 66, 0.08);
  border-radius: 1rpx;

  &__text {
    font-size: 21rpx;
    color: $text-muted;
    font-weight: 400;
    white-space: nowrap;
    letter-spacing: 0.4rpx;
  }
}

// ============================================
//  第三方登录
// ============================================
.third-party {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 52rpx;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
    transition: transform 0.2s ease;

    &:active { transform: scale(0.92); }
  }

  &__icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.80);
    border: 1rpx solid rgba(47, 53, 66, 0.07);
    box-shadow: 0 4rpx 20rpx rgba(47, 53, 66, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  &__svg {
    width: 40rpx;
    height: 40rpx;
    display: block;
  }

  &__label {
    font-size: 20rpx;
    color: $text-muted;
    font-weight: 400;
    letter-spacing: 0.3rpx;
  }
}
</style>