<template>
  <view class="page-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
      <view class="page-nav__action" />
    </view>

    <scroll-view scroll-y class="page-body">
      <view class="form-section">
        <view class="field-group">
          <text class="field-group__label">收货人</text>
          <input
            v-model="form.consignee"
            class="field-group__input"
            placeholder="请输入收货人姓名"
            placeholder-class="field-group__placeholder"
            maxlength="20"
          />
        </view>

        <view class="field-group">
          <text class="field-group__label">手机号</text>
          <input
            v-model="form.phone"
            class="field-group__input"
            type="number"
            placeholder="请输入手机号"
            placeholder-class="field-group__placeholder"
            maxlength="11"
          />
        </view>

        <view class="field-group">
          <text class="field-group__label">所在地区</text>
          <picker
            mode="region"
            :value="region"
            @change="onRegionChange"
          >
            <view class="field-group__picker">
              <text :class="region.length ? 'field-group__input' : 'field-group__placeholder'">
                {{ region.length ? region.join(' ') : '请选择省市区' }}
              </text>
              <text class="field-group__arrow">›</text>
            </view>
          </picker>
        </view>

        <view class="field-group">
          <text class="field-group__label">详细地址</text>
          <textarea
            v-model="form.detail"
            class="field-group__textarea"
            placeholder="请输入详细地址"
            placeholder-class="field-group__placeholder"
            maxlength="100"
          />
        </view>

        <view class="default-row" @click="form.isDefault = form.isDefault ? 0 : 1">
          <text class="default-row__label">设为默认地址</text>
          <view class="default-row__toggle" :class="{ active: form.isDefault }">
            <view class="default-row__toggle-dot" />
          </view>
        </view>
      </view>

      <view class="submit-btn" :class="{ 'submit-btn--loading': loading }" @click="doSubmit">
        <text>{{ loading ? '保存中...' : '保存' }}</text>
      </view>

      <view class="bottom-placeholder" :style="{ height: (100 + safeAreaBottom) + 'px' }" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { addressApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'

const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const loading = ref(false)
const addressId = ref('')
const region = ref<string[]>([])
const form = ref({
  consignee: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: 0,
})

const isEdit = computed(() => !!addressId.value)

onLoad((q) => {
  addressId.value = (q?.id as string) || ''
})

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
  if (checkAuth()) {
    if (isEdit.value) loadAddress()
  }
})

async function loadAddress() {
  try {
    const addr = await addressApi.getDetail(addressId.value)
    form.value = {
      consignee: addr.consignee || '',
      phone: addr.phone || '',
      province: addr.province || '',
      city: addr.city || '',
      district: addr.district || '',
      detail: addr.detail || '',
      isDefault: addr.isDefault || 0,
    }
    if (addr.province) region.value = [addr.province, addr.city, addr.district]
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

function onRegionChange(e: { detail: { value: string[] } }) {
  const val = e.detail.value
  region.value = val
  form.value.province = val[0] || ''
  form.value.city = val[1] || ''
  form.value.district = val[2] || ''
}

function goBack() { uni.navigateBack() }

async function doSubmit() {
  if (loading.value) return
  if (!form.value.consignee.trim()) return uni.showToast({ title: '请输入收货人', icon: 'none' })
  if (!form.value.phone.trim() || form.value.phone.length < 11) return uni.showToast({ title: '请输入正确手机号', icon: 'none' })
  if (!form.value.province) return uni.showToast({ title: '请选择所在地区', icon: 'none' })
  if (!form.value.detail.trim()) return uni.showToast({ title: '请输入详细地址', icon: 'none' })

  loading.value = true
  try {
    if (isEdit.value) {
      await addressApi.update(addressId.value, form.value)
    } else {
      await addressApi.create(form.value)
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  } catch (err: { message?: string }) {
    uni.showToast({ title: err?.message || '保存失败', icon: 'none' })
  } finally {
    loading.value = false
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

  &__label {
    font-size: 26rpx;
    font-weight: 600;
    color: $text-primary;
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
    font-size: 30rpx;
  }

  &__arrow {
    font-size: 36rpx;
    color: $text-muted;
  }

  &__textarea {
    min-height: 160rpx;
    padding: $spacing-base;
    background: rgba(47, 53, 66, 0.04);
    border-radius: $radius-md;
    font-size: 30rpx;
    color: $text-primary;
    width: 100%;
    box-sizing: border-box;
    resize: none;
  }

  & + & {
    border-top: 1rpx solid $border-light;
    padding-top: $spacing-base;
    margin-top: $spacing-base;
  }
}

.default-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: $spacing-base;
  margin-top: $spacing-base;
  border-top: 1rpx solid $border-light;

  &__label {
    font-size: 28rpx;
    font-weight: 600;
    color: $text-primary;
  }

  &__toggle {
    width: 88rpx;
    height: 48rpx;
    background: $bg-tertiary;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    padding: 4rpx;
    transition: background 0.25s ease;

    &.active { background: $accent-dark; }

    &-dot {
      width: 40rpx;
      height: 40rpx;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
      transition: transform 0.25s ease;
    }

    &.active &-dot { transform: translateX(40rpx); }
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

  text {
    font-size: 32rpx;
    font-weight: 700;
    color: #fff;
  }

  &:active { transform: scale(0.98); }

  &--loading {
    opacity: 0.7;
    pointer-events: none;
  }
}

.bottom-placeholder { width: 100%; }
</style>
