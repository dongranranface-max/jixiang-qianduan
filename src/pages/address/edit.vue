<template>
  <view class="page-container">
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="page-header">
      <text class="back" @click="goBack">{{ isEdit ? '&lt;' : '×' }}</text>
      <text class="page-title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
    </view>

    <view class="form">
      <view class="form-item">
        <text class="label">收货人</text>
        <input v-model="form.consignee" class="input" placeholder="请输入收货人姓名" />
      </view>
      <view class="form-item">
        <text class="label">手机号</text>
        <input v-model="form.phone" class="input" type="number" placeholder="请输入手机号" />
      </view>
      <view class="form-item">
        <text class="label">省份</text>
        <input v-model="form.province" class="input" placeholder="如：北京市" />
      </view>
      <view class="form-item">
        <text class="label">城市</text>
        <input v-model="form.city" class="input" placeholder="如：朝阳区" />
      </view>
      <view class="form-item">
        <text class="label">区县</text>
        <input v-model="form.district" class="input" placeholder="如：三元桥" />
      </view>
      <view class="form-item">
        <text class="label">详细地址</text>
        <textarea v-model="form.detail" class="textarea" placeholder="请输入详细地址" />
      </view>
      <view class="form-item default-row">
        <text class="label">设为默认地址</text>
        <switch v-model="form.isDefault" color="#00FF00" />
      </view>
    </view>

    <view class="submit-btn" @click="doSubmit">{{ isEdit ? '保存修改' : '确认添加' }}</view>
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const statusBarHeight = ref(20)
const addressId = ref('')
const form = ref({
  consignee: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

const isEdit = computed(() => !!addressId.value)

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20

  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const opts = (current as any).options || {}
  addressId.value = opts.id || ''

  if (addressId.value) {
    loadAddress()
  }
})

async function loadAddress() {
  // const res = await uni.request({ url: `/api/v1/address/${addressId.value}` })
  // const a = res.data
  // form.value = { consignee: a.consignee, phone: a.phone, province: a.province, city: a.city, district: a.district, detail: a.detail, isDefault: a.isDefault === 1 }
}

function goBack() { uni.navigateBack() }

async function doSubmit() {
  if (!form.value.consignee) return uni.showToast({ title: '请输入收货人', icon: 'none' })
  if (!form.value.phone) return uni.showToast({ title: '请输入手机号', icon: 'none' })
  if (!form.value.province || !form.value.city || !form.value.district) return uni.showToast({ title: '请填写完整地址', icon: 'none' })
  if (!form.value.detail) return uni.showToast({ title: '请输入详细地址', icon: 'none' })

  const data = {
    ...form.value,
    isDefault: form.value.isDefault ? 1 : 0,
  }

  uni.showLoading()
  try {
    if (isEdit.value) {
      // await uni.request({ url: `/api/v1/address/${addressId.value}`, method: 'PUT', data })
    } else {
      // await uni.request({ url: '/api/v1/address', method: 'POST', data })
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  } catch {
    uni.showToast({ title: '保存失败', icon: 'none' })
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
  padding: 0 $spacing-lg;
}

.page-header {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  padding: $spacing-base 0;

  .back { font-size: 40rpx; color: $text-primary; }
  .page-title { font-size: 36rpx; font-weight: 700; color: $text-primary; }
}

.form {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  .form-item {
    .label {
      font-size: 26rpx;
      color: $text-secondary;
      display: block;
      margin-bottom: 8rpx;
    }

    .input {
      background: $bg-card;
      border: 1rpx solid $border-color;
      border-radius: $radius-sm;
      padding: 20rpx $spacing-base;
      font-size: 30rpx;
      color: $text-primary;
      width: 100%;
      box-sizing: border-box;
    }

    .textarea {
      background: $bg-card;
      border: 1rpx solid $border-color;
      border-radius: $radius-sm;
      padding: 20rpx $spacing-base;
      font-size: 30rpx;
      color: $text-primary;
      width: 100%;
      box-sizing: border-box;
      min-height: 160rpx;
    }
  }

  .default-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label { margin-bottom: 0; }
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
</style>
