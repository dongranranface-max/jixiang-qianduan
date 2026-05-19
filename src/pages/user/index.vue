<template>
  <view class="page-container">
    <!-- 顶部安全区 -->
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="avatar" src="https://picsum.photos/200/200?random=100" mode="aspectFill" />
        <view class="user-detail">
          <view class="user-name-row">
            <text class="user-name">{{ userInfo.name }}</text>
            <view class="level-badge">
              <text>{{ levelData.badge }}</text>
              <text class="level-name">{{ levelData.name }}</text>
            </view>
          </view>
          <text class="user-id">ID: {{ userInfo.id }}</text>
        </view>
        <view class="share-btn" @click="goShare">
          <text>推广分享</text>
          <text class="arrow">></text>
        </view>
      </view>
      
      <view class="user-dividend">
        <text class="dividend-icon">💰</text>
        <text class="dividend-text">每日分红: </text>
        <text class="dividend-value">+{{ levelData.dailyDividend }}积分</text>
      </view>
    </view>
    
    <!-- 订单入口 -->
    <view class="order-section">
      <view class="order-header">
        <text class="order-title">我的订单</text>
        <view class="order-more" @click="goOrderList()">
          <text>全部订单</text>
          <text class="arrow">></text>
        </view>
      </view>
      <view class="order-tabs">
        <view class="order-tab" @click="goOrderList('pending')">
          <view class="order-icon-wrap">
            <text class="order-icon">⏳</text>
            <view v-if="orderCounts.pending > 0" class="order-badge">{{ orderCounts.pending }}</view>
          </view>
          <text class="order-label">待付款</text>
        </view>
        <view class="order-tab" @click="goOrderList('shipped')">
          <view class="order-icon-wrap">
            <text class="order-icon">📦</text>
            <view v-if="orderCounts.shipped > 0" class="order-badge">{{ orderCounts.shipped }}</view>
          </view>
          <text class="order-label">待发货</text>
        </view>
        <view class="order-tab" @click="goOrderList('received')">
          <view class="order-icon-wrap">
            <text class="order-icon">🚚</text>
            <view v-if="orderCounts.received > 0" class="order-badge">{{ orderCounts.received }}</view>
          </view>
          <text class="order-label">待收货</text>
        </view>
        <view class="order-tab" @click="goOrderList('completed')">
          <view class="order-icon-wrap">
            <text class="order-icon">✅</text>
          </view>
          <text class="order-label">已完成</text>
        </view>
      </view>
    </view>
    
    <!-- 我的资产 -->
    <view class="asset-section">
      <view class="section-title">💰 我的资产</view>
      <view class="asset-grid">
        <view class="asset-item" @click="goEcoPoints">
          <text class="asset-value text-gold">{{ userInfo.ecoPoints.toLocaleString() }}</text>
          <text class="asset-label">生态积分</text>
        </view>
        <view class="asset-item" @click="goCreditPoints">
          <text class="asset-value text-purple">{{ userInfo.creditPoints.toLocaleString() }}</text>
          <text class="asset-label">消费积分</text>
        </view>
        <view class="asset-item" @click="goBalance">
          <text class="asset-value text-profit">¥{{ userInfo.balance.toFixed(2) }}</text>
          <text class="asset-label">账户余额</text>
        </view>
      </view>
    </view>
    
    <!-- 功能列表 -->
    <view class="menu-section">
      <view class="menu-list">
        <view class="menu-item" @click="goBankCard">
          <text class="menu-icon">🏦</text>
          <text class="menu-label">银行卡</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goAddress">
          <text class="menu-icon">📍</text>
          <text class="menu-label">收货地址</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goFavorite">
          <text class="menu-icon">⭐</text>
          <text class="menu-label">我的收藏</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goCoupon">
          <text class="menu-icon">🎫</text>
          <text class="menu-label">优惠券</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goSignIn">
          <text class="menu-icon">📝</text>
          <text class="menu-label">签到中心</text>
          <text class="menu-tag">+10积分</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goShare">
          <text class="menu-icon">👥</text>
          <text class="menu-label">推广分享</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goService">
          <text class="menu-icon">💬</text>
          <text class="menu-label">客服中心</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goSettings">
          <text class="menu-icon">⚙️</text>
          <text class="menu-label">设置</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi, walletApi, levelApi, orderApi } from '@/utils/api'

