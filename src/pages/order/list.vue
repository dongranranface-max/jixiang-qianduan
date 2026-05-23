<template>
  <view class="page-container">
    <AssetStatusBar v-if="loggedIn" />
    <view v-else class="safe-area-top" :style="{ height: statusBarHeight + 'px' }" />

    <!-- 页面导航 -->
    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">我的订单</text>
    </view>

    <!-- Tab 切换 -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-bar__item"
        :class="{ active: currentTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view class="order-scroll" scroll-y @scrolltolower="loadMore">
      <!-- 骨架屏 -->
      <view v-if="loading && !orders.length" class="order-list">
        <view v-for="i in 3" :key="i" class="sk-card">
          <view class="sk-head shimmer" />
          <view class="sk-items">
            <view class="sk-product shimmer" />
          </view>
          <view class="sk-foot shimmer" />
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!orders.length" class="empty-state">
        <view class="empty-state__icon">单</view>
        <text class="empty-state__text">暂无订单</text>
        <text class="empty-state__sub">去商城发现好物吧</text>
        <view class="empty-state__btn" @click="goCatalog">
          <text>去逛逛</text>
        </view>
      </view>

      <!-- 订单卡片 -->
      <view v-else class="order-list">
        <view v-for="order in orders" :key="order.orderNo" class="order-card">
          <!-- 订单头 -->
          <view class="order-card__head">
            <text class="order-card__type">{{ typeName(order.orderType) }}</text>
            <text class="order-card__status" :class="`status--${order.status}`">
              {{ statusName(order.status) }}
            </text>
          </view>

          <!-- 商品项 -->
          <view
            v-for="item in (order.items || []).slice(0, 2)"
            :key="item.productId || item.id"
            class="order-item"
            @click="goDetail(order)"
          >
            <image
              class="order-item__img"
              :src="item.coverImage || item.image"
              mode="aspectFill"
            />
            <view class="order-item__info">
              <text class="order-item__name">{{ item.productName || item.name }}</text>
              <text class="order-item__spec">{{ item.specs || item.skuInfo }} ×{{ item.quantity }}</text>
            </view>
            <text class="order-item__price">
              {{ order.orderType === 3 ? `${item.points || 0}积分` : `¥${item.price}` }}
            </text>
          </view>

          <view v-if="(order.items || []).length > 2" class="order-more">
            <text>查看全部 {{ order.items.length }} 件商品 ›</text>
          </view>

          <!-- 订单底部 -->
          <view class="order-card__foot">
            <view class="order-card__time">{{ formatTime(order.createdAt) }}</view>
            <view class="order-card__amount">
              <text class="order-card__amount-label">{{ order.orderType === 3 ? '合计' : '实付' }}</text>
              <text class="order-card__amount-value">
                {{ order.orderType === 3 ? `${order.pointsEarned || 0}积分` : `¥${order.payAmount}` }}
              </text>
            </view>
          </view>

          <!-- 积分返还提示 -->
          <view v-if="order.pointsEarned && order.status >= 3" class="order-card__bonus">
            <text>🎁 获得 {{ order.pointsEarned }} 生态积分</text>
          </view>

          <!-- 操作按钮 -->
          <view class="order-card__actions">
            <view v-if="order.status === 1" class="action-btn action-btn--ghost" @click.stop="cancelOrder(order)">
              取消
            </view>
            <view v-if="order.status === 1" class="action-btn action-btn--primary" @click.stop="payOrder(order)">
              去支付
            </view>
            <view v-if="order.status === 3" class="action-btn action-btn--primary" @click.stop="confirmOrder(order)">
              确认收货
            </view>
            <view v-if="order.status === 4" class="action-btn action-btn--ghost" @click.stop="applyRefund(order)">
              申请退款
            </view>
          </view>
        </view>
      </view>

      <view v-if="!hasMore && orders.length > 0" class="no-more">
        <text>— 没有更多了 —</text>
      </view>
    </scroll-view>

    <view class="safe-area-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { orderApi } from '@/utils/api'
import { checkAuth, requireAuth } from '@/utils/auth'
import { assetStore } from '@/store/asset'
import AssetStatusBar from '@/components/AssetStatusBar.vue'

const statusBarHeight = ref(20)
const loggedIn = ref(checkAuth())
const currentTab = ref('all')
const orders = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

