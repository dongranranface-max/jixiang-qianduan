<template>
  <view class="page-container">
    <!-- 顶部沉浸式资产状态栏 -->
    <AssetStatusBar v-if="loggedIn" />
    <view v-else class="safe-area-top" :style="{ height: statusBarHeight + 'px' }" />

    <!-- 未登录引导 -->
    <view v-if="!loggedIn" class="not-logged">
      <text class="not-logged__title">登录后查看增值资产</text>
      <view class="not-logged__btn" @click="goLogin">
        <text>立即登录</text>
      </view>
    </view>

    <!-- 已登录：增值理财主页 -->
    <view v-else class="page-body">

      <!-- 资产骨架屏 -->
      <view v-if="loadingAsset" class="asset-card asset-card--skeleton">
        <view class="skeleton-panel">
          <view class="sk-line sk-title" />
          <view class="sk-row">
            <view class="sk-block" />
            <view class="sk-block sk-w60" />
          </view>
        </view>
      </view>

      <!-- 资产概览卡片 -->
      <view v-else class="asset-card">
        <!-- 顶部：昨日分红高亮 -->
        <view class="profit-banner">
          <view class="profit-banner__left">
            <text class="profit-banner__label">昨日分红</text>
            <view class="profit-banner__value-row">
              <text class="profit-banner__value">+{{ yesterdayProfit.toFixed(2) }}</text>
              <text class="profit-banner__unit">积分</text>
            </view>
          </view>
          <view class="profit-banner__divider" />
          <view class="profit-banner__right">
            <text class="profit-banner__hint">平台每日结算</text>
            <text class="profit-banner__safe">本金全额保障</text>
          </view>
        </view>

        <!-- 资产明细 -->
        <view class="asset-row">
          <view class="asset-item">
            <text class="asset-item__value">{{ ecoPoints.toLocaleString() }}</text>
            <text class="asset-item__label">生态积分</text>
            <text class="asset-item__sub">≈ ¥{{ (ecoPoints / 100).toFixed(2) }}</text>
          </view>
          <view class="asset-divider" />
          <view class="asset-item">
            <text class="asset-item__value">{{ creditPoints.toLocaleString() }}</text>
            <text class="asset-item__label">消费积分</text>
            <text class="asset-item__sub">可兑免费商品</text>
          </view>
          <view class="asset-divider" />
          <view class="asset-item asset-item--action" @click="goAssetDetail">
            <view class="asset-item__icon">›</view>
            <text class="asset-item__label">明细</text>
          </view>
        </view>
      </view>

      <!-- 会员等级卡 -->
      <WealthLevelCard :level-data="levelData" @click="goLevelDetail" />

      <!-- 理财专区 -->
      <view class="section">
        <view class="section-head">
          <view class="section-head__left">
            <text class="section-head__icon">理</text>
            <text class="section-head__title">理财专区</text>
          </view>
          <view class="section-head__more" @click="goInvestList">
            <text>全部</text>
            <text class="arrow">›</text>
          </view>
        </view>

        <!-- 加载骨架屏 -->
        <view v-if="loadingProducts" class="skeleton-list">
          <view v-for="i in 3" :key="i" class="skeleton-card" />
        </view>

        <!-- 加载失败 -->
        <view v-else-if="loadError" class="state-empty" @click="loadFinancialProducts">
          <text class="state-empty__icon">!</text>
          <text class="state-empty__text">加载失败</text>
          <text class="state-empty__sub">点击重试</text>
        </view>

        <!-- 空状态 -->
        <view v-else-if="!investProjects.length" class="state-empty">
          <text class="state-empty__icon">理</text>
          <text class="state-empty__text">暂无理财项目</text>
          <text class="state-empty__sub">平台正在加紧上架，敬请期待</text>
        </view>

        <!-- 理财列表 -->
        <view v-else class="invest-list">
          <WealthInvestCard
            v-for="project in investProjects"
            :key="project.id"
            :project="project"
            @click="goProjectDetail"
            @invest="goProjectDetail"
          />
        </view>
      </view>

      <!-- 理财规则说明 -->
      <view class="rules-section">
        <text class="rules-section__title">理财规则</text>
        <view class="rules-grid">
          <view v-for="rule in rules" :key="rule.id" class="rule-item">
            <view class="rule-item__dot" />
            <view class="rule-item__content">
              <text class="rule-item__title">{{ rule.title }}</text>
              <text class="rule-item__desc">{{ rule.desc }}</text>
            </view>
          </view>
        </view>
      </view>

    </view>

    <view class="safe-area-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { walletApi, levelApi, financialApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'
import AssetStatusBar from '@/components/AssetStatusBar.vue'
import WealthLevelCard from '@/components/wealth/WealthLevelCard.vue'
import WealthInvestCard from '@/components/wealth/WealthInvestCard.vue'

