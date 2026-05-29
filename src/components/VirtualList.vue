<template>
  <scroll-view
    class="vl-scroll"
    :style="{ height: containerHeightPx + 'px' }"
    scroll-y
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- 撑起总高度：items.length × estimatedHeight -->
    <view
      class="vl-phantom"
      :style="{ height: totalHeightPx + 'px' }"
    />
    <!-- 可见窗口内容：position:sticky on phantom works, use absolute on visible -->
    <view
      class="vl-visible"
      :style="{ height: containerHeightPx + 'px', position: 'relative' }"
    >
      <view
        v-for="item in visibleItems"
        :key="item.data[keyField]"
        class="vl-item"
        :style="{ transform: `translateY(${item.top}px)` }"
      >
        <slot :item="item.data" :index="item.index" />
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  items: any[]
  itemHeight?: number     // 估算高度（rpx），用于计算phantom高度
  containerHeight?: number // 容器高度（px），默认自动
  buffer?: number
  keyField?: string
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 220,
  containerHeight: 0,
  buffer: 5,
  keyField: 'id',
})

// rpx → px
function rpx2px(rpx: number): number {
  const sys = uni.getSystemInfoSync()
  return (rpx / 750) * sys.windowWidth
}

const pxItemHeight = computed(() => rpx2px(props.itemHeight))
const containerHeightPx = ref(props.containerHeight)

onMounted(() => {
  if (!props.containerHeight) {
    const sys = uni.getSystemInfoSync()
    containerHeightPx.value = sys.windowHeight - rpx2px(400)
  }
})

const totalHeightPx = computed(() => props.items.length * pxItemHeight.value)

const scrollTop = ref(0)
const currentScrollTop = ref(0)

function getVisibleRange(top: number) {
  const start = Math.max(0, Math.floor(top / pxItemHeight.value) - props.buffer)
  const visibleCount = Math.ceil(containerHeightPx.value / pxItemHeight.value)
  const end = Math.min(props.items.length, start + visibleCount + props.buffer * 2)
  return { start, end }
}

const visibleItems = computed(() => {
  const { start, end } = getVisibleRange(currentScrollTop.value)
  return Array.from({ length: end - start }, (_, i) => {
    const idx = start + i
    return {
      data: props.items[idx],
      index: idx,
      top: idx * pxItemHeight.value,
      keyField: props.keyField,
    }
  })
})

let rafId: number | null = null
function onScroll(e: { detail?: { scrollTop?: number } }) {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const top = e?.detail?.scrollTop ?? 0
    currentScrollTop.value = top
  })
}

function scrollToIndex(index: number) {
  const targetTop = index * pxItemHeight.value
  currentScrollTop.value = targetTop
  scrollTop.value = targetTop + 1
  setTimeout(() => { scrollTop.value = targetTop }, 20)
}

defineExpose({ scrollToIndex })
</script>

<style lang="scss" scoped>
.vl-scroll {
  width: 100%;
}
.vl-phantom {
  width: 100%;
}
.vl-visible {
  width: 100%;
  overflow: hidden;
}
.vl-item {
  position: absolute;
  left: 0;
  right: 0;
  box-sizing: border-box;
}
</style>
