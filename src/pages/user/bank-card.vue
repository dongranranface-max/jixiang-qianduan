<template>
  <view class="page-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">绑定银行卡</text>
      <view class="page-nav__action" />
    </view>

    <scroll-view scroll-y class="page-body">
      <!-- 须知 -->
      <view class="notice-strip">
        <text class="notice-strip__icon">!</text>
        <text class="notice-strip__text">绑定银行卡用于换购商城的资金结算，请务必填写真实信息</text>
      </view>

      <!-- 表单 -->
      <view class="form-section">
        <view class="field-group">
          <text class="field-group__label">持卡人姓名</text>
          <input
            v-model="form.realName"
            class="field-group__input"
            placeholder="请输入持卡人姓名"
            placeholder-class="field-group__placeholder"
          />
        </view>

        <view class="field-group">
          <text class="field-group__label">银行卡号</text>
          <input
            v-model="form.bankCard"
            class="field-group__input"
            type="number"
            placeholder="请输入银行卡号"
            placeholder-class="field-group__placeholder"
            maxlength="23"
          />
        </view>

        <view class="field-group">
          <text class="field-group__label">开户行</text>
          <input
            v-model="form.bankName"
            class="field-group__input"
            placeholder="如：中国工商银行北京分行"
            placeholder-class="field-group__placeholder"
          />
        </view>

        <view class="field-group">
          <text class="field-group__label">预留手机号</text>
          <input
            v-model="form.phone"
            class="field-group__input"
            type="number"
            placeholder="银行预留手机号"
            placeholder-class="field-group__placeholder"
            maxlength="11"
          />
        </view>
      </view>

      <!-- 当前绑定 -->
      <view v-if="hasCard" class="current-card">
        <text class="current-card__label">当前绑定</text>
        <view class="current-card__info">
          <text class="current-card__num">{{ maskCard(bankCard) }}</text>
          <text class="current-card__bank">{{ bankName }}</text>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-btn" :class="{ 'submit-btn--loading': loading }" @click="doSubmit">
        <text class="submit-btn__text">{{ loading ? '绑定中...' : '确认绑定' }}</text>
      </view>

      <view class="bottom-placeholder" :style="{ height: (100 + safeAreaBottom) + 'px' }" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'

const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const loading = ref(false)
const hasCard = ref(false)
const bankCard = ref('')
const bankName = ref('')

const form = ref({
  realName: '',
  bankCard: '',
  bankName: '',
  phone: '',
})

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
  if (checkAuth()) loadCurrentCard()
})

async function loadCurrentCard() {
  try {
    const profile = await userApi.getProfile()
    if (profile?.bankCard) {
      hasCard.value = true
      bankCard.value = profile.bankCard.bankCard || ''
      bankName.value = profile.bankCard.bankName || ''
    }
  } catch {}
}

function goBack() { uni.navigateBack() }

function maskCard(no: string): string {
  if (!no || no.length < 8) return no
  return no.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')
}

async function doSubmit() {
  if (loading.value) return
  if (!form.value.realName) return uni.showToast({ title: '请输入姓名', icon: 'none' })
  if (!form.value.bankCard || form.value.bankCard.replace(/\s/g, '').length < 16) {
    return uni.showToast({ title: '请输入正确卡号', icon: 'none' })
  }
  if (!form.value.bankName) return uni.showToast({ title: '请输入开户行', icon: 'none' })

  loading.value = true
  uni.showLoading({ title: '' })
  try {
    await userApi.bindBankCard({
      bankName: form.value.bankName,
      bankCard: form.value.bankCard.replace(/\s/g, ''),
      realName: form.value.realName,
      phone: form.value.phone,
    })
    uni.showToast({ title: '绑定成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  } catch {
    uni.showToast({ title: '绑定失败', icon: 'none' })
  } finally {
    loading.value = false
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  @include page-bg;
  display: flex;
  flex-direction: column;
}

.status-bar { width: 100%; }

// ========== 导航栏 ==========
.page-nav {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx $spacing-base;
  background: rgba(249, 249, 249, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1rpx solid rgba(20, 20, 20, 0.04);

  &__back, &__action {
    width: 64rpx; height: 64rpx;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(12px);
    border: 1rpx solid rgba(20, 20, 20, 0.06);
    border-radius: 50%;
    font-size: 28rpx; color: $mineral-gray; flex-shrink: 0;
  }

  &__title {
    flex: 1; font-size: 32rpx; font-weight: 700;
    color: $mineral-gray; text-align: center;
  }
}

// ========== 内容区 ==========
.page-body {
  flex: 1;
  padding: $spacing-base;
}

// ========== 须知 ==========
.notice-strip {
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
  padding: $spacing-base;
  background: rgba(192, 69, 74, 0.06);
  border: 1rpx solid rgba(192, 69, 74, 0.15);
  border-radius: $radius-md;
  margin-bottom: $spacing-lg;

  &__icon {
    width: 32rpx; height: 32rpx;
    display: flex; align-items: center; justify-content: center;
    background: $danger;
    border-radius: 50%;
    font-size: 20rpx; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }

  &__text {
    font-size: 24rpx;
    color: $danger;
    line-height: 1.6;
  }
}

// ========== 表单 ==========
.form-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
  margin-bottom: $spacing-lg;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8rpx;

  &__label {
    font-size: 26rpx;
    font-weight: 600;
    color: $text-primary;
  }

  &__input {
    height: 96rpx;
    padding: 0 $spacing-base;
    background: rgba(255, 255, 255, 0.90);
    backdrop-filter: blur(12px);
    border: 1rpx solid rgba(255, 255, 255, 0.60);
    border-radius: $radius-md;
    font-size: 30rpx;
    color: $text-primary;
    box-shadow: $clay-shadow;

    &::placeholder { color: $text-muted; }
  }

  &__placeholder { color: $text-muted; }
}

// ========== 当前绑定 ==========
.current-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1rpx solid rgba(255, 255, 255, 0.60);
  border-radius: $radius-lg;
  padding: $spacing-base $spacing-lg;
  margin-bottom: $spacing-lg;

  &__label {
    font-size: 22rpx;
    color: $text-muted;
    display: block;
    margin-bottom: 8rpx;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__num {
    font-size: 28rpx;
    font-weight: 600;
    color: $text-primary;
    font-variant-numeric: tabular-nums;
  }

  &__bank {
    font-size: 26rpx;
    color: $text-secondary;
  }
}

// ========== 提交按钮 ==========
.submit-btn {
  height: 96rpx;
  background: $accent-gradient;
  border-radius: 48rpx;
  box-shadow: $btn-gold-shadow;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:active { transform: scale(0.98); }

  &--loading {
    opacity: 0.7;
    pointer-events: none;
  }

  &__text {
    font-size: 32rpx;
    font-weight: 700;
    color: #fff;
  }
}

.bottom-placeholder { width: 100%; }
</style>