const statusBarHeight = ref(20)
const loggedIn = ref(checkAuth())
const ecoPoints = ref(0)
const creditPoints = ref(0)
const yesterdayProfit = ref(0)
const loadingAsset = ref(false)
const loadingProducts = ref(false)
const loadError = ref(false)

const levelData = ref({
  badge: '级',
  name: 'V1',
  levelName: '普通会员',
  teamPerformance: '0',
  minPerformance: '5000',
  nextMinPerformance: '0',
  dailyBonus: '0',
  totalBonus: '0',
  nextLevel: 0,
  nextLevelName: '',
  upgradeNeed: '0',
  icon: '级',
  level: 1,
})

const investProjects = ref<any[]>([])

const rules = ref([
  { id: 1, title: '收益计算', desc: '每日结算，自动到账' },
  { id: 2, title: '周期灵活', desc: '30/60/90天可选' },
  { id: 3, title: '本金安全', desc: '到期全额返还' },
  { id: 4, title: '提前赎回', desc: '收取2-5%手续费' },
])

onMounted(() => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 20
})

onShow(() => {
  loggedIn.value = checkAuth()
  if (!loggedIn.value) return
  loadAssetData()
  loadLevelData()
  loadFinancialProducts()
})

async function loadAssetData() {
  loadingAsset.value = true
  try {
    const bal = await walletApi.getBalance()
    ecoPoints.value = Number(bal.ecoPoints || 0)
    creditPoints.value = Number(bal.consumerPoints || 0)
    yesterdayProfit.value = Number(bal?.yesterdayProfit ?? bal?.todayEarnings ?? 0)
  } catch {
    // silent fail
  } finally {
    loadingAsset.value = false
  }
}

async function loadLevelData() {
  try {
    const data = await levelApi.getMyLevel()
    levelData.value = {
      badge: data.icon || '级',
      name: data.levelName || 'V1',
      levelName: data.levelName || '普通会员',
      teamPerformance: data.teamPerformance || '0',
      minPerformance: data.minPerformance || '5000',
      nextMinPerformance: data.nextMinPerformance || data.minPerformance || '5000',
      dailyBonus: data.dailyBonus || '0',
      totalBonus: data.totalBonus || '0',
      nextLevel: data.nextLevel || 0,
      nextLevelName: data.nextLevelName || '',
      upgradeNeed: data.upgradeNeed || '0',
      icon: data.icon || '级',
      level: data.level || 1,
    }
  } catch {
    // silent fail
  }
}

async function loadFinancialProducts() {
  loadingProducts.value = true
  loadError.value = false
  try {
    const products = await financialApi.getProducts()
    investProjects.value = ((products || []) as any[]).map((p: any) => ({
      id: p.id,
      name: p.name,
      icon: p.rateType === 1 ? '活' : p.rateType === 2 ? '稳' : '全',
      yield: p.displayRate || p.rateValue,
      cycleDays: p.cycleDays || p.cycle || 30,
      minAmount: p.minAmount,
      progress: p.totalInvested && p.totalAmount
        ? Math.round((Number(p.totalInvested) / Number(p.totalAmount)) * 100)
        : 50,
      level: p.riskLevel === 1 ? 'safe' : p.riskLevel === 2 ? 'new' : 'high',
      displayRate: p.displayRate || p.rateValue,
      totalAmount: p.totalAmount,
      totalInvested: p.totalInvested,
      riskLevel: p.riskLevel,
    }))
  } catch {
    loadError.value = true
  } finally {
    loadingProducts.value = false
  }
}

