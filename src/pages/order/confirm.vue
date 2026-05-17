<template>
  <view class="page-container">
    <!-- 顶部安全区 -->
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-back" @click="goBack">←</text>
      <text class="nav-title">确认订单</text>
      <text class="nav-placeholder"></text>
    </view>
    
    <!-- 收货地址 -->
    <view class="address-section" @click="selectAddress">
      <view class="address-icon">📍</view>
      <view class="address-info" v-if="address">
        <view class="address-top">
          <text class="address-name">{{ address.name }}</text>
          <text class="address-phone">{{ address.phone }}</text>
          <view class="address-tag" v-if="address.isDefault">默认</view>
        </view>
        <text class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</text>
      </view>
      <view class="address-empty" v-else>
        <text>请添加收货地址</text>
      </view>
      <text class="address-arrow">></text>
    </view>
    
    <!-- 商品信息 -->
    <view class="order-items">
      <view class="order-item" v-for="item in orderItems" :key="item.id">
        <image class="item-image" :src="item.image" mode="aspectFill" />
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <view class="item-tags">
            <text class="tag tag-purple" v-if="item.mall === 'exchange'">换购</text>
            <text class="tag tag-green" v-if="item.mallType === 'flash'">限时</text>
          </view>
          <view class="item-bottom">
            <text class="item-price">¥{{ item.price }}</text>
            <text class="item-quantity">×{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 支付方式 -->
    <view class="payment-section">
      <view class="section-title">支付方式</view>
      <view class="payment-list">
        <view 
          class="payment-item" 
          :class="{ active: paymentMethod === 'wechat' }"
          @click="paymentMethod = 'wechat'"
        >
          <text class="payment-icon">💬</text>
          <text class="payment-name">微信支付</text>
          <text :class="paymentMethod === 'wechat' ? 'radio-checked' : 'radio'">✓</text>
        </view>
        <view 
          class="payment-item" 
          :class="{ active: paymentMethod === 'alipay' }"
          @click="paymentMethod = 'alipay'"
        >
          <text class="payment-icon">💙</text>
          <text class="payment-name">支付宝</text>
          <text :class="paymentMethod === 'alipay' ? 'radio-checked' : 'radio'">✓</text>
        </view>
      </view>
    </view>
    
    <!-- 订单信息 -->
    <view class="order-info-section">
      <view class="info-row">
        <text class="info-label">商品金额</text>
        <text class="info-value">¥{{ goodsAmount }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">运费</text>
        <text class="info-value info-free">免运费</text>
      </view>
      <view class="info-row">
        <text class="info-label">积分抵扣</text>
        <text class="info-value info-points">-{{ pointsDeduction }}积分</text>
      </view>
    </view>
    
    <!-- 积分使用提示 -->
    <view class="points-tip" v-if="availablePoints > 0">
      <view class="tip-header">
        <text class="tip-icon">💰</text>
        <text class="tip-title">可用 {{ availablePoints }} 积分抵扣 ¥{{ (availablePoints / 100).toFixed(2) }}</text>
        <switch 
          :checked="usePoints" 
          @change="usePoints = !usePoints"
          color="#8B5CF6"
        />
      </view>
      <text class="tip-desc" v-if="usePoints">
        使用 {{ pointsToUse }} 积分抵扣 ¥{{ (pointsToUse / 100).toFixed(2) }}
      </text>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="total-info">
        <text class="total-label">合计:</text>
        <text class="total-price">¥{{ actualAmount }}</text>
        <text class="total-points" v-if="earnPoints > 0">+{{ earnPoints }}积分</text>
      </view>
      <view class="submit-btn" @click="submitOrder">
        <text>提交订单</text>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const statusBarHeight = ref(20)
const paymentMethod = ref('wechat')
const usePoints = ref(true)

const address = ref({
  name: '张三',
  phone: '138****8888',
  province: '广东省',
  city: '深圳市',
  district: '南山区',
  detail: '科技园路100号A栋1001室',
  isDefault: true
})

const orderItems = ref([
  { id: 1, name: 'iPhone 15 Pro Max 256GB 深空黑', price: 9999, quantity: 1, image: 'https://picsum.photos/200/200?random=120', mall: 'consume' },
  { id: 2, name: 'AirPods Pro 2 代', price: 1899, quantity: 1, image: 'https://picsum.photos/200/200?random=121', mall: 'consume', mallType: 'flash' }
])

const availablePoints = ref(5000)

const goodsAmount = computed(() => {
  return orderItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
})

const pointsToUse = computed(() => {
  return Math.min(availablePoints.value, Math.floor(parseFloat(goodsAmount.value) * 100))
})

const pointsDeduction = computed(() => {
  return usePoints.value ? pointsToUse.value : 0
})

const actualAmount = computed(() => {
  const amount = parseFloat(goodsAmount.value) - pointsToUse.value / 100
  return Math.max(0, amount).toFixed(2)
})

const earnPoints = computed(() => {
  return orderItems.value
    .filter(i => i.mall === 'consume')
    .reduce((sum, i) => sum + Math.floor(i.price * i.quantity * 0.05), 0)
})

function goBack() {
  uni.navigateBack()
}

function selectAddress() {
  uni.showToast({ title: '选择收货地址', icon: 'none' })
}

function submitOrder() {
  if (!address.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    return
  }
  
  uni.showModal({
    title: '确认支付',
    content: `确认支付 ¥${actualAmount.value}？`,
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '支付中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ title: '支付成功', icon: 'success' })
          setTimeout(() => {
            uni.redirectTo({ url: '/pages/order/list' })
          }, 1500)
        }, 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding: 0 $spacing-lg;
  padding-bottom: 140rpx;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  
  .nav-back {
    font-size: 40rpx;
    color: #fff;
  }
  
  .nav-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #fff;
  }
  
  .nav-placeholder {
    width: 60rpx;
  }
}

.address-section {
  display: flex;
  align-items: center;
  background: $bg-card;
  backdrop-filter: blur(20px);
  border-radius: $radius-md;
  padding: $spacing-lg;
  margin-bottom: $spacing-base;
  
  .address-icon {
    font-size: 48rpx;
    margin-right: $spacing-base;
  }
  
  .address-info {
    flex: 1;
    
    .address-top {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: 8rpx;
      
      .address-name {
        font-size: 30rpx;
        font-weight: 600;
        color: $text-primary;
      }
      
      .address-phone {
        font-size: 28rpx;
        color: $text-secondary;
      }
      
      .address-tag {
        padding: 4rpx 12rpx;
        background: $primary;
        color: #fff;
        font-size: 20rpx;
        border-radius: 6rpx;
      }
    }
    
    .address-detail {
      font-size: 26rpx;
      color: $text-secondary;
    }
  }
  
  .address-empty {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: $text-muted;
  }
  
  .address-arrow {
    font-size: 28rpx;
    color: $text-muted;
  }
}

.order-items {
  margin-bottom: $spacing-base;
  
  .order-item {
    display: flex;
    background: $bg-card;
    backdrop-filter: blur(20px);
    border-radius: $radius-md;
    padding: $spacing-base;
    margin-bottom: $spacing-sm;
    
    .item-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: $radius-sm;
      flex-shrink: 0;
    }
    
    .item-info {
      flex: 1;
      margin-left: $spacing-base;
      display: flex;
      flex-direction: column;
      
      .item-name {
        font-size: 28rpx;
        color: $text-primary;
        @include line-clamp(2);
        margin-bottom: $spacing-xs;
      }
      
      .item-tags {
        margin-bottom: $spacing-sm;
        
        .tag {
          font-size: 18rpx;
          padding: 2rpx 12rpx;
          border-radius: 6rpx;
          margin-right: $spacing-xs;
        }
      }
      
      .item-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .item-price {
          font-size: 30rpx;
          font-weight: 700;
          color: $primary;
        }
        
        .item-quantity {
          font-size: 26rpx;
          color: $text-secondary;
        }
      }
    }
  }
}

