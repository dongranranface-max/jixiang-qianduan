<template>
  <view class="page-container">
    <!-- 顶部安全区 -->
    <view class="safe-area-top" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">增值</text>
    </view>
    
    <!-- 我的资产卡片 -->
    <view class="asset-card">
      <view class="asset-header">
        <text class="asset-label">💰 我的资产</text>
        <text class="asset-detail" @click="goAssetDetail">明细 ></text>
      </view>
      
      <view class="asset-values">
        <view class="asset-item">
          <text class="asset-value text-gold">{{ ecoPoints.toLocaleString() }}</text>
          <text class="asset-name">生态积分</text>
          <text class="asset-sub">估值: ¥{{ (ecoPoints / 100).toFixed(2) }}</text>
        </view>
        <view class="asset-divider"></view>
        <view class="asset-item">
          <text class="asset-value text-purple">{{ creditPoints.toLocaleString() }}</text>
          <text class="asset-name">消费积分</text>
          <text class="asset-sub">可兑换免费商品</text>
        </view>
      </view>
      
      <view class="asset-actions">
        <view class="action-btn" @click="goInvest">
          <text class="action-icon">📈</text>
          <text class="action-text">申购理财</text>
        </view>
        <view class="action-btn" @click="goMyInvest">
          <text class="action-icon">📋</text>
          <text class="action-text">我的理财</text>
        </view>
        <view class="action-btn" @click="goPointsDetail">
          <text class="action-icon">📜</text>
          <text class="action-text">积分明细</text>
        </view>
      </view>
    </view>
    
    <!-- 会员等级卡片 -->
    <view class="level-card">
      <view class="level-header">
        <view class="level-info">
          <text class="level-badge">{{ levelData.badge }}</text>
          <view class="level-text">
            <text class="level-name">{{ levelData.name }}</text>
            <text class="level-title">{{ levelData.title }}</text>
          </view>
        </view>
        <view class="level-dividend">
          <text class="dividend-label">每日分红</text>
          <text class="dividend-value">+{{ levelData.dailyDividend }}积分</text>
        </view>
      </view>
      
      <view class="level-progress">
        <view class="progress-info">
          <text class="progress-current">{{ levelData.current.toLocaleString() }}</text>
          <text class="progress-separator">/</text>
          <text class="progress-target">{{ levelData.target.toLocaleString() }}</text>
        </view>
        <view class="progress-bar">
          <view 
            class="progress-fill" 
            :style="{ width: (levelData.current / levelData.target * 100) + '%' }"
          ></view>
        </view>
        <view class="progress-tip">
          <text v-if="levelData.nextLevel">
            距离 {{ levelData.nextLevel.name }} 还差 {{ (levelData.target - levelData.current).toLocaleString() }} 业绩
          </text>
          <text v-else>已是最高等级</text>
        </view>
      </view>
    </view>
    
    <!-- 理财专区 -->
    <view class="section">
      <view class="section-header">
        <view class="section-title-row">
          <text class="section-icon">📈</text>
          <text class="section-title">理财专区</text>
        </view>
        <view class="section-more" @click="goInvestList">
          <text>全部</text>
          <text class="arrow">></text>
        </view>
      </view>
      
      <view class="invest-list">
        <view 
          class="invest-card" 
          v-for="project in investProjects" 
          :key="project.id"
          @click="goProjectDetail(project)"
        >
          <view class="invest-header">
            <view class="invest-type">
              <text class="type-icon">{{ project.icon }}</text>
              <text class="type-name">{{ project.name }}</text>
            </view>
            <view class="invest-tag" :class="'tag-' + project.level">
              {{ project.level === 'high' ? '热门' : project.level === 'new' ? '新品' : '稳健' }}
            </view>
          </view>
          
          <view class="invest-stats">
            <view class="stat-item">
              <text class="stat-value profit">{{ project.yield }}%</text>
              <text class="stat-label">年化收益</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ project.cycle }}天</text>
              <text class="stat-label">投资周期</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ project.minAmount.toLocaleString() }}</text>
              <text class="stat-label">最低申购</text>
            </view>
          </view>
          
          <view class="invest-footer">
            <view class="invest-progress">
              <view class="progress-bar-small">
                <view 
                  class="progress-fill-small" 
                  :style="{ width: project.progress + '%' }"
                ></view>
              </view>
              <text class="progress-text">已申购 {{ project.progress }}%</text>
            </view>
            <view class="invest-btn">
              <text>立即申购</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 理财规则说明 -->
    <view class="rules-section">
      <view class="rules-header">
        <text class="rules-title">📖 理财规则</text>
      </view>
      <view class="rules-list">
        <view class="rule-item" v-for="rule in rules" :key="rule.id">
          <text class="rule-icon">{{ rule.icon }}</text>
          <view class="rule-content">
            <text class="rule-title">{{ rule.title }}</text>
            <text class="rule-desc">{{ rule.desc }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const statusBarHeight = ref(20)

// 模拟数据
const ecoPoints = ref(12580)
const creditPoints = ref(350)

const levelData = ref({
  badge: '🏆',
  name: 'V3',
  title: '铂金会员',
  current: 35000,
  target: 100000,
  dailyDividend: 300,
  nextLevel: {
    name: 'V4 ⭐',
    target: 100000
  }
})

const investProjects = ref([
  {
    id: 1,
    name: '跨境电商理财',
    icon: '🌐',
    yield: 12,
    cycle: 30,
    minAmount: 1000,
    progress: 75,
    level: 'high'
  },
  {
    id: 2,
    name: '量化交易理财',
    icon: '📊',
    yield: 15,
    cycle: 60,
    minAmount: 5000,
    progress: 45,
    level: 'new'
  },
  {
    id: 3,
    name: '算力机房理财',
    icon: '⚡',
    yield: 18,
    cycle: 90,
    minAmount: 10000,
    progress: 30,
    level: 'safe'
  }
])

const rules = ref([
  { id: 1, icon: '💰', title: '收益计算', desc: '每日结算，自动到账' },
  { id: 2, icon: '⏰', title: '周期灵活', desc: '30/60/90天可选' },
  { id: 3, icon: '🔒', title: '本金安全', desc: '到期全额返还' },
  { id: 4, icon: '⚠️', title: '提前赎回', desc: '收取2-5%手续费' }
])

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
})