function goLogin() {
  uni.navigateTo({ url: '/pages/auth/login' })
}
function goAssetDetail() {
  uni.navigateTo({ url: '/pages/user/points-detail' })
}
function goInvestList() {
  uni.navigateTo({ url: '/pages/wealth/invest' })
}
function goLevelDetail() {
  uni.navigateTo({ url: '/pages/user/level-detail' })
}
function goProjectDetail(project: any) {
  uni.navigateTo({ url: `/pages/wealth/invest?productId=${project.id}` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';
@import '@/styles/page-shell.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding: 0;
}

.safe-area-top { width: 100%; }

.page-body {
  padding: 0 $spacing-base $spacing-xl;
}

// 未登录
.not-logged {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;

  &__title {
    font-size: 30rpx;
    color: $text-secondary;
    margin-bottom: 40rpx;
  }

  &__btn {
    padding: 20rpx 64rpx;
    background: $btn-gold-gradient;
    border-radius: $radius-full;
    box-shadow: $btn-gold-shadow;

    text {
      font-size: 30rpx;
      font-weight: 700;
      color: #fff;
    }
  }
}

// 资产概览卡片
.asset-card {
  margin: 16rpx $spacing-base;
  background: $asset-card-bg;
  border: 1rpx solid $asset-card-border;
  border-radius: $asset-card-radius;
  box-shadow: $asset-card-shadow;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  // 左上角光晕
  &::before {
    content: '';
    position: absolute;
    top: -30rpx;
    left: -30rpx;
    width: 200rpx;
    height: 200rpx;
    background: radial-gradient(circle, rgba(184, 152, 118, 0.14) 0%, transparent 70%);
    pointer-events: none;
  }
}

.profit-banner {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx 24rpx;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.06);

  &__left { flex: 1; }

  &__label {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 500;
    display: block;
    margin-bottom: 8rpx;
  }

  &__value-row {
    display: flex;
    align-items: baseline;
    gap: 6rpx;
  }

  &__value {
    font-family: $asset-balance-font;
    font-size: 44rpx;
    font-weight: $asset-balance-weight;
    color: $bronze-light;
    font-variant-numeric: tabular-nums;
  }

  &__unit {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.5);
  }

  &__divider {
    width: 1rpx;
    height: 64rpx;
    background: rgba(212, 180, 131, 0.15);
    margin: 0 28rpx;
    flex-shrink: 0;
  }

  &__right {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
  }

  &__hint {
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.4);
  }

  &__safe {
    font-size: 20rpx;
    color: rgba(184, 152, 118, 0.7);
    font-weight: 600;
  }
}

.asset-row {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
}

.asset-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;

  &__value {
    font-family: $asset-balance-font;
    font-size: 36rpx;
    font-weight: 700;
    color: #fff;
    font-variant-numeric: tabular-nums;
  }

  &__label {
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 500;
  }

  &__sub {
    font-size: 18rpx;
    color: rgba(255, 255, 255, 0.3);
  }

  &__icon {
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 4rpx;
  }

  &--action {
    cursor: pointer;
  }
}

.asset-divider {
  width: 1rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

// 骨架屏
.asset-card--skeleton {
  padding: 28rpx 32rpx;
  min-height: 140rpx;
}

.skeleton-panel {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.sk-line {
  height: 20rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10rpx;
  animation: sk-shimmer 1.4s ease-in-out infinite;
}

.sk-title { width: 40%; height: 28rpx; }
.sk-row { display: flex; gap: 24rpx; }
.sk-block {
  flex: 1;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16rpx;
  animation: sk-shimmer 1.4s ease-in-out infinite;
}
.sk-w60 { flex: 0.6; }

@keyframes sk-shimmer {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

// 骨架列表
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}
.skeleton-card {
  height: 200rpx;
  background: rgba(47, 53, 66, 0.06);
  border-radius: $radius-lg;
  animation: sk-shimmer 1.4s ease-in-out infinite;
}

// 空状态
.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  background: $bg-secondary;
  border: 1rpx solid $border-light;
  border-radius: $radius-xl;

  &__icon {
    width: 88rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    font-size: 36rpx;
    font-weight: 800;
    background: $warm-yellow;
    border: 1rpx solid $border-primary;
    border-radius: 50%;
    color: $accent-dark;
    margin-bottom: 20rpx;
  }

  &__text {
    font-size: 30rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8rpx;
  }

  &__sub {
    font-size: 24rpx;
    color: $text-muted;
  }
}

// 理财专区
.section {
  margin: $spacing-lg 0;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding: 0 $spacing-base;

  &__left {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  &__icon {
    width: 56rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    font-size: 26rpx;
    font-weight: 800;
    background: $warm-yellow;
    border: 1rpx solid $border-primary;
    border-radius: 50%;
    color: $accent-dark;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 700;
    color: $text-primary;
    letter-spacing: 0.5rpx;
  }

  &__more {
    display: flex;
    align-items: center;
    gap: 4rpx;
    font-size: 24rpx;
    color: $text-secondary;
  }
}

.invest-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
  padding: 0 $spacing-base;
}

// 理财规则
.rules-section {
  margin: $spacing-lg $spacing-base;
  padding: 32rpx 28rpx;
  background: $bg-secondary;
  border: 1rpx solid $border-light;
  border-radius: $radius-xl;

  &__title {
    font-size: 28rpx;
    font-weight: 700;
    color: $text-primary;
    display: block;
    margin-bottom: 24rpx;
  }
}

.rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;

  &__dot {
    width: 10rpx;
    height: 10rpx;
    border-radius: 50%;
    background: $bronze-gold;
    margin-top: 8rpx;
    flex-shrink: 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
  }

  &__title {
    font-size: 26rpx;
    font-weight: 600;
    color: $text-primary;
  }

  &__desc {
    font-size: 22rpx;
    color: $text-muted;
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