const statusBarHeight = ref(20)
const loading = ref(false)

const userInfo = ref({
  name: '',
  id: '',
  ecoPoints: 0,
  creditPoints: 0,
  balance: 0
})

const levelData = ref({
  badge: '🏆',
  name: 'V1',
  dailyDividend: '0'
})

const orderCounts = ref({
  pending: 0,
  shipped: 0,
  received: 0,
  completed: 0
})

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
  loadUserData()
})

async function loadUserData() {
  loading.value = true
  try {
    const token = uni.getStorageSync('token')
    if (!token) return

    const [profile, bal, level] = await Promise.all([
      userApi.getProfile(),
      walletApi.getBalance(),
      levelApi.getMyLevel(),
    ])

    userInfo.value = {
      name: profile.nickname || profile.phone || '用户',
      id: profile.userId || '',
      ecoPoints: Number(bal.ecoPoints || 0),
      creditPoints: Number(bal.consumerPoints || 0),
      balance: Number(bal.balance || 0),
    }

    levelData.value = {
      badge: level.icon || '🏆',
      name: level.levelName || 'V1',
      dailyDividend: level.dailyBonus || '0',
    }

    // 加载订单数量
    loadOrderCounts()
  } catch (e) {
    console.error('加载用户数据失败', e)
  } finally {
    loading.value = false
  }
}

async function loadOrderCounts() {
  try {
    const [pending, shipped, received, completed] = await Promise.all([
      orderApi.getList({ status: 1, limit: 1 }),
      orderApi.getList({ status: 2, limit: 1 }),
      orderApi.getList({ status: 3, limit: 1 }),
      orderApi.getList({ status: 4, limit: 1 }),
    ])
    orderCounts.value = {
      pending: pending.total || 0,
      shipped: shipped.total || 0,
      received: received.total || 0,
      completed: completed.total || 0,
    }
  } catch (e) {
    console.error('加载订单数失败', e)
  }
}

function goOrderList(status?: string) {
  uni.navigateTo({ url: `/pages/order/list?status=${status || ''}` })
}

function goEcoPoints() {
  uni.navigateTo({ url: '/pages/user/points-detail?type=eco' })
}

function goCreditPoints() {
  uni.navigateTo({ url: '/pages/user/points-detail?type=credit' })
}

function goBalance() {
  uni.navigateTo({ url: '/pages/user/assets' })
}

function goBankCard() {
  uni.navigateTo({ url: '/pages/user/bankcard' })
}

function goAddress() {
  uni.navigateTo({ url: '/pages/user/address' })
}

function goFavorite() {
  uni.navigateTo({ url: '/pages/user/favorite' })
}

function goCoupon() {
  uni.navigateTo({ url: '/pages/coupon/list' })
}

function goSignIn() {
  uni.navigateTo({ url: '/pages/user/sign-in' })
}

function goShare() {
  uni.navigateTo({ url: '/pages/user/invite' })
}

function goService() {
  uni.navigateTo({ url: '/pages/chat/service' })
}

