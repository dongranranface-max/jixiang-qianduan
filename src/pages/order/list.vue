<template>
  <view class="page-container">
    <!-- 顶部安全区 -->
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-back" @click="goBack">←</text>
      <text class="nav-title">我的订单</text>
      <text class="nav-placeholder"></text>
    </view>
    
    <!-- 状态 Tab -->
    <view class="status-tabs">
      <view 
        class="status-tab" 
        :class="{ active: currentStatus === '' }"
        @click="switchStatus('')"
      >
        全部
      </view>
      <view 
        class="status-tab" 
        :class="{ active: currentStatus === 'pending' }"
        @click="switchStatus('pending')"
      >
        待付款
        <view class="tab-badge" v-if="statusCounts.pending > 0">{{ statusCounts.pending }}</view>
      </view>
      <view 
        class="status-tab" 
        :class="{ active: currentStatus === 'paid' }"
        @click="switchStatus('paid')"
      >
        待发货
      </view>
      <view 
        class="status-tab" 
        :class="{ active: currentStatus === 'shipped' }"
        @click="switchStatus('shipped')"
      >
        待收货
        <view class="tab-badge" v-if="statusCounts.shipped > 0">{{ statusCounts.shipped }}</view>
      </view>
      <view 
        class="status-tab" 
        :class="{ active: currentStatus === 'completed' }"
        @click="switchStatus('completed')"
      >
        已完成
      </view>
    </view>
    
    <!-- 订单列表 -->
    <scroll-view class="order-list" scroll-y>
      <view 
        class="order-card" 
        v-for="order in filteredOrders" 
        :key="order.id"
        @click="goOrderDetail(order.id)"
      >
        <view class="order-header">
          <text class="order-no">订单号: {{ order.no }}</text>
          <text class="order-status" :class="'status-' + order.status">
            {{ getStatusText(order.status) }}
          </text>
        </view>
        
        <view class="order-items">
          <view class="order-item" v-for="item in order.items" :key="item.id">
            <image class="item-image" :src="item.image" mode="aspectFill" />
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-quantity">×{{ item.quantity }}</text>
            </view>
            <text class="item-price">¥{{ item.price }}</text>
          </view>
        </view>
        
        <view class="order-footer">
          <view class="order-info">
            <text class="order-time">{{ order.createTime }}</text>
            <text class="order-total">共{{ order.totalQuantity }}件商品</text>
          </view>
          <view class="order-amount">
            <text class="amount-label">实付款:</text>
            <text class="amount-value">¥{{ order.amount }}</text>
            <text class="amount-points" v-if="order.points > 0">+{{ order.points }}积分</text>
          </view>
        </view>
        
        <view class="order-actions" @click.stop>
          <!-- 待付款 -->
          <template v-if="order.status === 'pending'">
            <view class="action-btn btn-cancel" @click="cancelOrder(order)">取消</view>
            <view class="action-btn btn-pay" @click="payOrder(order)">去支付</view>
          </template>
          
          <!-- 待发货 -->
          <template v-else-if="order.status === 'paid'">
            <view class="action-btn btn-remind" @click="remindShip(order)">提醒发货</view>
          </template>
          
          <!-- 待收货 -->
          <template v-else-if="order.status === 'shipped'">
            <view class="action-btn btn-logistics" @click="viewLogistics(order)">查看物流</view>
            <view class="action-btn btn-confirm" @click="confirmReceive(order)">确认收货</view>
          </template>
          
          <!-- 已完成 -->
          <template v-else-if="order.status === 'completed'">
            <view class="action-btn btn-review" @click="reviewOrder(order)">去评价</view>
            <view class="action-btn btn-rebuy" @click="rebuyOrder(order)">再次购买</view>
          </template>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredOrders.length === 0">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无订单</text>
      </view>
      
      <view class="safe-area-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const statusBarHeight = ref(20)
const currentStatus = ref('')

const statusCounts = ref({
  pending: 2,
  shipped: 1,
  paid: 1,
  completed: 0
})

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: number
  no: string
  status: string
  items: OrderItem[]
  amount: number
  points: number
  totalQuantity: number
  createTime: string
}

const orders = ref<Order[]>([
  {
    id: 1,
    no: 'DD202605150001',
    status: 'pending',
    items: [
      { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 9999, quantity: 1, image: 'https://picsum.photos/200/200?random=130' }
    ],
    amount: 9999,
    points: 500,
    totalQuantity: 1,
    createTime: '2026-05-15 14:30'
  },
  {
    id: 2,
    no: 'DD202605140002',
    status: 'shipped',
    items: [
      { id: 2, name: 'AirPods Pro 2 代', price: 1899, quantity: 1, image: 'https://picsum.photos/200/200?random=131' }
    ],
    amount: 1899,
    points: 95,
    totalQuantity: 1,
    createTime: '2026-05-14 10:20'
  },
  {
    id: 3,
    no: 'DD202605130003',
    status: 'completed',
    items: [
      { id: 3, name: '小米手环 8 Pro', price: 399, quantity: 2, image: 'https://picsum.photos/200/200?random=132' }
    ],
    amount: 798,
    points: 40,
    totalQuantity: 2,
    createTime: '2026-05-13 09:15'
  },
  {
    id: 4,
    no: 'DD202605120004',
    status: 'paid',
    items: [
      { id: 4, name: '戴森吹风机 HD15', price: 2999, quantity: 1, image: 'https://picsum.photos/200/200?random=133' }
    ],
    amount: 2999,
    points: 150,
    totalQuantity: 1,
    createTime: '2026-05-12 16:45'
  }
])

