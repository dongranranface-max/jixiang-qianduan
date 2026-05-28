<template>
  <view class="page">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <!-- 页面导航 -->
    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">购物车</text>
      <view class="page-nav__action" @click="goHome"><text>首</text></view>
    </view>

    <!-- 商城分组 Tab -->
    <view class="mall-group-tabs">
      <view v-for="group in groups" :key="group.type" class="mall-group-tab" :class="{ active: currentGroup === group.type }" @click="switchGroup(group.type)">
        <text class="mall-group-tab__abbr">{{ group.abbr }}</text>
        <text class="mall-group-tab__label">{{ group.label }}</text>
        <view v-if="getGroupCount(group.type) > 0" class="mall-group-tab__count">{{ getGroupCount(group.type) }}</view>
      </view>
    </view>

    <!-- 购物车列表 -->
    <scroll-view class="cart-scroll" scroll-y>
      <view v-if="loading" class="cart-list">
        <view v-for="i in 2" :key="i" class="sk-item">
          <view class="sk-check shimmer" />
          <view class="sk-img shimmer" />
          <view class="sk-info">
            <view class="sk-line shimmer" />
            <view class="sk-line sk-short shimmer" />
          </view>
        </view>
      </view>

      <view v-else-if="!filteredItems.length" class="empty-state">
        <view class="empty-state__icon">{{ currentGroup === 1 ? '购' : currentGroup === 2 ? '换' : '兑' }}</view>
        <text class="empty-state__text">购物车是空的</text>
        <text class="empty-state__sub">去{{ currentGroup === 1 ? '消费' : currentGroup === 2 ? '换购' : '兑换' }}商城发现好物吧</text>
        <view class="empty-state__btn" @click="goCatalog"><text>去逛逛</text></view>
      </view>

      <view v-else class="cart-list">
        <view v-for="item in filteredItems" :key="item.id" class="cart-item" :class="{ selected: item.selected }">
          <view class="cart-item__check" @click="toggleSelect(item)">
            <view class="check-circle" :class="{ 'is-selected': item.selected }"><text v-if="item.selected" class="check-mark">✓</text></view>
          </view>
          <image class="cart-item__img" :src="item.product?.coverImage || item.coverImage" mode="aspectFill" lazy-load />
          <view class="cart-item__info">
            <text class="cart-item__name">{{ item.product?.name || item.name }}</text>
            <view class="cart-item__price-row">
              <template v-if="item.type === 1">
                <text class="cart-item__cash">¥{{ item.price }}</text>
                <view class="cart-item__tag">返积分</view>
              </template>
              <template v-else-if="item.type === 2">
                <text class="cart-item__cash">¥{{ item.price }}</text>
                <view class="cart-item__tag cart-item__tag--gold">+{{ item.requiredPoints || 0 }}积分</view>
              </template>
              <template v-else>
                <text class="cart-item__points">{{ item.requiredPoints }}积分</text>
              </template>
            </view>
            <view class="cart-item__stepper">
              <view class="stepper-btn" @click="changeQty(item, -1)"><text>−</text></view>
              <text class="stepper-num">{{ item.quantity }}</text>
              <view class="stepper-btn" @click="changeQty(item, 1)"><text>+</text></view>
            </view>
          </view>
          <view class="cart-item__del" @click="removeItem(item)"><text>×</text></view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部结算栏 -->
    <view v-if="filteredItems.length" class="bottom-bar">
      <view class="bottom-bar__select" @click="toggleSelectAll">
        <view class="check-circle" :class="{ 'is-selected': allSelected }"><text v-if="allSelected" class="check-mark">✓</text></view>
        <text class="bottom-bar__select-label">全选</text>
      </view>
      <view class="bottom-bar__total">
        <text class="total-label">合计</text>
        <view class="total-amount">
          <text class="total-cash">¥{{ totalCash.toFixed(2) }}</text>
          <text v-if="totalPoints > 0" class="total-points">+{{ totalPoints }}积分</text>
        </view>
      </view>
      <view v-if="hasSelected" class="bottom-bar__delete" @click="removeSelected"><text>删除选中</text></view>
      <view class="bottom-bar__btn" :class="{ 'is-disabled': !hasSelected }" @click="goSettle"><text>结算 ({{ selectedCount }})</text></view>
    </view>

    <view class="safe-bottom" :style="{ height: (120 + safeAreaBottom) + 'px' }" />
    <LuxuryTabbar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { cartApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'
import { assetStore } from '@/store/asset'
import LuxuryTabbar from '@/components/LuxuryTabbar.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const statusBarHeight = ref(20)
const safeAreaBottom = ref(0)
const loggedIn = ref(checkAuth())
const currentGroup = ref(1)

interface CartItem { id: string; productId: string; type: number; name: string; coverImage?: string; product?: { name: string; coverImage: string }; price: string | number; requiredPoints?: number; quantity: number; selected?: boolean; [k: string]: unknown }

const cartItems = ref<CartItem[]>([])
const loading = ref(false)

const groups = [
  { type: 1, abbr: '消', label: '消费' },
  { type: 2, abbr: '换', label: '换购' },
  { type: 3, abbr: '兑', label: '兑换' },
]

const filteredItems = computed(() => cartItems.value.filter(item => item.type === currentGroup.value))
function getGroupCount(type: number) { return cartItems.value.filter(item => item.type === type).length }
const allSelected = computed(() => filteredItems.value.length > 0 && filteredItems.value.every((i: CartItem) => i.selected))
const selectedItems = computed(() => filteredItems.value.filter((i: CartItem) => i.selected))
const selectedCount = computed(() => selectedItems.value.length)
const totalCash = computed(() => selectedItems.value.reduce((s: number, i: CartItem) => s + Number(i.price) * i.quantity, 0))
const totalPoints = computed(() => selectedItems.value.reduce((s: number, i: CartItem) => s + ((i.requiredPoints || 0) * i.quantity), 0))
const hasSelected = computed(() => selectedCount.value > 0)

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeAreaBottom.value = sys.safeAreaInsets?.bottom || 0
})

