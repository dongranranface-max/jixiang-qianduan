<template>
  <view class="page-container">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          v-model="keyword"
          placeholder="搜索商品"
          placeholder-class="search-placeholder"
          confirm-type="search"
          @confirm="doSearch"
          focus
        />
        <text v-if="keyword" class="clear-icon" @click="keyword = ''">×</text>
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-section" v-if="!keyword && historyList.length > 0">
      <view class="section-header">
        <text class="section-title">搜索历史</text>
        <text class="clear-history" @click="clearHistory">清空</text>
      </view>
      <view class="history-tags">
        <text 
          class="history-tag" 
          v-for="(tag, index) in historyList" 
          :key="index"
          @click="searchWithKeyword(tag)"
        >
          {{ tag }}
        </text>
      </view>
    </view>
    
    <!-- 热门搜索 -->
    <view class="hot-section" v-if="!keyword">
      <view class="section-header">
        <text class="section-title">🔥 热门搜索</text>
      </view>
      <view class="hot-list">
        <view 
          class="hot-item" 
          v-for="(item, index) in hotList" 
          :key="index"
          @click="searchWithKeyword(item.keyword)"
        >
          <view class="hot-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</view>
          <view class="hot-info">
            <text class="hot-keyword">{{ item.keyword }}</text>
            <text class="hot-desc">{{ item.desc }}</text>
          </view>
          <view class="hot-tag" v-if="item.isNew">新</view>
        </view>
      </view>
    </view>
    
    <!-- 搜索结果 -->
    <view class="result-section" v-if="keyword && searchResult.length > 0">
      <view class="result-header">
        <text class="result-count">找到 {{ searchResult.length }} 个商品</text>
      </view>
      <view class="result-list">
        <view 
          class="result-item" 
          v-for="product in searchResult" 
          :key="product.id"
          @click="goProduct(product.id)"
        >
          <image class="result-image" :src="product.image" mode="aspectFill" />
          <view class="result-info">
            <text class="result-name">{{ product.name }}</text>
            <view class="result-bottom">
              <text class="result-price">¥{{ product.price }}</text>
              <text class="result-points">+{{ product.points }}积分</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 无结果 -->
    <view class="empty-section" v-if="keyword && searchResult.length === 0 && searching">
      <text class="empty-icon">🔍</text>
      <text class="empty-text">没有找到相关商品</text>
      <text class="empty-hint">试试其他关键词</text>
    </view>
    
    <!-- 搜索建议 -->
    <view class="suggest-section" v-if="keyword && !searching">
      <view 
        class="suggest-item" 
        v-for="(suggest, index) in suggestList" 
        :key="index"
        @click="searchWithKeyword(suggest)"
      >
        <text class="suggest-icon">🔍</text>
        <text class="suggest-text">{{ suggest }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const searching = ref(false)
const historyList = ref(['iPhone', '华为', '戴森吹风机', 'AirPods'])
const searchingTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const hotList = ref([
  { keyword: 'iPhone 15', desc: '热搜第一', isNew: false },
  { keyword: '华为 Mate 60', desc: '国产旗舰', isNew: true },
  { keyword: '戴森吹风机', desc: '热门推荐', isNew: false },
  { keyword: 'AirPods Pro', desc: '苹果耳机', isNew: false },
  { keyword: '小米手环', desc: '智能穿戴', isNew: false },
  { keyword: 'Switch游戏机', desc: '掌机热卖', isNew: true }
])

const searchResult = ref<any[]>([])
const suggestList = ref<string[]>([])

const allProducts = [
  { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 9999, points: 500, image: 'https://picsum.photos/200/200?random=100' },
  { id: 2, name: '华为 Mate 60 Pro', price: 6999, points: 350, image: 'https://picsum.photos/200/200?random=101' },
  { id: 3, name: '戴森吹风机 HD15', price: 2999, points: 150, image: 'https://picsum.photos/200/200?random=102' },
  { id: 4, name: 'AirPods Pro 2', price: 1899, points: 95, image: 'https://picsum.photos/200/200?random=103' },
  { id: 5, name: '小米手环 8 Pro', price: 399, points: 20, image: 'https://picsum.photos/200/200?random=104' },
  { id: 6, name: '索尼 WH-1000XM5', price: 2499, points: 125, image: 'https://picsum.photos/200/200?random=105' }
]

function goBack() {
  uni.navigateBack()
}

function doSearch() {
  if (!keyword.value) return
  searching.value = true
  
  // 模拟搜索
  setTimeout(() => {
    searchResult.value = allProducts.filter(p => 
      p.name.toLowerCase().includes(keyword.value.toLowerCase())
    )
    searching.value = false
    
    // 添加到历史
    if (!historyList.value.includes(keyword.value)) {
      historyList.value.unshift(keyword.value)
    }
  }, 500)
}

function searchWithKeyword(kw: string) {
  keyword.value = kw
  doSearch()
}

function clearHistory() {
  historyList.value = []
}

function goProduct(id: number) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

// 搜索建议
import { watch } from 'vue'

watch(keyword, (newVal) => {
  if (searchingTimer.value) {
    clearTimeout(searchingTimer.value)
  }
  
  if (!newVal) {
    suggestList.value = []
    return
  }
  
  searchingTimer.value = setTimeout(() => {
    suggestList.value = allProducts
      .filter(p => p.name.toLowerCase().includes(newVal.toLowerCase()))
      .map(p => p.name)
  }, 300)
})
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background: $bg-primary;
  padding: 0 $spacing-lg;
}