.payment-section {
  margin-bottom: $spacing-base;
  
  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-base;
  }
  
  .payment-list {
    .payment-item {
      display: flex;
      align-items: center;
      background: $bg-card;
      backdrop-filter: blur(20px);
      border-radius: $radius-md;
      padding: $spacing-base;
      margin-bottom: $spacing-sm;
      
      &.active {
        border: 2rpx solid $primary;
      }
      
      .payment-icon {
        font-size: 48rpx;
        margin-right: $spacing-base;
      }
      
      .payment-name {
        flex: 1;
        font-size: 28rpx;
        color: $text-primary;
      }
      
      .radio, .radio-checked {
        width: 40rpx;
        height: 40rpx;
        border: 2rpx solid $border-color;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: transparent;
      }
      
      .radio-checked {
        background: $primary;
        border-color: $primary;
        color: #fff;
      }
    }
  }
}

.order-info-section {
  background: $bg-card;
  backdrop-filter: blur(20px);
  border-radius: $radius-md;
  padding: $spacing-base;
  margin-bottom: $spacing-base;
  
  .info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-sm 0;
    
    .info-label {
      font-size: 28rpx;
      color: $text-secondary;
    }
    
    .info-value {
      font-size: 28rpx;
      color: $text-primary;
      
      &.info-free {
        color: $profit;
      }
      
      &.info-points {
        color: $gold;
      }
    }
  }
}

.points-tip {
  background: linear-gradient(135deg, rgba($gold, 0.15), rgba($gold, 0.05));
  border: 1rpx solid rgba($gold, 0.3);
  border-radius: $radius-md;
  padding: $spacing-base;
  
  .tip-header {
    display: flex;
    align-items: center;
    
    .tip-icon {
      font-size: 32rpx;
    }
    
    .tip-title {
      flex: 1;
      font-size: 28rpx;
      color: $gold;
      margin-left: $spacing-sm;
    }
  }
  
  .tip-desc {
    font-size: 24rpx;
    color: $text-secondary;
    margin-top: $spacing-sm;
    margin-left: 56rpx;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(30px);
  border-top: 1rpx solid $border-color;
  
  .total-info {
    .total-label {
      font-size: 26rpx;
      color: $text-secondary;
    }
    
    .total-price {
      font-size: 44rpx;
      font-weight: 700;
      color: $primary;
      margin-left: $spacing-xs;
    }
    
    .total-points {
      font-size: 22rpx;
      color: $gold;
      margin-left: $spacing-sm;
    }
  }
  
  .submit-btn {
    background: linear-gradient(135deg, $primary, $primary-dark);
    color: #fff;
    padding: 24rpx 64rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