onShow(() => {
  loggedIn.value = checkAuth()
  if (loggedIn.value) { assetStore.fetchBalance(); loadCart() }
})

async function loadCart() {
  loading.value = true
  try {
    const res = await cartApi.list()
    cartItems.value = (res || []).map((item: CartItem) => ({ ...item, selected: item.selected ?? false }))
  } catch (err: { message?: string }) {
    cartItems.value = []
    toast.error(err?.message || '加载购物车失败')
  } finally { loading.value = false }
}

async function changeQty(item: CartItem, delta: number) {
  uni.vibrateShort({ type: 'light' })
  const newQty = item.quantity + delta
  if (newQty < 1) return
  try { await cartApi.updateQuantity(item.id, newQty); item.quantity = newQty }
  catch (err: { message?: string }) { toast.error(err?.message || '修改失败') }
}

async function toggleSelect(item: CartItem) {
  try { await cartApi.updateSelected(item.id, !item.selected); item.selected = !item.selected }
  catch (err: { message?: string }) { toast.error(err?.message || '选择失败') }
}

async function toggleSelectAll() {
  const all = allSelected.value
  try { await cartApi.selectAll(!all); filteredItems.value.forEach((item: CartItem) => { item.selected = !all }) }
  catch (err: { message?: string }) { toast.error(err?.message || '全选失败') }
}

async function removeItem(item: CartItem) {
  uni.showModal({ title: '确认删除', content: '确定要从购物车中移除该商品吗？', confirmColor: '#c0392b', success: async (res) => {
    if (!res.confirm) return
    try { await cartApi.remove(item.id); cartItems.value = cartItems.value.filter((i: CartItem) => i.id !== item.id) }
    catch (err: { message?: string }) { toast.error(err?.message || '删除失败') }
  }})
}

async function removeSelected() {
  if (!hasSelected.value) return
  uni.showModal({ title: '确认删除', content: `确定要删除选中的 ${selectedCount.value} 件商品吗？`, confirmColor: '#c0392b', success: async (res) => {
    if (!res.confirm) return
    try { await cartApi.removeSelected(); await loadCart() }
    catch (err: { message?: string }) { toast.error(err?.message || '删除失败') }
  }})
}

function switchGroup(type: number) { currentGroup.value = type }
function goBack() { uni.navigateBack() }
function goHome() { uni.switchTab({ url: '/pages/index/index' }) }
function goCatalog() { uni.switchTab({ url: '/pages/catalog/index' }) }

