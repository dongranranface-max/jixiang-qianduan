<template>
  <Teleport to="body">
    <view
      v-if="state.visible"
      class="toast"
      :class="`toast--${state.type}`"
    >
      <text v-if="icon" class="toast__icon">{{ icon }}</text>
      <text class="toast__text">{{ state.message }}</text>
    </view>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'

const { state } = useToast()

const iconMap: Record<string, string> = {
  success: '✓',
  error: '×',
  warning: '⚠',
  info: '',
}

const icon = computed(() => iconMap[state.type] || '')
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.toast {
  position: fixed;
  top: calc(var(--status-bar-height, 20px) + 16rpx);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(47, 53, 66, 0.90);
  color: #ffffff;
  padding: 20rpx 36rpx;
  border-radius: 40rpx;
  font-size: $font-body;
  font-weight: $weight-medium;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 12rpx;
  max-width: 600rpx;
  white-space: nowrap;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  animation: toast-in 0.25s ease-out forwards;

  &--success .toast__icon {
    color: $success;
  }

  &--error .toast__icon {
    color: $danger;
  }

  &--warning .toast__icon {
    color: $warning;
  }
}

.toast__icon {
  font-size: 32rpx;
  flex-shrink: 0;
}

.toast__text {
  font-size: $font-body;
  font-weight: $weight-medium;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
