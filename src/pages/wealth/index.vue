<template>
  <view class="page">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">增值区</text>
      <text class="page-sub">稳健增值 智慧理财</text>
    </view>

    <!-- 资产总览卡 -->
    <view v-if="loggedIn" class="asset-overview">
      <view class="asset-overview__bg" />
      <view class="asset-overview__inner">
        <view class="asset-overview__top">
          <view class="asset-label-row">
            <text class="asset-overview__label">总资产（积分）</text>
            <view class="asset-overview__eye" @click="toggleAsset"><text>{{ showAsset ? '👁' : '👁‍🗨' }}</text></view>
          </view>
          <text class="asset-overview__value">{{ showAsset ? ecoPointsDisplay : '******' }}</text>
        </view>
        <view class="asset-overview__stats">
          <view class="stat-item"><text class="stat-value">{{ showAsset ? yesterdayProfitDisplay : '****' }}</text><text class="stat-label">昨日收益</text></view>
          <view class="stat-divider" />
          <view class="stat-item"><text class="stat-value">{{ showAsset ? consumerPointsDisplay : '****' }}</text><text class="stat-label">消费积分</text></view>
          <view class="stat-divider" />
          <view class="stat-item"><text class="stat-value">{{ showAsset ? `¥${balanceDisplay}` : '****' }}</text><text class="stat-label">账户余额</text></view>
        </view>
      </view>
    </view>

    <!-- 未登录 -->
    <view v-if="!loggedIn" class="login-prompt" @click="goLogin">
      <text class="login-prompt__text">登录后查看资产详情</text>
      <text class="login-prompt__btn">立即登录 ›</text>
    </view>

    <!-- 增值服务入口 -->
    <view class="services-section">
      <view class="section-head"><text class="section-title">增值服务</text></view>
      <view class="service-list">
        <view v-for="svc in services" :key="svc.id" class="service-card" :class="`service-card--${svc.id}`" @click="goService(svc)">
          <view class="service-card__glow" />
          <view class="service-card__inner">
            <view class="service-card__icon-wrap" :style="{ background: svc.iconBg }">
              <text class="service-card__icon">{{ svc.icon }}</text>
            </view>
            <view class="service-card__info">
              <text class="service-card__name">{{ svc.name }}</text>
              <text class="service-card__desc">{{ svc.desc }}</text>
              <view class="service-card__tag"><text>{{ svc.tag }}</text></view>
            </view>
          </view>
          <view class="service-card__arrow">›</view>
        </view>
      </view>
    </view>

    <!-- 我的投资入口 -->
    <view v-if="loggedIn" class="invest-banner" @click="goMyInvest">
      <view class="invest-banner__left">
        <text class="invest-banner__title">我的投资</text>
        <text class="invest-banner__sub">查看全部投资记录</text>
      </view>
      <text class="invest-banner__arrow">›</text>
    </view>

    <!-- 投资记录 -->
    <view v-if="loggedIn" class="invest-history">
      <view class="section-head"><text class="section-title">最近投资</text></view>
      <view v-if="loadingInvestRecords" class="record-tip"><text>加载中...</text></view>
      <view v-else-if="investRecords.length === 0" class="record-tip"><text>暂无投资记录</text></view>
      <view v-else class="record-list">
        <view v-for="record in investRecords.slice(0, 3)" :key="record.id" class="record-item">
          <view class="record-icon">{{ record.icon }}</view>
          <view class="record-info">
            <text class="record-name">{{ record.name }}</text>
            <text class="record-date">{{ record.date }}</text>
          </view>
          <view class="record-profit" :class="{ positive: record.profit > 0, negative: record.profit < 0 }">
            <text>{{ record.profit > 0 ? '+' : '' }}{{ record.profit }}积分</text>
          </view>
        </view>
      </view>
    </view>

    <view class="safe-bottom" :style="{ height: (120 + safeAreaBottom) + 'px' }" />
    <LuxuryTabbar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { checkAuth } from '@/utils/auth'
import { assetStore } from '@/store/asset'
import { financialApi } from '@/utils/api'
import LuxuryTabbar from '@/components/LuxuryTabbar.vue'

const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const loggedIn = ref(checkAuth())
const showAsset = ref(true)
const loadingInvestRecords = ref(false)

const ecoPointsDisplay = computed(() => assetStore.ecoPointsDisplay)
const consumerPointsDisplay = computed(() => assetStore.consumerPointsDisplay)
const balanceDisplay = computed(() => assetStore.balanceDisplay)
const yesterdayProfitDisplay = computed(() => assetStore.yesterdayProfitDisplay)

