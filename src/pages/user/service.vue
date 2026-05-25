<template>
  <view class="page-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">客服中心</text>
      <view class="page-nav__action" @click="goCreate"><text>提交工单</text></view>
    </view>

    <view v-if="onlineInfo" class="online-card">
      <view class="online-card__row">
        <view class="online-card__dot" />
        <text class="online-card__status">在线客服</text>
      </view>
      <text class="online-card__tip">{{ onlineInfo.tip || '提交工单后客服将尽快回复' }}</text>
      <text v-if="onlineInfo.workTime" class="online-card__time">服务时间 {{ onlineInfo.workTime }}</text>
      <text v-if="onlineInfo.hotline" class="online-card__time">热线 {{ onlineInfo.hotline }}</text>
    </view>

    <scroll-view scroll-y class="ticket-list" @scrolltolower="loadMore">
      <view v-if="loading && !list.length" class="loading-wrap">
        <view class="loading-spinner" />
        <text>加载中...</text>
      </view>

      <view
        v-for="item in list"
        :key="item.ticketId"
        class="ticket-card"
        @click="goDetail(item)"
      >
        <view class="ticket-card__head">
          <text class="ticket-card__no">{{ item.ticketNo }}</text>
          <view class="ticket-card__status">
            <text>{{ item.statusName }}</text>
          </view>
        </view>
        <text class="ticket-card__title">{{ item.title }}</text>
        <text class="ticket-card__type">{{ item.typeName }}</text>
        <view class="ticket-card__footer">
          <text class="ticket-card__msg">{{ item.lastMessage || '等待客服回复' }}</text>
          <text class="ticket-card__arrow">›</text>
        </view>
      </view>

      <view v-if="!loading && !list.length" class="empty-state">
        <view class="empty-state__icon">工</view>
        <text class="empty-state__text">暂无工单</text>
        <text class="empty-state__sub">点击右上角提交工单</text>
      </view>

      <view v-if="loading && list.length" class="load-more">
        <view class="loading-spinner" />
        <text>加载中...</text>
      </view>

      <view v-if="!hasMore && list.length > 0" class="no-more">
        <text>— 没有更多了 —</text>
      </view>

      <view class="list-bottom" :style="{ height: (100 + safeAreaBottom) + 'px' }" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ticketApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'

interface TicketItem {
  ticketId: string
  ticketNo: string
  title: string
  typeName: string
  statusName: string
  lastMessage?: string
  [key: string]: unknown
}

interface OnlineInfo {
  tip?: string
  workTime?: string
  hotline?: string
  [key: string]: unknown
}

const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const list = ref<TicketItem[]>([])
const onlineInfo = ref<OnlineInfo | null>(null)
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
let reqSeq = 0

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
  loadOnlineInfo()
  if (checkAuth()) loadData(true)
})

async function loadOnlineInfo() {
  try {
    onlineInfo.value = await ticketApi.getOnline<OnlineInfo>() || null
  } catch {
    onlineInfo.value = { tip: '提交工单后客服将尽快回复', workTime: '09:00-21:00' }
  }
}

async function loadData(reset = false) {
  if (loading.value) return
  if (!reset && !hasMore.value) return
  if (reset) { page.value = 1; hasMore.value = true }
  loading.value = true
  const seq = ++reqSeq
  try {
    const res = await ticketApi.getList<{ list: TicketItem[] }>({ page: page.value, limit: 20 })
    if (seq !== reqSeq) return
    const rows = res?.list || []
    if (reset) list.value = rows
    else list.value.push(...rows)
    hasMore.value = rows.length >= 20
    page.value++
  } catch {
    if (seq !== reqSeq) return
  } finally {
    if (seq === reqSeq) loading.value = false
  }
}

function loadMore() {
  if (hasMore.value && !loading.value) loadData(false)
}

function goBack() { uni.navigateBack() }
function goCreate() {
  if (!checkAuth()) return
  uni.navigateTo({ url: '/pages/user/service-create' })
}
function goDetail(item: TicketItem) {
  uni.navigateTo({ url: `/pages/user/service-detail?id=${item.ticketId}` })
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

  &__back {
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

  &__action {
    font-size: 26rpx;
    font-weight: 700;
    color: $accent-dark;
    flex-shrink: 0;
  }
}

// ========== 在线客服卡片 ==========
.online-card {
  margin: $spacing-base;
  padding: $spacing-base $spacing-lg;
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.60);
  border-radius: $radius-lg;
  box-shadow: $clay-shadow;
  display: flex;
  flex-direction: column;
  gap: 6rpx;

  &__row {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  &__dot {
    width: 12rpx; height: 12rpx;
    background: $success;
    border-radius: 50%;
    box-shadow: 0 0 8rpx rgba(61, 139, 110, 0.5);
  }

  &__status {
    font-size: 28rpx;
    font-weight: 700;
    color: $text-primary;
  }

  &__tip {
    font-size: 24rpx;
    color: $text-secondary;
    margin-top: 4rpx;
  }

  &__time {
    font-size: 22rpx;
    color: $text-muted;
  }
}

// ========== 工单列表 ==========
.ticket-list {
  flex: 1;
  padding: 0 $spacing-base;
}

.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 80rpx;
  font-size: 28rpx;
  color: $text-muted;
}

.loading-spinner {
  width: 48rpx; height: 48rpx;
  border: 3rpx solid rgba(184, 152, 118, 0.2);
  border-top-color: $accent-dark;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.ticket-card {
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.60);
  border-radius: $radius-lg;
  box-shadow: $clay-shadow;
  padding: $spacing-base $spacing-lg;
  margin-bottom: $spacing-base;
  transition: transform 0.2s ease;

  &:active { transform: scale(0.99); }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8rpx;
  }

  &__no {
    font-size: 22rpx;
    color: $text-muted;
    font-variant-numeric: tabular-nums;
  }

  &__status {
    padding: 4rpx 16rpx;
    background: rgba(184, 152, 118, 0.12);
    border: 1rpx solid rgba(184, 152, 118, 0.25);
    border-radius: $radius-full;

    text {
      font-size: 20rpx;
      font-weight: 700;
      color: $accent-dark;
    }
  }

  &__title {
    font-size: 28rpx;
    font-weight: 700;
    color: $text-primary;
    display: block;
    margin-bottom: 4rpx;
  }

  &__type {
    font-size: 22rpx;
    color: $text-muted;
    display: block;
    margin-bottom: 8rpx;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__msg {
    font-size: 24rpx;
    color: $text-secondary;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    font-size: 36rpx;
    color: $text-muted;
    flex-shrink: 0;
  }
}

// ========== 空/加载状态 ==========
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;

  &__icon {
    width: 100rpx; height: 100rpx;
    line-height: 100rpx; text-align: center;
    font-size: 40rpx; font-weight: 800;
    background: $warm-yellow;
    border: 1rpx solid $border-primary;
    border-radius: 50%;
    color: $accent-dark;
    margin-bottom: 20rpx;
  }

  &__text {
    font-size: 30rpx; font-weight: 600; color: $text-primary; margin-bottom: 8rpx;
  }

  &__sub { font-size: 26rpx; color: $text-muted; }
}

.load-more, .no-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: $spacing-lg 0;
  font-size: 24rpx;
  color: $text-muted;
}

.list-bottom { width: 100%; }
</style>
