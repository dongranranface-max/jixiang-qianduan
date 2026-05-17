<template>
  <view class="page-container">
    <!-- 顶部安全区 -->
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="deco-circle circle-1"></view>
      <view class="deco-circle circle-2"></view>
      <view class="deco-circle circle-3"></view>
    </view>
    
    <!-- Logo 区域 -->
    <view class="logo-section">
      <view class="logo">
        <text class="logo-icon">💎</text>
      </view>
      <text class="app-name">ECO MALL</text>
      <text class="app-slogan">生态积分商城 · 消费即投资</text>
    </view>
    
    <!-- 登录表单 -->
    <view class="login-form">
      <view class="input-group">
        <text class="input-icon">📱</text>
        <input 
          class="input-field" 
          v-model="phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          placeholder-class="input-placeholder"
        />
      </view>
      
      <view class="input-group">
        <text class="input-icon">🔐</text>
        <input 
          class="input-field" 
          v-model="code"
          type="number"
          maxlength="6"
          placeholder="请输入验证码"
          placeholder-class="input-placeholder"
        />
        <view 
          class="code-btn" 
          :class="{ disabled: countdown > 0 }"
          @click="sendCode"
        >
          {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
        </view>
      </view>
      
      <!-- 邀请码 -->
      <view class="input-group" v-if="showInviteCode">
        <text class="input-icon">🎁</text>
        <input 
          class="input-field" 
          v-model="inviteCode"
          type="text"
          maxlength="8"
          placeholder="请输入邀请码（选填）"
          placeholder-class="input-placeholder"
        />
      </view>
      
      <!-- 协议 -->
      <view class="agreement-row">
        <view class="agreement-check" @click="agreeProtocol = !agreeProtocol">
          <text :class="agreeProtocol ? 'check-active' : 'check'">{{ agreeProtocol ? '✓' : '' }}</text>
        </view>
        <view class="agreement-text">
          <text>我已阅读并同意</text>
          <text class="link" @click="showProtocol('user')">《用户协议》</text>
          <text>和</text>
          <text class="link" @click="showProtocol('privacy')">《隐私政策》</text>
        </view>
      </view>
      
      <!-- 登录按钮 -->
      <view class="login-btn" @click="doLogin">
        <text>登录 / 注册</text>
      </view>
      
      <!-- 其他登录方式 -->
      <view class="other-login">
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">其他登录方式</text>
          <view class="divider-line"></view>
        </view>
        
        <view class="other-icons">
          <view class="other-icon" @click="wechatLogin">
            <text class="icon-wechat">💬</text>
            <text class="icon-label">微信</text>
          </view>
          <view class="other-icon" @click="appleLogin">
            <text class="icon-apple">🍎</text>
            <text class="icon-label">Apple</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部提示 -->
    <view class="bottom-tip">
      <text class="tip-text">登录即表示同意 ECO MALL </text>
      <text class="tip-link" @click="showProtocol('user')">用户协议</text>
      <text class="tip-text"> 和 </text>
      <text class="tip-link" @click="showProtocol('privacy')">隐私政策</text>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const statusBarHeight = ref(20)
const phone = ref('')
const code = ref('')
const inviteCode = ref('')
const agreeProtocol = ref(false)
const showInviteCode = ref(true)
const countdown = ref(0)

let countdownTimer: ReturnType<typeof setInterval> | null = null

function sendCode() {
  if (countdown.value > 0) return
  
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      countdown.value = 0
      if (countdownTimer) clearInterval(countdownTimer)
    }
  }, 1000)
  
  uni.showToast({ title: '验证码已发送', icon: 'success' })
}

