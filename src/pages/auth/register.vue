<template>
  <view class="page-container">
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="page-header">
      <text class="close" @click="goBack">×</text>
      <text class="page-title">注册</text>
    </view>

    <view class="logo-area">
      <text class="logo">🏪</text>
      <text class="app-name">ECO积分商城</text>
      <text class="app-slogan">消费即投资 · 积分变财富</text>
    </view>

    <view class="form">
      <view class="form-item">
        <input v-model="form.phone" class="input" type="number" placeholder="请输入手机号" maxlength="11" />
      </view>
      <view class="form-item code-row">
        <input v-model="form.code" class="input" type="number" placeholder="请输入验证码" maxlength="6" />
        <view :class="['code-btn', { counting: counting }]" @click="sendCode">
          {{ counting ? `${countdown}s` : '发送验证码' }}
        </view>
      </view>
      <view class="form-item">
        <input v-model="form.password" class="input" password placeholder="设置密码（6位以上）" />
      </view>
      <view class="form-item">
        <input v-model="form.inviteCode" class="input" placeholder="邀请码（选填）" />
      </view>
    </view>

    <view class="submit-btn" @click="doRegister">立即注册</view>

    <view class="agreement">
      注册即表示同意
      <text class="link">《用户协议》</text>
      和
      <text class="link">《隐私政策》</text>
    </view>

    <view class="login-link">
      已有账号？
      <text @click="goLogin">立即登录</text>
    </view>

    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const statusBarHeight = ref(20)
const counting = ref(false)
const countdown = ref(60)
let timer: any = null

const form = ref({
  phone: '',
  code: '',
  password: '',
  inviteCode: '',
})

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20

  // 如果从邀请链接进来，自动填入邀请码
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const opts = (current as any).options || {}
  if (opts.code) {
    form.value.inviteCode = opts.code
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function goBack() { uni.navigateBack() }
function goLogin() { uni.navigateTo({ url: '/pages/auth/login' }) }

async function sendCode() {
  if (counting.value) return
  if (!form.value.phone || form.value.phone.length !== 11) {
    return uni.showToast({ title: '请输入正确手机号', icon: 'none' })
  }
  // await uni.request({ url: '/api/v1/auth/send-code', method: 'POST', data: { phone: form.value.phone } })
  uni.showToast({ title: '验证码已发送', icon: 'success' })
  counting.value = true
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      counting.value = false
      clearInterval(timer)
    }
  }, 1000)
}

async function doRegister() {
  if (!form.value.phone || form.value.phone.length !== 11) return uni.showToast({ title: '请输入手机号', icon: 'none' })
  if (!form.value.code) return uni.showToast({ title: '请输入验证码', icon: 'none' })
  if (!form.value.password || form.value.password.length < 6) return uni.showToast({ title: '密码至少6位', icon: 'none' })

  uni.showLoading()
  try {
    // const res = await uni.request({
    //   url: '/api/v1/auth/register',
    //   method: 'POST',
    //   data: form.value
    // })
    // uni.setStorageSync('token', res.data.token)
    // uni.setStorageSync('userId', res.data.user.id)
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 1500)
  } catch (e: any) {
    uni.showToast({ title: e.message || '注册失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding: 0 $spacing-xl;
}

.page-header {
  display: flex;
  align-items: center;
  padding: $spacing-base 0;

  .close {
    font-size: 60rpx;
    color: $text-secondary;
    line-height: 1;
  }

  .page-title {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: 700;
    color: $text-primary;
    margin-right: 60rpx;
  }
}

.logo-area {
  text-align: center;
  padding: $spacing-xl 0;

  .logo { font-size: 120rpx; display: block; }
  .app-name { font-size: 40rpx; font-weight: 700; color: $primary; display: block; margin-top: 8rpx; }
  .app-slogan { font-size: 26rpx; color: $text-muted; display: block; margin-top: 8rpx; }
}

.form {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;

  .form-item {
    &.code-row {
      display: flex;
      gap: $spacing-base;
      align-items: center;

      .input { flex: 1; }
    }
  }

  .input {
    background: $bg-card;
    border: 1rpx solid $border-color;
    border-radius: $radius-sm;
    padding: 24rpx $spacing-base;
    font-size: 30rpx;
    color: $text-primary;
  }

  .code-btn {
    background: $primary;
    color: #000;
    font-size: 24rpx;
    font-weight: 600;
    padding: 24rpx 24rpx;
    border-radius: $radius-sm;
    white-space: nowrap;

    &.counting {
      background: $bg-secondary;
      color: $text-muted;
    }
  }
}

.submit-btn {
  background: $primary;
  color: #000;
  font-size: 32rpx;
  font-weight: 700;
  text-align: center;
  padding: $spacing-base;
  border-radius: 50rpx;
  margin: $spacing-xl 0;
}

.agreement {
  text-align: center;
  font-size: 24rpx;
  color: $text-muted;

  .link { color: $primary; }
}

.login-link {
  text-align: center;
  font-size: 28rpx;
  color: $text-muted;
  margin-top: $spacing-lg;
  padding-bottom: $spacing-xl;

  text { color: $primary; }
}
</style>