.search-header {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  padding: $spacing-base 0;
  
  .search-bar {
    flex: 1;
    display: flex;
    align-items: center;
    height: 72rpx;
    background: $bg-card;
    backdrop-filter: blur(20px);
    border: 1rpx solid $border-color;
    border-radius: 36rpx;
    padding: 0 $spacing-base;
    
    .search-icon {
      font-size: 32rpx;
      color: $text-secondary;
    }
    
    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #fff;
      margin: 0 $spacing-sm;
    }
    
    .clear-icon {
      font-size: 36rpx;
      color: $text-muted;
    }
  }
  
  .cancel-btn {
    font-size: 28rpx;
    color: $text-secondary;
  }
}

.history-section, .hot-section {
  margin-top: $spacing-xl;
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-base;
    
    .section-title {
      font-size: 30rpx;
      font-weight: 600;
      color: $text-primary;
    }
    
    .clear-history {
      font-size: 26rpx;
      color: $primary;
    }
  }
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  
  .history-tag {
    padding: 12rpx 24rpx;
    background: $bg-card;
    border: 1rpx solid $border-color;
    border-radius: 50rpx;
    font-size: 26rpx;
    color: $text-secondary;
  }
}

.hot-list {
  .hot-item {
    display: flex;
    align-items: center;
    padding: $spacing-base 0;
    border-bottom: 1rpx solid $border-light;
    
    .hot-rank {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      font-weight: 700;
      color: $text-secondary;
      background: $bg-card;
      border-radius: 8rpx;
      
      &.rank-1 { color: $gold; background: rgba($gold, 0.2); }
      &.rank-2 { color: #C0C0C0; background: rgba(192, 192, 192, 0.2); }
      &.rank-3 { color: #CD7F32; background: rgba(205, 127, 50, 0.2); }
    }
    
    .hot-info {
      flex: 1;
      margin-left: $spacing-base;
      
      .hot-keyword {
        font-size: 28rpx;
        color: $text-primary;
        font-weight: 500;
      }
      
      .hot-desc {
        font-size: 22rpx;
        color: $text-muted;
        margin-left: $spacing-sm;
      }
    }
    
    .hot-tag {
      padding: 4rpx 12rpx;
      background: $danger;
      color: #fff;
      font-size: 20rpx;
      border-radius: 6rpx;
    }
  }
}

.result-section {
  margin-top: $spacing-lg;
  
  .result-header {
    margin-bottom: $spacing-base;
    
    .result-count {
      font-size: 26rpx;
      color: $text-secondary;
    }
  }
  
  .result-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
    
    .result-item {
      display: flex;
      background: $bg-card;
      border-radius: $radius-md;
      overflow: hidden;
      padding: $spacing-base;
      
      .result-image {
        width: 180rpx;
        height: 180rpx;
        border-radius: $radius-sm;
      }
      
      .result-info {
        flex: 1;
        margin-left: $spacing-base;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .result-name {
          font-size: 28rpx;
          color: $text-primary;
          @include line-clamp(2);
        }
        
        .result-bottom {
          display: flex;
          align-items: baseline;
          gap: $spacing-sm;
          
          .result-price {
            font-size: 32rpx;
            font-weight: 700;
            color: $primary;
          }
          
          .result-points {
            font-size: 22rpx;
            color: $gold;
          }
        }
      }
    }
  }
}

.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl 0;
  
  .empty-icon {
    font-size: 120rpx;
    margin-bottom: $spacing-base;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }
  
  .empty-hint {
    font-size: 26rpx;
    color: $text-secondary;
  }
}

.suggest-section {
  margin-top: $spacing-lg;
  
  .suggest-item {
    display: flex;
    align-items: center;
    padding: $spacing-base 0;
    border-bottom: 1rpx solid $border-light;
    
    .suggest-icon {
      font-size: 28rpx;
      color: $text-secondary;
      margin-right: $spacing-sm;
    }
    
    .suggest-text {
      font-size: 28rpx;
      color: $text-primary;
    }
  }
}
</style>