function doLogin() {
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  if (!code.value || code.value.length !== 6) {
    uni.showToast({ title: '请输入6位验证码', icon: 'none' })
    return
  }
  
  if (!agreeProtocol.value) {
    uni.showToast({ title: '请同意用户协议和隐私政策', icon: 'none' })
    return
  }
  
  // 模拟登录
  uni.showLoading({ title: '登录中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  }, 1500)
}

function wechatLogin() {
  uni.showToast({ title: '微信登录开发中', icon: 'none' })
}

function appleLogin() {
  uni.showToast({ title: 'Apple登录开发中', icon: 'none' })
}

function showProtocol(type: string) {
  uni.showModal({
    title: type === 'user' ? '用户协议' : '隐私政策',
    content: type === 'user' 
      ? '这里是用户协议的内容...'
      : '这里是隐私政策的内容...',
    showCancel: false
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding: 0 $spacing-xl;
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  
  .deco-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
  }
  
  .circle-1 {
    width: 600rpx;
    height: 600rpx;
    background: $primary;
    top: -200rpx;
    right: -200rpx;
  }
  
  .circle-2 {
    width: 400rpx;
    height: 400rpx;
    background: $gold;
    bottom: 100rpx;
    left: -150rpx;
  }
  
  .circle-3 {
    width: 300rpx;
    height: 300rpx;
    background: $profit;
    top: 40%;
    left: -100rpx;
  }
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
  margin-bottom: 80rpx;
  
  .logo {
    width: 160rpx;
    height: 160rpx;
    background: linear-gradient(135deg, $primary, $primary-dark);
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-glow;
    
    .logo-icon {
      font-size: 80rpx;
    }
  }
  
  .app-name {
    font-size: 56rpx;
    font-weight: 700;
    color: $text-primary;
    margin-top: $spacing-base;
    letter-spacing: 4rpx;
  }
  
  .app-slogan {
    font-size: 26rpx;
    color: $text-secondary;
    margin-top: $spacing-sm;
  }
}

.login-form {
  position: relative;
  z-index: 1;
  
  .input-group {
    display: flex;
    align-items: center;
    background: $bg-card;
    backdrop-filter: blur(20px);
    border: 1rpx solid $border-color;
    border-radius: $radius-md;
    padding: 0 $spacing-base;
    margin-bottom: $spacing-base;
    height: 100rpx;
    
    .input-icon {
      font-size: 40rpx;
      margin-right: $spacing-base;
    }
    
    .input-field {
      flex: 1;
      font-size: 30rpx;
      color: #fff;
      
      &::placeholder {
        color: $text-muted;
      }
    }
    
    .code-btn {
      padding: 16rpx 24rpx;
      background: linear-gradient(135deg, $primary, $primary-dark);
      border-radius: $radius-sm;
      font-size: 26rpx;
      color: #fff;
      
      &.disabled {
        background: $bg-card;
        color: $text-muted;
      }
    }
  }
  
  .agreement-row {
    display: flex;
    align-items: flex-start;
    margin: $spacing-base 0;
    
    .agreement-check {
      margin-right: $spacing-sm;
      margin-top: 4rpx;
      
      .check, .check-active {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36rpx;
        height: 36rpx;
        border: 2rpx solid $border-color;
        border-radius: 8rpx;
        font-size: 22rpx;
        color: transparent;
      }
      
      .check-active {
        background: $primary;
        border-color: $primary;
        color: #fff;
      }
    }
    
    .agreement-text {
      flex: 1;
      font-size: 24rpx;
      color: $text-secondary;
      line-height: 1.5;
      
      .link {
        color: $primary;
      }
    }
  }
  
  .login-btn {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, $primary, $primary-dark);
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: 600;
    color: #fff;
    box-shadow: $shadow-glow;
    margin-top: $spacing-lg;
  }
  
  .other-login {
    margin-top: $spacing-2xl;
    
    .divider {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      
      .divider-line {
        flex: 1;
        height: 1rpx;
        background: $border-color;
      }
      
      .divider-text {
        font-size: 24rpx;
        color: $text-muted;
      }
    }
    
    .other-icons {
      display: flex;
      justify-content: center;
      gap: $spacing-2xl;
      margin-top: $spacing-xl;
      
      .other-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-xs;
        
        .icon-wechat, .icon-apple {
          font-size: 64rpx;
        }
        
        .icon-label {
          font-size: 24rpx;
          color: $text-secondary;
        }
      }
    }
  }
}

.bottom-tip {
  position: absolute;
  bottom: 60rpx;
  left: 0;
  right: 0;
  text-align: center;
  
  .tip-text {
    font-size: 22rpx;
    color: $text-muted;
  }
  
  .tip-link {
    font-size: 22rpx;
    color: $primary;
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