const tabs = [
  { key: 'all', label: '全部' },
  { key: '1', label: '待付款' },
  { key: '3', label: '待收货' },
  { key: '4', label: '已完成' },
]

function statusName(s: number) {
  const map: Record<number, string> = {
    1: '待付款', 2: '待发货', 3: '待收货', 4: '已完成', 5: '已取消',
  }
  return map[s] || '未知'
}

function typeName(t: number) {
  const map: Record<number, string> = { 1: '消费订单', 2: '换购订单', 3: '兑换订单' }
  return map[t] || '订单'
}

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 20
  if (requireAuth()) loadOrders()
})

onShow(() => {
  loggedIn.value = checkAuth()
  if (!loggedIn.value) return
  assetStore.fetchBalance()
  orders.value = []
  page.value = 1
  hasMore.value = true
  loadOrders()
})

async function loadOrders() {
  if (loading.value || !checkAuth()) return
  loading.value = true
  try {
    const params: Record<string, number> = { page: page.value, limit: 20 }
    if (currentTab.value !== 'all') params.status = Number(currentTab.value)
    const res = await orderApi.getList(params)
    const list = res.list || []
    orders.value = page.value === 1 ? list : [...orders.value, ...list]
    hasMore.value = list.length >= 20
    page.value++
  } catch {
    if (page.value === 1) orders.value = []
  } finally {
    loading.value = false
  }
}

function switchTab(key: string) {
  if (currentTab.value === key) return
  currentTab.value = key
  orders.value = []
  page.value = 1
  hasMore.value = true
  loadOrders()
}

function loadMore() {
  if (hasMore.value && !loading.value) loadOrders()
}

function goBack() { uni.navigateBack() }
function goCatalog() { uni.switchTab({ url: '/pages/catalog/index' }) }
function goDetail(order: any) {
  uni.navigateTo({ url: `/pages/order/confirm?orderNo=${order.orderNo}` })
}

async function cancelOrder(order: any) {
  try {
    await orderApi.cancel(order.orderNo)
    uni.showToast({ title: '已取消', icon: 'success' })
    switchTab(currentTab.value)
  } catch (e: any) {
    uni.showToast({ title: e.message || '取消失败', icon: 'none' })
  }
}

async function confirmOrder(order: any) {
  try {
    await orderApi.confirm(order.orderNo)
    uni.showToast({ title: '已确认收货', icon: 'success' })
    assetStore.fetchBalance()
    switchTab(currentTab.value)
  } catch (e: any) {
    uni.showToast({ title: e.message || '操作失败', icon: 'none' })
  }
}

function payOrder(order: any) {
  if (order.qrCode) {
    uni.showToast({ title: '请使用微信扫码支付', icon: 'none' })
  } else {
    uni.showToast({ title: '等待支付渠道配置', icon: 'none' })
  }
}