function goSettle() {
  if (!hasSelected.value || !checkAuth()) return
  const hasExchangeItems = selectedItems.value.some((i: CartItem) => i.type === 2)
  if (hasExchangeItems) {
    const requiredPoints = totalPoints.value
    const requiredCash = totalCash.value
    const { ecoPoints = 0, balance = 0 } = assetStore as { ecoPoints?: number; balance?: number }
    if (ecoPoints < requiredPoints) { toast.warning('积分不足，无法换购'); return }
    if (balance < requiredCash) { toast.warning('余额不足，无法换购'); return }
  }
  const ids = selectedItems.value.map((i: CartItem) => i.id).join(',')
  uni.navigateTo({ url: `/pages/order/confirm?cartIds=${ids}` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page {
  min-height: 100vh;
  background: $bg-primary;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

$gap-4: 4rpx; $gap-8: 8rpx; $gap-16: 16rpx; $gap-24: 24rpx; $gap-base: 16rpx; $gap-sm: 8rpx; $gap-xs: 4rpx;

.status-bar { width: 100%; }

.page-nav {
  display: flex; align-items: center; gap: $gap-16; padding: 12rpx $gap-16;
  &__back, &__action {
    width: 64rpx; height: 64rpx; display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
    border: 1rpx solid rgba(20,20,20,0.06); border-radius: 50%; font-size: 28rpx; color: $mineral-gray; flex-shrink: 0;
    box-sizing: border-box; cursor: pointer;
    &:active { background: rgba(255,255,255,0.7); }
  }
  &__title { flex: 1; font-size: 32rpx; font-weight: 700; color: $mineral-gray; text-align: center; letter-spacing: 0.5rpx; }
}

.mall-group-tabs { display: flex; padding: 0 $gap-16 $gap-16; gap: $gap-16; }

.mall-group-tab {
  flex: 1; height: 80rpx;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: $gap-4;
  background: rgba(255,255,255,0.7); backdrop-filter: blur(8px);
  border: 1rpx solid rgba(20,20,20,0.06); border-radius: $radius-lg;
  position: relative; transition: all 0.25s ease; box-sizing: border-box;

  &.active { background: $warm-yellow; border-color: $border-primary; box-shadow: $shadow-gold; .mall-group-tab__label { color: $accent-dark; font-weight: 700; } }
  &__abbr { width: 36rpx; height: 36rpx; line-height: 36rpx; text-align: center; font-size: 20rpx; font-weight: 800; background: $bg-tertiary; border-radius: 50%; color: $mineral-gray; box-sizing: border-box; }
  &.active &__abbr { background: $accent-dark; color: $accent-light; }
  &__label { font-size: 22rpx; font-weight: 500; color: $text-muted; }
  &__count { position: absolute; top: 4rpx; right: 4rpx; min-width: 36rpx; height: 36rpx; padding: 0 8rpx; background: $danger; border-radius: 18rpx; font-size: 20rpx; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: center; box-sizing: border-box; }
}

.cart-scroll { height: calc(100vh - 400rpx); }

.cart-list { padding: 0 $gap-16 $gap-16; display: flex; flex-direction: column; gap: $gap-16; }

.sk-item { display: flex; align-items: center; gap: $gap-16; padding: $gap-16; background: rgba(255,255,255,0.7); border-radius: $radius-lg; }
.sk-check { width: 44rpx; height: 44rpx; border-radius: 50%; background: $bg-tertiary; flex-shrink: 0; }
.sk-img { width: 160rpx; height: 160rpx; border-radius: $radius-md; background: $bg-tertiary; flex-shrink: 0; }
.sk-info { flex: 1; display: flex; flex-direction: column; gap: $gap-sm; }
.sk-line { height: 22rpx; border-radius: 8rpx; background: $bg-tertiary; width: 80%; &.sk-short { width: 40%; } }

.cart-item {
  display: flex; align-items: flex-start; gap: $gap-16; padding: $gap-16;
  background: rgba(255,255,255,0.88); backdrop-filter: blur(16px);
  border: 1rpx solid rgba(255,255,255,0.6); border-radius: $radius-lg;
  box-shadow: $clay-shadow; box-sizing: border-box;

  &.selected { border-color: $accent-dark; }

  &__check { padding-top: 48rpx; flex-shrink: 0; cursor: pointer; }
  &__img { width: 160rpx; height: 160rpx; border-radius: $radius-md; background: $bg-tertiary; flex-shrink: 0; }
  &__info { flex: 1; min-width: 0; }
  &__name { display: block; font-size: 28rpx; font-weight: 600; color: $text-primary; line-height: 1.4; margin-bottom: $gap-8; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  &__price-row { display: flex; align-items: center; gap: $gap-8; margin-bottom: $gap-8; }
  &__cash { font-family: $font-sans; font-size: 28rpx; font-weight: 700; color: $mineral-gray; font-variant-numeric: tabular-nums; }
  &__points { font-size: 26rpx; font-weight: 700; color: $accent-dark; font-variant-numeric: tabular-nums; }
  &__tag { padding: 2rpx 12rpx; background: rgba(61,139,110,0.10); color: $success; border-radius: 20rpx; font-size: 20rpx; font-weight: 600; box-sizing: border-box; &--gold { background: rgba(196,165,123,0.12); color: $accent-dark; } }
  &__stepper { display: flex; align-items: center; }
  &__del { padding: 8rpx; font-size: 36rpx; color: $text-muted; flex-shrink: 0; cursor: pointer; }
}

.stepper-btn {
  width: 56rpx; height: 56rpx; display: flex; align-items: center; justify-content: center;
  background: $bg-tertiary; border-radius: $radius-sm; cursor: pointer;
  box-sizing: border-box;
  &:active { background: rgba(47,53,66,0.12); }
  text { font-size: 28rpx; font-weight: 600; color: $mineral-gray; }
}

.stepper-num { min-width: 56rpx; height: 56rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; font-weight: 600; color: $mineral-gray; font-variant-numeric: tabular-nums; border-left: 1rpx solid rgba(47,53,66,0.08); border-right: 1rpx solid rgba(47,53,66,0.08); box-sizing: border-box; }

.check-circle {
  width: 44rpx; height: 44rpx; border-radius: 50%; border: 1rpx solid rgba(47,53,66,0.15);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease; background: rgba(255,255,255,0.5); box-sizing: border-box;
  &.is-selected { background: $accent-dark; border-color: $accent-dark; }
  .check-mark { font-size: 22rpx; color: #fff; font-weight: 700; }
}

// 底部结算栏
.bottom-bar {
  position: fixed; bottom: calc(120rpx + env(safe-area-inset-bottom)); left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; gap: $gap-16;
  padding: $gap-16; padding-right: $gap-16;
  background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);
  border-top: 1rpx solid rgba(20,20,20,0.06);
  box-shadow: 0 -8rpx 32rpx rgba(47,53,66,0.06); box-sizing: border-box;

  &__select { display: flex; align-items: center; gap: $gap-8; flex-shrink: 0; cursor: pointer; }
  &__select-label { font-size: 26rpx; color: $text-secondary; font-weight: 500; }
  &__total { flex: 1; display: flex; flex-direction: column; align-items: flex-end; gap: 4rpx; }
  &__delete {
    height: 64rpx; padding: 0 24rpx; display: flex; align-items: center; justify-content: center;
    border: 1rpx solid rgba(192,57,43,0.3); border-radius: $radius-full; flex-shrink: 0;
    text { font-size: 26rpx; font-weight: 600; color: $danger; }
  }
  &__btn {
    height: 80rpx; padding: 0 40rpx; background: $btn-gold-gradient; border-radius: $radius-full;
    box-shadow: $btn-gold-shadow; display: flex; align-items: center; justify-content: center;
    font-size: 30rpx; font-weight: 700; color: #fff; letter-spacing: 1rpx; flex-shrink: 0;
    transition: all 0.2s ease;
    &:active { transform: scale(0.97); }
    &.is-disabled { background: rgba(47,53,66,0.12); color: $text-muted; box-shadow: none; pointer-events: none; }
  }
}

.total-label { font-size: 22rpx; color: $text-muted; }
.total-amount { display: flex; align-items: baseline; gap: 4rpx; }
.total-cash { font-family: $font-sans; font-size: 34rpx; font-weight: 700; color: $mineral-gray; font-variant-numeric: tabular-nums; }
.total-points { font-size: 22rpx; color: $accent-dark; font-weight: 600; }

// 空状态
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 160rpx 40rpx; text-align: center;
  &__icon { width: 140rpx; height: 140rpx; line-height: 140rpx; text-align: center; font-size: 56rpx; font-weight: 800; background: $warm-yellow; border: 1rpx solid $border-primary; border-radius: 50%; color: $accent-dark; margin-bottom: 32rpx; box-sizing: border-box; }
  &__text { font-size: 32rpx; font-weight: 600; color: $text-primary; margin-bottom: 12rpx; }
  &__sub { font-size: 26rpx; color: $text-muted; margin-bottom: 40rpx; }
  &__btn {
    height: 80rpx; padding: 0 56rpx; background: $btn-gold-gradient; border-radius: $radius-full; box-shadow: $btn-gold-shadow; display: flex; align-items: center; justify-content: center;
    text { font-size: 30rpx; font-weight: 700; color: #fff; letter-spacing: 1rpx; }
  }
}

.shimmer { animation: shim 1.4s ease-in-out infinite; }
@keyframes shim { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.7; } }
.safe-bottom { width: 100%; }
</style>
