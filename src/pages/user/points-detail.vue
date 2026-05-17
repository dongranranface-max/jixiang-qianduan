<template>
  <view class="page-container">
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <view class="nav-bar">
      <text class="nav-back" @click="goBack">←</text>
      <text class="nav-title">积分明细</text>
    </view>
    
    <!-- 积分概览 -->
    <view class="points-overview">
      <view class="points-card eco-card">
        <view class="card-header">
          <text class="card-icon">💰</text>
          <text class="card-title">生态积分</text>
        </view>
        <text class="points-value">{{ ecoPoints.toLocaleString() }}</text>
        <text class="points-tips">可理财 · 可换购</text>
      </view>
      <view class="points-card credit-card">
        <view class="card-header">
          <text class="card-icon">🎫</text>
          <text class="card-title">消费积分</text>
        </view>
        <text class="points-value">{{ creditPoints.toLocaleString() }}</text>
        <text class="points-tips">仅可兑换商品</text>
      </view>
    </view>
    
    <!-- 筛选 Tab -->
    <view class="filter-tabs">
      <view 
        class="filter-tab" 
        :class="{ active: filterType === 'all' }"
        @click="filterType = 'all'"
      >
        全部
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: filterType === 'income' }"
        @click="filterType = 'income'"
      >
        收入
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: filterType === 'expense' }"
        @click="filterType = 'expense'"
      >
        支出
      </view>
    </view>
    
    <!-- 明细列表 -->
    <scroll-view class="record-list" scroll-y>
      <view 
        class="record-item" 
        v-for="record in filteredRecords" 
        :key="record.id"
      >
        <view class="record-icon" :class="record.type">
          <text>{{ record.type === 'income' ? '↑' : '↓' }}</text>
        </view>
        <view class="record-info">
          <text class="record-title">{{ record.title }}</text>
          <text class="record-time">{{ record.time }}</text>
        </view>
        <text class="record-points" :class="record.type">
          {{ record.type === 'income' ? '+' : '-' }}{{ record.points }}
        </text>
      </view>
      
      <view class="empty-state" v-if="filteredRecords.length === 0">
        <text>暂无记录</text>
      </view>
      
      <view class="safe-area-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const statusBarHeight = ref(20)
const filterType = ref('all')

const ecoPoints = ref(12580)
const creditPoints = ref(350)

const records = ref([
  { id: 1, type: 'income', title: '消费赠送', points: 500, time: '2026-05-15 14:30' },
  { id: 2, type: 'income', title: '理财收益', points: 120, time: '2026-05-15 09:00' },
  { id: 3, type: 'expense', title: '兑换商品', points: -2000, time: '2026-05-14 20:15' },
  { id: 4, type: 'income', title: '推荐奖励', points: 50, time: '2026-05-14 10:00' },
  { id: 5, type: 'expense', title: '申购理财', points: -5000, time: '2026-05-13 15:30' },
  { id: 6, type: 'income', title: '会员分红', points: 300, time: '2026-05-13 00:00' },
  { id: 7, type: 'income', title: '签到奖励', points: 10, time: '2026-05-12 08:00' }
])

const filteredRecords = computed(() => {
  if (filterType.value === 'all') return records.value
  return records.value.filter(r => r.type === filterType.value)
})

function goBack() {
  uni.navigateBack()
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
  padding: 16rpx 32rpx;
  
  .nav-back {
    font-size: 40rpx;
    color: #fff;
  }
  
  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 34rpx;
    font-weight: 600;
    color: #fff;
    margin-right: 60rpx;
  }
}

.points-overview {
  display: flex;
  gap: $spacing-base;
  padding: 0 $spacing-lg;
  margin-bottom: $spacing-lg;
  
  .points-card {
    flex: 1;
    padding: $spacing-lg;
    border-radius: $radius-md;
    
    .card-header {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-sm;
      
      .card-icon {
        font-size: 36rpx;
      }
      
      .card-title {
        font-size: 26rpx;
        color: $text-secondary;
      }
    }
    
    .points-value {
      font-size: 48rpx;
      font-weight: 700;
      display: block;
    }
    
    .points-tips {
      font-size: 22rpx;
      color: $text-muted;
      margin-top: 4rpx;
      display: block;
    }
    
    &.eco-card {
      background: linear-gradient(135deg, rgba($gold, 0.2), rgba($gold, 0.05));
      border: 1rpx solid rgba($gold, 0.3);
      
      .points-value { color: $gold; }
    }
    
    &.credit-card {
      background: linear-gradient(135deg, rgba($primary, 0.2), rgba($primary, 0.05));
      border: 1rpx solid rgba($primary, 0.3);
      
      .points-value { color: $primary; }
    }
  }
}

.filter-tabs {
  display: flex;
  padding: 0 $spacing-lg;
  margin-bottom: $spacing-base;
  
  .filter-tab {
    padding: 12rpx 32rpx;
    font-size: 28rpx;
    color: $text-secondary;
    border-radius: 50rpx;
    margin-right: $spacing-sm;
    
    &.active {
      background: $primary;
      color: #fff;
    }
  }
}

.record-list {
  height: calc(100vh - 400rpx);
  padding: 0 $spacing-lg;
}

.record-item {
  display: flex;
  align-items: center;
  padding: $spacing-base 0;
  border-bottom: 1rpx solid $border-light;
  
  .record-icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: 700;
    margin-right: $spacing-base;
    
    &.income {
      background: rgba($profit, 0.2);
      color: $profit;
    }
    
    &.expense {
      background: rgba($danger, 0.2);
      color: $danger;
    }
  }
  
  .record-info {
    flex: 1;
    
    .record-title {
      font-size: 28rpx;
      color: $text-primary;
      display: block;
    }
    
    .record-time {
      font-size: 22rpx;
      color: $text-muted;
    }
  }
  
  .record-points {
    font-size: 32rpx;
    font-weight: 700;
    
    &.income { color: $profit; }
    &.expense { color: $danger; }
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-2xl;
  color: $text-muted;
}
</style>