const filteredOrders = computed(() => {
  if (!currentStatus.value) return orders.value
  return orders.value.filter(o => o.status === currentStatus.value)
})

function goBack() {
  uni.navigateBack()
}

function switchStatus(status: string) {
  currentStatus.value = status
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成'
  }
  return map[status] || status
}

function goOrderDetail(id: number) {
  uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
}

function cancelOrder(order: Order) {
  uni.showModal({
    title: '提示',
    content: '确定要取消该订单吗？',
    success: (res) => {
      if (res.confirm) {
        order.status = 'cancelled'
        uni.showToast({ title: '订单已取消', icon: 'success' })
      }
    }
  })
}

function payOrder(order: Order) {
  uni.showLoading({ title: '支付中...' })
  setTimeout(() => {
    uni.hideLoading()
    order.status = 'paid'
    statusCounts.value.pending--
    statusCounts.value.paid++
    uni.showToast({ title: '支付成功', icon: 'success' })
  }, 1500)
}

function remindShip(order: Order) {
  uni.showToast({ title: '已提醒商家发货', icon: 'success' })
}

function viewLogistics(order: Order) {
  uni.navigateTo({ url: `/pages/order/logistics?id=${order.id}` })
}

function confirmReceive(order: Order) {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到商品？',
    success: (res) => {
      if (res.confirm) {
        order.status = 'completed'
        statusCounts.value.shipped--
        statusCounts.value.completed++
        uni.showToast({ title: '收货成功', icon: 'success' })
      }
    }
  })
}

function reviewOrder(order: Order) {
  uni.navigateTo({ url: `/pages/product/review?id=${order.items[0].id}` })
}

function rebuyOrder(order: Order) {
  uni.switchTab({ url: '/pages/buy/index' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 32rpx;
  background: $bg-primary;
  
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

.status-tabs {
  display: flex;
  padding: $spacing-base 32rpx;
  background: $bg-primary;
  border-bottom: 1rpx solid $border-color;
  
  .status-tab {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: $text-secondary;
    padding: $spacing-sm 0;
    position: relative;
    
    &.active {
      color: $primary;
      font-weight: 600;
    }
    
    .tab-badge {
      position: absolute;
      top: 0;
      right: 20%;
      min-width: 32rpx;
      height: 32rpx;
      background: $danger;
      border-radius: 16rpx;
      font-size: 20rpx;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.order-list {
  height: calc(100vh - 200rpx);
  padding: $spacing-base $spacing-lg;
}

.order-card {
  background: $bg-card;
  backdrop-filter: blur(20px);
  border-radius: $radius-md;
  padding: $spacing-base;
  margin-bottom: $spacing-base;
  
  .order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-base;
    
    .order-no {
      font-size: 24rpx;
      color: $text-secondary;
    }
    
    .order-status {
      font-size: 26rpx;
      font-weight: 600;
      
      &.status-pending { color: $warning; }
      &.status-paid { color: $primary; }
      &.status-shipped { color: $primary; }
      &.status-completed { color: $profit; }
    }
  }
  
  .order-items {
    .order-item {
      display: flex;
      align-items: center;
      padding: $spacing-sm 0;
      
      .item-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: $radius-sm;
      }
      
      .item-info {
        flex: 1;
        margin-left: $spacing-sm;
        
        .item-name {
          font-size: 26rpx;
          color: $text-primary;
          @include line-clamp(2);
        }
        
        .item-quantity {
          font-size: 24rpx;
          color: $text-muted;
        }
      }
      
      .item-price {
        font-size: 28rpx;
        color: $text-primary;
      }
    }
  }
  
  .order-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-base 0;
    border-top: 1rpx solid $border-light;
    margin-top: $spacing-sm;
    
    .order-info {
      .order-time {
        font-size: 24rpx;
        color: $text-muted;
        display: block;
      }
      
      .order-total {
        font-size: 24rpx;
        color: $text-secondary;
      }
    }
    
    .order-amount {
      text-align: right;
      
      .amount-label {
        font-size: 24rpx;
        color: $text-secondary;
      }
      
      .amount-value {
        font-size: 32rpx;
        font-weight: 700;
        color: $primary;
        margin-left: $spacing-xs;
      }
      
      .amount-points {
        font-size: 22rpx;
        color: $gold;
        margin-left: $spacing-sm;
      }
    }
  }
  
  .order-actions {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
    padding-top: $spacing-base;
    border-top: 1rpx solid $border-light;
    
    .action-btn {
      padding: 12rpx 32rpx;
      border-radius: 50rpx;
      font-size: 26rpx;
      
      &.btn-cancel {
        background: transparent;
        border: 1rpx solid $border-color;
        color: $text-secondary;
      }
      
      &.btn-pay {
        background: linear-gradient(135deg, $primary, $primary-dark);
        color: #fff;
      }
      
      &.btn-remind, &.btn-logistics, &.btn-review {
        background: transparent;
        border: 1rpx solid $primary;
        color: $primary;
      }
      
      &.btn-confirm, &.btn-rebuy {
        background: linear-gradient(135deg, $primary, $primary-dark);
        color: #fff;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl 0;
  
  .empty-icon {
    font-size: 120rpx;
    margin-bottom: $spacing-base;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: $text-secondary;
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