async function applyRefund(order: any) {
  try {
    await orderApi.applyRefund(order.orderNo, { reason: 1, description: '用户申请退款' })
    uni.showToast({ title: '退款申请已提交', icon: 'success' })
    switchTab(currentTab.value)
  } catch (e: any) {
    uni.showToast({ title: e.message || '申请失败', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, #F9F9F9 0%, #F0EDE8 100%);
  display: flex;
  flex-direction: column;
}

.safe-area-top { width: 100%; }

.page-nav {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx $spacing-base;

  &__back {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border: 1rpx solid rgba(20, 20, 20, 0.06);
    border-radius: 50%;
    font-size: 28rpx;
    color: $mineral-gray;
    flex-shrink: 0;
  }

  &__title {
    flex: 1;
    font-size: 32rpx;
    font-weight: 700;
    color: $mineral-gray;
    text-align: center;
    letter-spacing: 0.5rpx;
  }
}

.tab-bar {
  display: flex;
  padding: 0 $spacing-base $spacing-sm;
  gap: 8rpx;
  overflow-x: auto;

  &__item {
    flex-shrink: 0;
    height: 68rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: 500;
    color: $text-muted;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(8px);
    border: 1rpx solid rgba(20, 20, 20, 0.06);
    border-radius: $radius-lg;
    transition: all 0.25s ease;

    &.active {
      color: $accent-dark;
      background: $warm-yellow;
      border-color: $border-primary;
      font-weight: 700;
      box-shadow: $shadow-gold;
    }
  }
}

.order-scroll {
  flex: 1;
  height: calc(100vh - 280rpx);
  padding: 0 $spacing-base;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
  padding-bottom: $spacing-base;
}

.order-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.6);
  border-radius: $radius-lg;
  box-shadow: $clay-shadow;
  padding: $spacing-base;
  overflow: hidden;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }

  &__type {
    font-size: 24rpx;
    font-weight: 600;
    color: $mineral-gray;
  }

  &__status {
    font-size: 26rpx;
    font-weight: 700;
    color: $accent-dark;

    &.status--4, &.status--5 {
      color: $text-muted;
    }
    &.status--3 {
      color: $success;
    }
  }

  &__foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid $border-light;
  }

  &__time {
    font-size: 22rpx;
    color: $text-muted;
  }

  &__amount {
    display: flex;
    align-items: baseline;
    gap: 6rpx;
  }

  &__amount-label {
    font-size: 22rpx;
    color: $text-muted;
  }

  &__amount-value {
    font-family: $asset-balance-font;
    font-size: 32rpx;
    font-weight: 700;
    color: $mineral-gray;
    font-variant-numeric: tabular-nums;
  }

  &__bonus {
    margin-top: 12rpx;
    padding: 10rpx 16rpx;
    background: $warm-yellow;
    border: 1rpx solid $border-primary;
    border-radius: $radius-md;
    font-size: 22rpx;
    color: $accent-dark;
    font-weight: 600;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12rpx;
    margin-top: 16rpx;
  }
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx 0;
  border-bottom: 1rpx solid $border-light;

  &:last-of-type { border-bottom: none; }

  &__img {
    width: 120rpx;
    height: 120rpx;
    border-radius: $radius-md;
    background: $bg-tertiary;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6rpx;
  }

  &__name {
    font-size: 28rpx;
    font-weight: 600;
    color: $text-primary;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 1.4;
  }

  &__spec {
    font-size: 22rpx;
    color: $text-muted;
  }

  &__price {
    font-size: 28rpx;
    font-weight: 700;
    color: $mineral-gray;
    flex-shrink: 0;
  }
}

.order-more {
  text-align: center;
  padding: 12rpx;
  font-size: 24rpx;
  color: $text-muted;
}

.action-btn {
  height: 60rpx;
  padding: 0 28rpx;
  border-radius: $radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 600;
  transition: all 0.2s ease;

  &--primary {
    background: $btn-gold-gradient;
    box-shadow: $btn-gold-shadow;
    color: #fff;

    &:active { transform: scale(0.97); }
  }

  &--ghost {
    background: transparent;
    border: 1.5rpx solid $border-color;
    color: $text-secondary;

    &:active {
      background: rgba(47, 53, 66, 0.04);
    }
  }
}

// 骨架屏
.sk-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: $radius-lg;
  padding: $spacing-base;
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  .sk-head {
    height: 28rpx;
    width: 40%;
    border-radius: 8rpx;
    background: $bg-tertiary;
  }

  .sk-items {
    .sk-product {
      height: 120rpx;
      border-radius: $radius-md;
      background: $bg-tertiary;
    }
  }

  .sk-foot {
    height: 28rpx;
    width: 60%;
    border-radius: 8rpx;
    background: $bg-tertiary;
    align-self: flex-end;
  }
}

.shimmer { animation: shim 1.4s ease-in-out infinite; }

@keyframes shim {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}

.no-more {
  text-align: center;
  padding: $spacing-base;
  font-size: 26rpx;
  color: $text-muted;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 40rpx;
  text-align: center;

  &__icon {
    width: 140rpx;
    height: 140rpx;
    line-height: 140rpx;
    text-align: center;
    font-size: 56rpx;
    font-weight: 800;
    background: $warm-yellow;
    border: 1rpx solid $border-primary;
    border-radius: 50%;
    color: $accent-dark;
    margin-bottom: 32rpx;
  }

  &__text {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 12rpx;
  }

  &__sub {
    font-size: 26rpx;
    color: $text-muted;
    margin-bottom: 40rpx;
  }

  &__btn {
    height: 80rpx;
    padding: 0 56rpx;
    background: $btn-gold-gradient;
    border-radius: $radius-full;
    box-shadow: $btn-gold-shadow;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 30rpx;
      font-weight: 700;
      color: #fff;
      letter-spacing: 1rpx;
    }
  }
}
</style>
