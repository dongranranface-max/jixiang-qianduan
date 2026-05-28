<template>
  <view class="banner-carousel" :style="{ height: height }">
    <swiper
      class="banner-swiper"
      :indicator-dots="false"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
      :display-multiple-items="1"
      :skip-hidden-item-layout="true"
      @change="onChange"
    >
      <swiper-item
        v-for="item in banners"
        :key="item.id"
        class="banner-swiper-item"
        @click="onClick(item)"
      >
        <image
          class="banner-image"
          :src="item.image"
          :mode="'aspectFill'"
          :lazy-load="true"
          webp
        />
      </swiper-item>
    </swiper>

    <!-- 底部金色指示点 -->
    <view class="banner-indicators">
      <view
        v-for="(item, index) in banners"
        :key="item.id"
        class="banner-indicator"
        :class="{ 'banner-indicator--active': index === currentIndex }"
        :style="{
          width: index === currentIndex ? '16rpx' : '8rpx',
        }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface BannerItem {
  id: number | string
  image: string
  link?: string
  title?: string
  [k: string]: unknown
}

interface Props {
  banners: BannerItem[]
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '300rpx',
})

const emit = defineEmits<{
  click: [item: BannerItem]
}>()

const currentIndex = ref(0)

function onChange(e: { detail: { current: number } }) {
  currentIndex.value = e.detail.current
}

function onClick(item: BannerItem) {
  emit('click', item)
  if (item.link) {
    uni.navigateTo({ url: item.link })
  }
}
</script>

<style lang="scss" scoped>
.banner-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

.banner-swiper-item {
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  display: block;
}

// 底部居中金色指示点
.banner-indicators {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.banner-indicator {
  height: 8rpx;
  border-radius: 4rpx;
  background: rgba(255, 255, 255, 0.5);
  transition: width 0.3s ease, background 0.3s ease;
}

.banner-indicator--active {
  background: #C4A57B;
}
</style>