function goAssetDetail() {
  uni.navigateTo({ url: '/pages/user/points-detail' })
}

function goInvest() {
  uni.navigateTo({ url: '/pages/wealth/invest' })
}

function goMyInvest() {
  uni.navigateTo({ url: '/pages/wealth/my-invest' })
}

function goPointsDetail() {
  uni.navigateTo({ url: '/pages/user/points-detail' })
}

function goInvestList() {
  uni.navigateTo({ url: '/pages/wealth/invest-list' })
}

function goProjectDetail(project: any) {
  uni.navigateTo({ url: `/pages/wealth/project-detail?id=${project.id}` })
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

.page-header {
  padding: $spacing-base 0;
  
  .page-title {
    font-size: 40rpx;
    font-weight: 700;
    color: $text-primary;
  }
}

.asset-card {
  background: linear-gradient(
    135deg,
    rgba($primary, 0.25) 0%,
    rgba($primary, 0.1) 100%
  );
  backdrop-filter: blur(30px);
  border: 1rpx solid rgba($primary, 0.3);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  
  .asset-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .asset-label {
      font-size: 30rpx;
      color: $text-primary;
      font-weight: 600;
    }
    
    .asset-detail {
      font-size: 26rpx;
      color: $text-secondary;
    }
  }
  
  .asset-values {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: $spacing-lg 0;
    
    .asset-divider {
      width: 1rpx;
      height: 80rpx;
      background: $border-color;
    }
    
    .asset-item {
      text-align: center;
      
      .asset-value {
        font-size: 56rpx;
        font-weight: 700;
        display: block;
        
        &.text-gold {
          color: $gold;
        }
        
        &.text-purple {
          color: $primary;
        }
      }
      
      .asset-name {
        font-size: 26rpx;
        color: $text-secondary;
        margin-top: 8rpx;
        display: block;
      }
      
      .asset-sub {
        font-size: 22rpx;
        color: $text-muted;
        margin-top: 4rpx;
        display: block;
      }
    }
  }
  
  .asset-actions {
    display: flex;
    justify-content: space-around;
    margin-top: $spacing-base;
    
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      
      .action-icon {
        font-size: 44rpx;
      }
      
      .action-text {
        font-size: 24rpx;
        color: $text-secondary;
      }
    }
  }
}