const services = [
  { id: 'compute', name: '算力中心', icon: '🧮', desc: '数字资产算力增值', tag: '年化 8-15%', iconBg: 'rgba(184,152,118,0.10)', gradient: 'dark' },
  { id: 'crossborder', name: '跨境电商', icon: '🌐', desc: '全球好物 积分兑换', tag: '新品上架', iconBg: 'rgba(184,152,118,0.10)', gradient: 'light' },
  { id: 'quant', name: '量化交易', icon: '📊', desc: '智能量化 稳健套利', tag: '专业策略', iconBg: 'rgba(184,152,118,0.10)', gradient: 'dark' },
]

interface InvestRecord { id: number; name: string; icon: string; date: string; profit: number; [k: string]: unknown }
interface ServiceItem { id: string; name: string; icon: string; desc: string; tag: string; iconBg: string; gradient: string; [k: string]: unknown }
interface EarningsRecord { id: number; productName: string; profit: string; createdAt: string; [k: string]: unknown }
const investRecords = ref<InvestRecord[]>([])

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
})

onShow(() => {
  loggedIn.value = checkAuth()
  if (loggedIn.value) { assetStore.fetchBalance(); loadInvestRecords() }
})

function loadInvestRecords() {
  loadingInvestRecords.value = true
  financialApi.getEarnings({ limit: 5 })
    .then((res) => {
      const list = (res.list || []).slice(0, 5)
      investRecords.value = list.map((item: EarningsRecord, idx: number) => ({
        id: item.id || idx,
        icon: '🧮',
        name: item.productName || '投资收益',
        date: item.createdAt ? item.createdAt.slice(0, 10) : '',
        profit: Number(item.profit || 0),
      }))
    })
    .catch(() => { investRecords.value = [] })
    .finally(() => { loadingInvestRecords.value = false })
}

