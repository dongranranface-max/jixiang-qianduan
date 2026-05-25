<template>
  <view class="page-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">提交工单</text>
      <view class="page-nav__action" />
    </view>

    <scroll-view scroll-y class="page-body">
      <view class="form-section">
        <view class="field-group">
          <text class="field-group__label">问题类型</text>
          <picker
            mode="selector"
            :range="typeLabels"
            :value="typeIndex"
            @change="onTypeChange"
          >
            <view class="field-group__picker">
              <text class="field-group__picker-val">{{ typeLabels[typeIndex] }}</text>
              <text class="field-group__arrow">›</text>
            </view>
          </picker>
        </view>

        <view class="field-group">
          <text class="field-group__label">标题</text>
          <input
            v-model="title"
            class="field-group__input"
            placeholder="简要描述问题"
            placeholder-class="field-group__placeholder"
            maxlength="50"
          />
        </view>

        <view class="field-group field-group--textarea">
          <text class="field-group__label">详细说明</text>
          <textarea
            v-model="content"
            class="field-group__textarea"
            placeholder="请描述您遇到的问题"
            placeholder-class="field-group__placeholder"
            maxlength="500"
          />
          <text class="field-group__count">{{ content.length }}/500</text>
        </view>

        <view class="field-group">
          <text class="field-group__label">关联订单号 <text class="field-group__optional">（选填）</text></text>
          <input
            v-model="orderNo"
            class="field-group__input"
            placeholder="如有订单请填写"
            placeholder-class="field-group__placeholder"
          />
        </view>
      </view>

      <view class="submit-btn" :class="{ 'submit-btn--loading': submitting }" @click="doSubmit">
        <text>{{ submitting ? '提交中...' : '提交工单' }}</text>
      </view>

      <view class="bottom-placeholder" :style="{ height: (100 + safeAreaBottom) + 'px' }" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ticketApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'

const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const submitting = ref(false)
const typeIndex = ref(7)
const typeValues = [1, 2, 3, 4, 5, 6, 7, 8]
const typeLabels = ['订单问题', '物流咨询', '积分问题', '理财问题', '商品售后', '功能建议', '投诉建议', '其他']
const title = ref('')
const content = ref('')
const orderNo = ref('')

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
  checkAuth()
})

function onTypeChange(e: { detail: { value: number } }) {
  typeIndex.value = Number(e.detail.value)
}

function goBack() { uni.navigateBack() }

async function doSubmit() {
  if (submitting.value) return
  if (!title.value.trim()) return uni.showToast({ title: '请填写标题', icon: 'none' })
  if (!content.value.trim()) return uni.showToast({ title: '请填写问题说明', icon: 'none' })

  submitting.value = true
  try {
    await ticketApi.create({
      type: typeValues[typeIndex.value],
      title: title.value.trim(),
      content: content.value.trim(),
      orderNo: orderNo.value.trim() || undefined,
    })
    uni.showToast({ title: '提交成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  } catch (err: { message?: string }) {
    uni.showToast({ title: err?.message || '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
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

// ========== 表单 ==========
.form-section {
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.60);
  border-radius: $radius-xl;
  box-shadow: $clay-shadow;
  padding: $spacing-base $spacing-lg;
  margin-bottom: $spacing-lg;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8rpx;

  & + & {
    border-top: 1rpx solid $border-light;
    padding-top: $spacing-base;
    margin-top: $spacing-base;
  }

  &--textarea { position: relative; }

  &__label {
    font-size: 26rpx;
    font-weight: 600;
    color: $text-primary;
  }

  &__optional {
    font-size: 22rpx;
    color: $text-muted;
    font-weight: 400;
  }

  &__input {
    height: 96rpx;
    padding: 0 $spacing-base;
    background: rgba(47, 53, 66, 0.04);
    border-radius: $radius-md;
    font-size: 30rpx;
    color: $text-primary;
    width: 100%;
    box-sizing: border-box;
  }

  &__placeholder { color: $text-muted; font-size: 30rpx; }

  &__picker {
    height: 96rpx;
    padding: 0 $spacing-base;
    background: rgba(47, 53, 66, 0.04);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__picker-val {
    font-size: 30rpx;
    color: $text-primary;
  }

  &__arrow {
    font-size: 36rpx;
    color: $text-muted;
  }

  &__textarea {
    min-height: 240rpx;
    padding: $spacing-base;
    background: rgba(47, 53, 66, 0.04);
    border-radius: $radius-md;
    font-size: 30rpx;
    color: $text-primary;
    width: 100%;
    box-sizing: border-box;
    resize: none;
  }

  &__count {
    position: absolute;
    bottom: $spacing-base;
    right: $spacing-base;
    font-size: 22rpx;
    color: $text-muted;
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

  text { font-size: 32rpx; font-weight: 700; color: #fff; }
  &:active { transform: scale(0.98); }
  &--loading { opacity: 0.7; pointer-events: none; }
}

.bottom-placeholder { width: 100%; }
</style>