.level-card {
  background: linear-gradient(
    135deg,
    rgba($gold, 0.2) 0%,
    rgba($gold, 0.05) 100%
  );
  backdrop-filter: blur(30px);
  border: 1rpx solid rgba($gold, 0.3);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  
  .level-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .level-info {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      
      .level-badge {
        font-size: 64rpx;
      }
      
      .level-text {
        .level-name {
          font-size: 40rpx;
          font-weight: 700;
          color: $gold;
          display: block;
        }
        
        .level-title {
          font-size: 24rpx;
          color: $text-secondary;
        }
      }
    }
    
    .level-dividend {
      text-align: right;
      
      .dividend-label {
        font-size: 22rpx;
        color: $text-muted;
        display: block;
      }
      
      .dividend-value {
        font-size: 28rpx;
        font-weight: 600;
        color: $profit;
      }
    }
  }
  
  .level-progress {
    margin-top: $spacing-lg;
    
    .progress-info {
      display: flex;
      align-items: baseline;
      gap: 4rpx;
      margin-bottom: $spacing-sm;
      
      .progress-current {
        font-size: 32rpx;
        font-weight: 700;
        color: $gold;
      }
      
      .progress-separator {
        font-size: 24rpx;
        color: $text-muted;
      }
      
      .progress-target {
        font-size: 24rpx;
        color: $text-muted;
      }
    }
    
    .progress-bar {
      height: 16rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8rpx;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, $gold, #FFA500);
        border-radius: 8rpx;
        transition: width 0.3s ease;
      }
    }
    
    .progress-tip {
      font-size: 22rpx;
      color: $text-secondary;
      margin-top: $spacing-sm;
    }
  }
}

.section {
  margin-bottom: $spacing-xl;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-base;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  
  .section-icon {
    font-size: 36rpx;
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
  }
}

.section-more {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: $text-secondary;
  
  .arrow {
    margin-left: 4rpx;
  }
}

.invest-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.invest-card {
  background: $bg-card;
  backdrop-filter: blur(20px);
  border: 1rpx solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-base;
  
  .invest-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-base;
    
    .invest-type {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      
      .type-icon {
        font-size: 40rpx;
      }
      
      .type-name {
        font-size: 30rpx;
        font-weight: 600;
        color: $text-primary;
      }
    }
    
    .invest-tag {
      font-size: 20rpx;
      padding: 4rpx 16rpx;
      border-radius: 8rpx;
      
      &.tag-high {
        background: linear-gradient(135deg, $danger, #DC2626);
        color: #fff;
      }
      
      &.tag-new {
        background: linear-gradient(135deg, $profit, #00CC00);
        color: #000;
      }
      
      &.tag-safe {
        background: linear-gradient(135deg, $primary, $primary-dark);
        color: #fff;
      }
    }
  }
  
  .invest-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: $spacing-base;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        font-size: 40rpx;
        font-weight: 700;
        display: block;
        
        &.profit {
          color: $profit;
        }
      }
      
      .stat-label {
        font-size: 22rpx;
        color: $text-secondary;
      }
    }
  }
  
  .invest-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .invest-progress {
      flex: 1;
      
      .progress-bar-small {
        height: 8rpx;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4rpx;
        overflow: hidden;
        
        .progress-fill-small {
          height: 100%;
          background: $primary;
          border-radius: 4rpx;
        }
      }
      
      .progress-text {
        font-size: 20rpx;
        color: $text-muted;
        margin-top: 4rpx;
        display: block;
      }
    }
    
    .invest-btn {
      background: linear-gradient(135deg, $profit, #00CC00);
      color: #000;
      font-size: 26rpx;
      font-weight: 600;
      padding: 12rpx 32rpx;
      border-radius: 50rpx;
      margin-left: $spacing-base;
    }
  }
}

.rules-section {
  background: $bg-card;
  backdrop-filter: blur(20px);
  border: 1rpx solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-base;
  margin-bottom: $spacing-xl;
  
  .rules-header {
    margin-bottom: $spacing-base;
    
    .rules-title {
      font-size: 28rpx;
      font-weight: 600;
      color: $text-primary;
    }
  }
  
  .rules-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-base;
    
    .rule-item {
      display: flex;
      align-items: flex-start;
      gap: $spacing-sm;
      
      .rule-icon {
        font-size: 32rpx;
      }
      
      .rule-content {
        .rule-title {
          font-size: 26rpx;
          color: $text-primary;
          font-weight: 600;
          display: block;
        }
        
        .rule-desc {
          font-size: 22rpx;
          color: $text-secondary;
        }
      }
    }
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
