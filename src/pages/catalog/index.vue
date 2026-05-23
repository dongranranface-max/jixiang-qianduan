<template>
  <view class="page-container">
    <AssetStatusBar v-if="loggedIn" />
    <view v-else class="safe-area-top" :style="{ height: statusBarHeight + 'px' }" />

    <!-- 页面导航 -->
    <view class="page-nav">
      <view class="page-nav__back" @click="goBack"><text>←</text></view>
      <text class="page-nav__title">商品分类</text>
      <view class="page-nav__action" @click="goSearch"><text>⌕</text></view>
    </view>

    <!-- Tab 类型切换 -->
    <view class="mall-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="mall-tab"
        :class="{ active: currentType === tab.key }"
        @click="switchType(tab.key)"
      >
        <text class="mall-tab__abbr">{{ tab.abbr }}</text>
        <text class="mall-tab__label">{{ tab.label }}</text>
      </view>
    </view>

    <!-- 分类 + 商品 -->
    <view class="content-layout">
      <!-- 左侧分类导航 -->
      <scroll-view class="category-nav" scroll-y>
        <view
          v-for="c in categories"
          :key="c.id"
          class="category-item"
          :class="{ active: currentCategoryId === c.id }"
          @click="selectCategory(c.id)"
        >
          <text>{{ c.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧商品列表 -->
      <scroll-view class="product-list" scroll-y @scrolltolower="loadMore">
        <!-- 骨架屏 -->
        <view v-if="loading && !products.length" class="product-grid">
          <view v-for="i in 6" :key="i" class="sk-card">
            <view class="sk-img shimmer" />
            <view class="sk-info">
              <view class="sk-line shimmer" />
              <view class="sk-line sk-short shimmer" />
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-else-if="!products.length" class="empty-state">
          <view class="empty-state__icon">商</view>
          <text class="empty-state__text">该分类暂无商品</text>
          <text class="empty-state__sub">换个分类看看吧</text>
        </view>

        <!-- 商品网格 -->
        <view v-else class="product-grid">
          <HomeProductCard
            v-for="p in products"
            :key="p.id"
            :product="p"
            :type="currentType"
            :default-cover="defaultCover"
            @click="goProduct(p)"
          />
        </view>

        <!-- 加载更多 -->
        <view v-if="hasMore && !loading" class="load-more" @click="loadMore">
          <text>加载更多</text>
        </view>
        <view v-if="!hasMore && products.length > 0" class="no-more">
          <text>— 没有更多了 —</text>
        </view>
      </scroll-view>
    </view>

    <view class="safe-area-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { productApi } from '@/utils/api'
import { checkAuth } from '@/utils/auth'
import { HOME_CATEGORY_FALLBACK, normalizeCategoryTree, flattenCategories } from '@/utils/category'
import { DEFAULT_PRODUCT_COVER } from '@/utils/media'
import { assetStore } from '@/store/asset'
import AssetStatusBar from '@/components/AssetStatusBar.vue'
import HomeProductCard from '@/components/HomeProductCard.vue'

const CATALOG_PRESET_KEY = '***'
const statusBarHeight = ref(20)
const loggedIn = ref(checkAuth())
const currentType = ref(1)
const currentCategoryId = ref('')
const categories = ref<any[]>([])
const products = ref<any[]>([])
const defaultCover = DEFAULT_PRODUCT_COVER
const loading = ref(false)
const page = ref(1)
const limit = 20
const hasMore = ref(true)
let categoriesLoadSeq = 0

const tabs = [
  { key: 1, abbr: '购', label: '消费' },
  { key: 2, abbr: '换', label: '换购' },
  { key: 3, abbr: '兑', label: '兑换' },
]

onMounted(() => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 20
  loadPreset()
  loadCategories()
  loadProducts(true)
})

onShow(() => {
  loggedIn.value = checkAuth()
  if (loggedIn.value) assetStore.fetchBalance()
})

function loadPreset() {
  try {
    const preset = uni.getStorageSync(CATALOG_PRESET_KEY)
    if (preset) {
      if (preset.type) currentType.value = preset.type
      if (preset.categoryId) currentCategoryId.value = preset.categoryId
      uni.removeStorageSync(CATALOG_PRESET_KEY)
    }
  } catch {}
}

async function loadCategories() {
  const seq = ++categoriesLoadSeq
  try {
    const res = await productApi.getCategories()
    if (seq !== categoriesLoadSeq) return
    const tree = normalizeCategoryTree(res)
    const flat = flattenCategories(tree)
    categories.value = flat.length ? flat : HOME_CATEGORY_FALLBACK
  } catch {
    if (seq !== categoriesLoadSeq) return
    categories.value = HOME_CATEGORY_FALLBACK
  }
}

async function loadProducts(reset = false) {
  if (loading.value) return
  if (reset) { page.value = 1; hasMore.value = true }
  if (!hasMore.value) return

  loading.value = true
  try {
    const res = await productApi.getList({
      type: currentType.value,
      categoryId: currentCategoryId.value || undefined,
      page: page.value,
      limit,
    })
    const list = res.list || []
    if (reset) {
      products.value = list
    } else {
      products.value.push(...list)
    }
    hasMore.value = list.length === limit
    page.value++
  } catch {
    if (reset) products.value = []
  } finally {
    loading.value = false
  }
}

function switchType(type: number) {
  if (currentType.value === type) return
  currentType.value = type
  currentCategoryId.value = ''
  loadProducts(true)
}

function selectCategory(id: string) {
  if (currentCategoryId.value === id) return
  currentCategoryId.value = id
  loadProducts(true)
}

function loadMore() {
  if (hasMore.value && !loading.value) loadProducts(false)
}

function goBack() { uni.navigateBack() }
function goSearch() { uni.navigateTo({ url: '/pages/search/index' }) }
function goProduct(p: any) {
  uni.navigateTo({ url: `/pages/product/detail?id=${p.id}&type=${currentType.value}` })
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

  &__back,
  &__action {
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

// Tab 切换
.mall-tabs {
  display: flex;
  padding: 0 $spacing-base $spacing-base;
  gap: 12rpx;
}

.mall-tab {
  flex: 1;
  height: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1rpx solid rgba(20, 20, 20, 0.06);
  border-radius: $radius-lg;
  transition: all 0.25s ease;

  &.active {
    background: $warm-yellow;
    border-color: $border-primary;
    box-shadow: $shadow-gold;

    .mall-tab__label {
      color: $accent-dark;
      font-weight: 700;
    }
  }

  &__abbr {
    width: 40rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    font-size: 22rpx;
    font-weight: 800;
    background: $bg-tertiary;
    border-radius: 50%;
    color: $mineral-gray;
  }

  &.active .mall-tab__abbr {
    background: $mineral-gray;
    color: $bronze-light;
  }

  &__label {
    font-size: 20rpx;
    font-weight: 500;
    color: $text-muted;
  }
}

// 分类 + 商品布局
.content-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// 左侧分类
.category-nav {
  width: 160rpx;
  height: calc(100vh - 300rpx);
  background: rgba(255, 255, 255, 0.5);
  border-right: 1rpx solid rgba(20, 20, 20, 0.05);

  .category-item {
    height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    color: $text-secondary;
    font-weight: 500;
    border-left: 4rpx solid transparent;
    transition: all 0.2s ease;
    padding: 0 12rpx;

    &.active {
      background: rgba(255, 255, 255, 0.9);
      color: $accent-dark;
      font-weight: 700;
      border-left-color: $accent-dark;
    }
  }
}

// 右侧商品
.product-list {
  flex: 1;
  height: calc(100vh - 300rpx);
  padding: $spacing-base;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-base;
}

.sk-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: $radius-lg;
  overflow: hidden;

  .sk-img {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: $bg-tertiary;
  }

  .sk-info {
    padding: $spacing-base;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
  }

  .sk-line {
    height: 22rpx;
    border-radius: 8rpx;
    background: $bg-tertiary;
    width: 80%;

    &.sk-short { width: 40%; }
  }
}

.shimmer {
  animation: shim 1.4s ease-in-out infinite;
}

@keyframes shim {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}

.load-more,
.no-more {
  text-align: center;
  padding: $spacing-base 0;
  font-size: 26rpx;
  color: $text-muted;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;

  &__icon {
    width: 120rpx;
    height: 120rpx;
    line-height: 120rpx;
    text-align: center;
    font-size: 48rpx;
    font-weight: 800;
    background: $warm-yellow;
    border: 1rpx solid $border-primary;
    border-radius: 50%;
    color: $accent-dark;
    margin-bottom: 24rpx;
  }

  &__text {
    font-size: 30rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 12rpx;
  }

  &__sub {
    font-size: 26rpx;
    color: $text-muted;
  }
}
</style>
