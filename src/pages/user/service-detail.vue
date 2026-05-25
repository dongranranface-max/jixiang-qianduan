<template>
  <view class="page-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">工单详情</text>
      <view class="page-nav__action" />
    </view>

    <view v-if="detail.ticketId" class="head-card">
      <text class="head-card__title">{{ detail.title }}</text>
      <text class="head-card__meta">
        {{ detail.ticketNo }} · {{ detail.typeName }} · {{ detail.statusName }}
      </text>
    </view>

    <scroll-view scroll-y class="msg-scroll" @scrolltolower="loadMore">
      <view v-if="loading && !detail.ticketId" class="loading-wrap">
        <view class="loading-spinner" />
        <text>加载中...</text>
      </view>

      <view
        v-for="(msg, i) in detail.messages"
        :key="i"
        class="msg-bubble"
        :class="msg.role === 'admin' ? 'msg-bubble--admin' : 'msg-bubble--user'"
      >
        <view class="msg-bubble__role">
          <text>{{ msg.role === 'admin' ? '客服' : '我' }}</text>
        </view>
        <view class="msg-bubble__content">
          <text>{{ msg.content }}</text>
        </view>
      </view>

      <view v-if="!loading && !detail.messages?.length && detail.ticketId" class="empty-msg">
        <text>暂无消息记录</text>
      </view>

      <view class="scroll-bottom" :style="{ height: (replyBarHeight + safeAreaBottom) + 'px' }" />
    </scroll-view>

    <view v-if="detail.status && detail.status < 4" class="reply-bar">
      <input
        v-model="replyText"
        class="reply-bar__input"
        placeholder="补充说明..."
        placeholder-class="reply-bar__placeholder"
        @confirm="sendReply"
      />
      <view class="reply-bar__btn" @click="sendReply">
        <text>发送</text>
      </view>
    </view>

    <view v-if="detail.status === 3" class="confirm-bar">
      <view class="confirm-bar__btn" @click="confirmResolved">
        <text>确认已解决</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { ticketApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'

interface TicketMessage {
  role: 'admin' | 'user'
  content: string
  createdAt?: string
}

interface TicketDetail {
  ticketId?: string
  ticketNo?: string
  title?: string
  typeName?: string
  statusName?: string
  status?: number
  messages?: TicketMessage[]
  [key: string]: unknown
}

const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const ticketId = ref('')
const detail = ref<TicketDetail>({})
const loading = ref(false)
const replyText = ref('')
const replyBarHeight = computed(() => {
  const sys = uni.getSystemInfoSync()
  return (sys.safeAreaInsets?.bottom || 0) + 100
})

onLoad((q) => {
  ticketId.value = (q?.id as string) || ''
})

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
  if (checkAuth() && ticketId.value) loadDetail()
})

async function loadDetail() {
  loading.value = true
  try {
    detail.value = await ticketApi.getDetail<TicketDetail>(ticketId.value) || {}
  } catch (err: { message?: string }) {
    uni.showToast({ title: err?.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function loadMore() {}

function goBack() { uni.navigateBack() }

async function sendReply() {
  if (!replyText.value.trim()) return
  const text = replyText.value.trim()
  replyText.value = ''
  try {
    await ticketApi.reply(ticketId.value, { content: text })
    uni.showToast({ title: '已发送', icon: 'success' })
    await loadDetail()
  } catch (err: { message?: string }) {
    uni.showToast({ title: err?.message || '发送失败', icon: 'none' })
    replyText.value = text
  }
}

async function confirmResolved() {
  try {
    await ticketApi.confirm(ticketId.value)
    uni.showToast({ title: '已确认', icon: 'success' })
    await loadDetail()
  } catch (err: { message?: string }) {
    uni.showToast({ title: err?.message || '操作失败', icon: 'none' })
  }
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

  &__back, &__action {
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
}

// ========== 工单头卡 ==========
.head-card {
  margin: $spacing-base;
  padding: $spacing-base $spacing-lg;
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255, 255, 255, 0.60);
  border-radius: $radius-lg;
  box-shadow: $clay-shadow;

  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: $text-primary;
    display: block;
    margin-bottom: 8rpx;
  }

  &__meta {
    font-size: 22rpx;
    color: $text-muted;
    display: block;
  }
}

// ========== 消息列表 ==========
.msg-scroll {
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

.msg-bubble {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: $spacing-base;

  &--user { align-items: flex-end; }

  &--admin { align-items: flex-start; }

  &__role {
    text {
      font-size: 20rpx;
      color: $text-muted;
    }
  }

  &__content {
    max-width: 70%;
    padding: $spacing-base;
    border-radius: $radius-lg;
    line-height: 1.6;

    text {
      font-size: 28rpx;
      color: $text-primary;
    }
  }

  &--user &__content {
    background: rgba(184, 152, 118, 0.15);
    border: 1rpx solid rgba(184, 152, 118, 0.20);
    border-bottom-right-radius: 8rpx;
  }

  &--admin &__content {
    background: rgba(255, 255, 255, 0.90);
    border: 1rpx solid rgba(255, 255, 255, 0.60);
    border-bottom-left-radius: 8rpx;
    box-shadow: $clay-shadow;
  }
}

.empty-msg {
  text-align: center;
  padding: 80rpx;
  font-size: 26rpx;
  color: $text-muted;
}

.scroll-bottom { width: 100%; }

// ========== 回复栏 ==========
.reply-bar {
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx $spacing-base;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: rgba(249, 249, 249, 0.95);
  backdrop-filter: blur(16px);
  border-top: 1rpx solid $border-light;

  &__input {
    flex: 1;
    height: 80rpx;
    padding: 0 $spacing-base;
    background: rgba(47, 53, 66, 0.06);
    border-radius: 40rpx;
    font-size: 28rpx;
    color: $text-primary;
  }

  &__placeholder { color: $text-muted; font-size: 28rpx; }

  &__btn {
    width: 96rpx;
    height: 72rpx;
    background: $accent-gradient;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    text {
      font-size: 26rpx;
      font-weight: 700;
      color: #fff;
    }
  }
}

// ========== 确认解决 ==========
.confirm-bar {
  position: sticky;
  left: $spacing-base;
  right: $spacing-base;
  bottom: calc(16rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);

  &__btn {
    height: 88rpx;
    background: $success;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 32rpx rgba(61, 139, 110, 0.25);

    text {
      font-size: 30rpx;
      font-weight: 700;
      color: #fff;
    }
  }
}
</style>