function goSettings() {
  uni.navigateTo({ url: '/pages/user/settings' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding: 0 $spacing-lg;
}

.safe-area-top {
  width: 100%;
}

.user-card {
  background: linear-gradient(
    135deg,
    rgba($primary, 0.35) 0%,
    rgba($primary, 0.15) 50%,
    rgba($primary, 0.05) 100%
  );
  backdrop-filter: blur(30px);
  border: 1rpx solid rgba($primary, 0.3);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  
  .user-info {
    display: flex;
    align-items: center;
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.2);
    }
    
    .user-detail {
      flex: 1;
      margin-left: $spacing-base;
      
      .user-name-row {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        
        .user-name {
          font-size: 36rpx;
          font-weight: 700;
          color: $text-primary;
        }
        
        .level-badge {
          display: flex;
          align-items: center;
          gap: 4rpx;
          background: linear-gradient(135deg, $gold, #FFA500);
          color: #000;
          padding: 4rpx 16rpx;
          border-radius: 50rpx;
          font-size: 22rpx;
          font-weight: 600;
          
          .level-name {
            margin-left: 4rpx;
          }
        }
      }
      
      .user-id {
        font-size: 24rpx;
        color: $text-secondary;
        margin-top: 8rpx;
        display: block;
      }
    }
    
    .share-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      background: $bg-card;
      backdrop-filter: blur(20px);
      padding: 12rpx 24rpx;
      border-radius: 50rpx;
      font-size: 24rpx;
      color: $text-primary;
      
      .arrow {
        font-size: 20rpx;
      }
    }
  }
  
  .user-dividend {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: $spacing-base;
    padding-top: $spacing-base;
    border-top: 1rpx solid $border-color;
    
    .dividend-icon {
      font-size: 32rpx;
    }
    
    .dividend-text {
      font-size: 26rpx;
      color: $text-secondary;
      margin-left: 8rpx;
    }
    
    .dividend-value {
      font-size: 28rpx;
      font-weight: 600;
      color: $profit;
      margin-left: 8rpx;
    }
  }
}

.order-section {
  background: $bg-card;
  backdrop-filter: blur(20px);
  border: 1rpx solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-base;
  margin-bottom: $spacing-lg;
  
  .order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-base;
    
    .order-title {
      font-size: 30rpx;
      font-weight: 600;
      color: $text-primary;
    }
    
    .order-more {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: $text-secondary;
      
      .arrow {
        margin-left: 4rpx;
      }
    }
  }
  
  .order-tabs {
    display: flex;
    justify-content: space-around;
    
    .order-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      
      .order-icon-wrap {
        position: relative;
        
        .order-icon {
          font-size: 48rpx;
        }
        
        .order-badge {
          position: absolute;
          top: -8rpx;
          right: -16rpx;
          min-width: 32rpx;
          height: 32rpx;
          background: $danger;
          border-radius: 16rpx;
          font-size: 20rpx;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 8rpx;
        }
      }
      
      .order-label {
        font-size: 24rpx;
        color: $text-secondary;
      }
    }
  }
}

.asset-section {
  background: $bg-card;
  backdrop-filter: blur(20px);
  border: 1rpx solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-base;
  margin-bottom: $spacing-lg;
  
  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-base;
  }
  
  .asset-grid {
    display: flex;
    justify-content: space-around;
    
    .asset-item {
      text-align: center;
      
      .asset-value {
        font-size: 40rpx;
        font-weight: 700;
        display: block;
        
        &.text-gold {
          color: $gold;
        }
        
        &.text-purple {
          color: $primary;
        }
        
        &.text-profit {
          color: $profit;
        }
      }
      
      .asset-label {
        font-size: 24rpx;
        color: $text-secondary;
        margin-top: 8rpx;
        display: block;
      }
    }
  }
}

.menu-section {
  background: $bg-card;
  backdrop-filter: blur(20px);
  border: 1rpx solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-sm $spacing-base;
  margin-bottom: $spacing-xl;
}

.menu-list {
  .menu-item {
    display: flex;
    align-items: center;
    padding: $spacing-base 0;
    border-bottom: 1rpx solid $border-light;
    
    &:last-child {
      border-bottom: none;
    }
    
    .menu-icon {
      font-size: 44rpx;
      margin-right: $spacing-base;
    }
    
    .menu-label {
      flex: 1;
      font-size: 30rpx;
      color: $text-primary;
    }
    
    .menu-tag {
      font-size: 22rpx;
      color: $profit;
      background: rgba($profit, 0.15);
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
      margin-right: $spacing-sm;
    }
    
    .menu-arrow {
      font-size: 28rpx;
      color: $text-muted;
    }
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