function toggleAsset() { showAsset.value = !showAsset.value }
function goLogin() { uni.navigateTo({ url: '/pages/auth/login' }) }
function goService(svc: ServiceItem) {
  if (!checkAuth()) return
  if (svc.id === 'compute') { uni.navigateTo({ url: '/pages/wealth/my-invest' }) }
  else { uni.showToast({ title: `${svc.name}开发中`, icon: 'none' }) }
}
function goMyInvest() { if (!checkAuth()) return; uni.navigateTo({ url: '/pages/wealth/my-invest' }) }
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page {
  min-height: 100vh;
  background: $bg-primary;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

$gap-4: 4rpx; $gap-8: 8rpx; $gap-16: 16rpx; $gap-24: 24rpx; $gap-base: 16rpx; $gap-lg: 24rpx; $gap-sm: 8rpx;

.status-bar { width: 100%; }

.page-header {
  padding: 12rpx $gap-16 0;
  display: flex; flex-direction: column; gap: 4rpx;
  .page-title { font-size: 40rpx; font-weight: 700; color: $mineral-gray; letter-spacing: 1rpx; }
  .page-sub { font-size: 24rpx; color: $text-muted; }
}

// 资产总览卡
.asset-overview {
  position: relative; margin: $gap-16; border-radius: $radius-2xl; overflow: hidden; box-shadow: 0 16rpx 64rpx rgba(0,0,0,0.22);
  &__bg { position: absolute; inset: 0; background: linear-gradient(145deg, #F5F2ED 0%, #EDE9E1 50%, #F0EDE8 100%); z-index: 0; }
  &__inner { position: relative; z-index: 1; padding: $gap-lg; }
  &__top { margin-bottom: $gap-lg; }
  &__label { font-size: 22rpx; color: rgba(47,53,66,0.5); display: block; margin-bottom: 8rpx; }
  &__value { font-family: $font-sans; font-size: 52rpx; font-weight: 700; color: $accent-dark; letter-spacing: -1rpx; font-variant-numeric: tabular-nums; }
  &__eye { display: inline-block; font-size: 28rpx; margin-left: 12rpx; opacity: 0.7; }
  &__stats { display: flex; align-items: center; padding-top: $gap-base; border-top: 1rpx solid rgba(255,255,255,0.08); }
}

.asset-label-row { display: flex; align-items: center; }

.stat-item { flex: 1; text-align: center; .stat-value { display: block; font-family: $font-sans; font-size: 28rpx; font-weight: 700; color: $accent-dark; font-variant-numeric: tabular-nums; margin-bottom: 4rpx; } .stat-label { display: block; font-size: 18rpx; color: rgba(47,53,66,0.5); } }
.stat-divider { width: 1rpx; height: 48rpx; background: rgba(255,255,255,0.08); }

// 未登录
.login-prompt {
  margin: $gap-16; padding: $gap-lg; background: rgba(255,255,255,0.88); backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255,255,255,0.6); border-radius: $radius-xl; box-shadow: $clay-shadow;
  display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;
  &__text { font-size: 28rpx; color: $text-secondary; font-weight: 500; }
  &__btn { font-size: 26rpx; color: $accent-dark; font-weight: 600; }
}

// 服务卡片
.services-section { padding: 0 $gap-16; margin-bottom: $gap-16; }

.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: $gap-16; }
.section-title { font-size: 32rpx; font-weight: 700; color: $mineral-gray; letter-spacing: 0.5rpx; }

.service-list { display: flex; flex-direction: column; gap: $gap-base; }

.service-card {
  position: relative; border-radius: $radius-xl; overflow: hidden;
  background: rgba(255,255,255,0.92); box-shadow: $clay-shadow;
  transition: transform 0.2s ease; box-sizing: border-box;
  &:active { transform: scale(0.98); }

  &__glow { position: absolute; top: -20%; right: -10%; width: 55%; height: 100%; background: radial-gradient(circle, rgba(184,152,118,0.15) 0%, transparent 65%); pointer-events: none; z-index: 0; }
  &__inner { position: relative; z-index: 1; display: flex; align-items: center; gap: $gap-base; padding: 28rpx $gap-lg; }
  &__icon-wrap { width: 88rpx; height: 88rpx; display: flex; align-items: center; justify-content: center; border-radius: $radius-xl; border: 1rpx solid rgba(184,152,118,0.15); flex-shrink: 0; box-sizing: border-box; .service-card__icon { font-size: 40rpx; } }
  &__info { flex: 1; min-width: 0; }
  &__name { display: block; font-size: 30rpx; font-weight: 700; color: $accent-dark; margin-bottom: 6rpx; }
  &__desc { display: block; font-size: 22rpx; color: $text-muted; margin-bottom: 10rpx; }
  &__tag { display: inline-flex; padding: 4rpx 12rpx; border-radius: 20rpx; background: rgba(184,152,118,0.08); border: 1rpx solid rgba(184,152,118,0.20); font-size: 20rpx; font-weight: 600; color: $accent-dark; box-sizing: border-box; }
  &__arrow { font-size: 40rpx; color: $text-muted; flex-shrink: 0; }
}

// 我的投资
.invest-banner {
  margin: 0 $gap-16 $gap-16; padding: $gap-base $gap-lg; background: rgba(255,255,255,0.88); backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255,255,255,0.6); border-radius: $radius-xl; box-shadow: $clay-shadow;
  display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;
  &__left { flex: 1; }
  &__title { display: block; font-size: 28rpx; font-weight: 700; color: $text-primary; margin-bottom: 4rpx; }
  &__sub { display: block; font-size: 22rpx; color: $text-muted; }
  &__arrow { font-size: 36rpx; color: $text-muted; }
}

// 投资记录
.invest-history { padding: 0 $gap-16; }

.record-tip { display: flex; justify-content: center; align-items: center; padding: 40rpx 0; text { font-size: 26rpx; color: $text-muted; } }

.record-list { display: flex; flex-direction: column; gap: $gap-sm; }

.record-item {
  display: flex; align-items: center; gap: $gap-base; padding: $gap-base;
  background: rgba(255,255,255,0.88); backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255,255,255,0.6); border-radius: $radius-lg; box-shadow: $clay-shadow; box-sizing: border-box;
}

.record-icon { width: 64rpx; height: 64rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; background: rgba(47,53,66,0.06); border-radius: $radius-md; flex-shrink: 0; }
.record-info { flex: 1; min-width: 0; .record-name { display: block; font-size: 28rpx; font-weight: 600; color: $text-primary; margin-bottom: 4rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .record-date { display: block; font-size: 22rpx; color: $text-muted; } }
.record-profit { font-family: $font-sans; font-size: 28rpx; font-weight: 700; font-variant-numeric: tabular-nums; &.positive { color: $success; } &.negative { color: $danger; } }

.safe-bottom { width: 100%; }
</style>
