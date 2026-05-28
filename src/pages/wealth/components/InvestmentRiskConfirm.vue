<template>
  <Teleport to="body">
    <view v-if="visible" class="risk-overlay" @click.self="handleCancel">
      <view class="risk-dialog">
        <!-- Header -->
        <view class="risk-dialog__header">
          <view class="risk-dialog__icon">⚠️</view>
          <text class="risk-dialog__title">投资风险确认</text>
        </view>

        <!-- Subtitle -->
        <view class="risk-dialog__subtitle">
          <text>首次投资前，请完整阅读以下风险告知</text>
        </view>

        <!-- Risk content -->
        <scroll-view class="risk-dialog__content" scroll-y>
          <view class="risk-item">
            <view class="risk-item__dot" />
            <view class="risk-item__text">
              <text class="risk-item__label">本金风险</text>
              <text class="risk-item__desc">理财项目不保证本金安全，市场波动可能导致本金损失。</text>
            </view>
          </view>

          <view class="risk-item">
            <view class="risk-item__dot" />
            <view class="risk-item__text">
              <text class="risk-item__label">收益波动</text>
              <text class="risk-item__desc">预期收益仅为估算值，实际收益可能低于预期甚至为零。</text>
            </view>
          </view>

          <view class="risk-item">
            <view class="risk-item__dot" />
            <view class="risk-item__text">
              <text class="risk-item__label">提前赎回限制</text>
              <text class="risk-item__desc">投资封闭期内提前赎回，将收取违约金（按投资金额的一定比例收取）。</text>
            </view>
          </view>

          <view class="risk-item">
            <view class="risk-item__dot" />
            <view class="risk-item__text">
              <text class="risk-item__label">平台责任</text>
              <text class="risk-item__desc">本平台仅提供信息撮合服务，不对投资损失承担任何赔偿或补偿责任。</text>
            </view>
          </view>

          <view class="risk-item">
            <view class="risk-item__dot" />
            <view class="risk-item__text">
              <text class="risk-item__label">合规确认</text>
              <text class="risk-item__desc">您需具备完全民事行为能力，自行承担投资决策的一切后果。</text>
            </view>
          </view>
        </scroll-view>

        <!-- Agreement checkbox -->
        <view class="risk-dialog__agreement" @click="toggleAgreed">
          <view :class="['checkbox', { checked: agreed }]">
            <text v-if="agreed" class="checkbox__check">✓</text>
          </view>
          <text class="agreement__text">我已完整阅读并充分理解上述投资风险，愿意承担相应投资后果</text>
        </view>

        <!-- Actions -->
        <view class="risk-dialog__actions">
          <view
            :class="['risk-dialog__btn', 'risk-dialog__btn--cancel']"
            @click="handleCancel"
          >
            取消
          </view>
          <view
            :class="['risk-dialog__btn', 'risk-dialog__btn--confirm', { disabled: !agreed }]"
            @click="handleConfirm"
          >
            确认申购
          </view>
        </view>
      </view>
    </view>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const agreed = ref(false)

// Reset checkbox when dialog opens
watch(() => props.visible, (val) => {
  if (val) agreed.value = false
})

function toggleAgreed() {
  agreed.value = !agreed.value
}

function handleConfirm() {
  if (!agreed.value) return
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.risk-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.risk-dialog {
  width: 100%;
  max-width: 640rpx;
  background: #1a1d29;
  border-radius: 24rpx;
  border: 1rpx solid rgba(196, 165, 123, 0.2);
  overflow: hidden;
  box-shadow: 0 24rpx 80rpx rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
}

.risk-dialog__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 40rpx 16rpx;
  gap: 12rpx;
}

.risk-dialog__icon {
  font-size: 64rpx;
  line-height: 1;
}

.risk-dialog__title {
  font-size: 36rpx;
  font-weight: 700;
  color: #C0454A;
  letter-spacing: 2rpx;
}

.risk-dialog__subtitle {
  padding: 0 40rpx 24rpx;
  text-align: center;

  text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.5);
  }
}

.risk-dialog__content {
  padding: 0 32rpx;
  max-height: 360rpx;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4rpx;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(196, 165, 123, 0.3);
    border-radius: 2rpx;
  }
}

.risk-item {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
}

.risk-item__dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #C0454A;
  flex-shrink: 0;
  margin-top: 10rpx;
}

.risk-item__text {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
}

.risk-item__label {
  font-size: 26rpx;
  font-weight: 600;
  color: #fff;
}

.risk-item__desc {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

.risk-dialog__agreement {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  cursor: pointer;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border-radius: 8rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  margin-top: 2rpx;

  &.checked {
    background: #C4A57B;
    border-color: #C4A57B;
  }
}

.checkbox__check {
  font-size: 22rpx;
  color: #1a1d29;
  font-weight: 700;
}

.agreement__text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  flex: 1;
}

.risk-dialog__actions {
  display: flex;
  gap: 20rpx;
  padding: 16rpx 32rpx 32rpx;
}

.risk-dialog__btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.2s ease;

  &--cancel {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.6);
    border: 1rpx solid rgba(255, 255, 255, 0.1);

    &:active {
      background: rgba(255, 255, 255, 0.12);
    }
  }

  &--confirm {
    background: #1a2535;
    color: rgba(255, 255, 255, 0.35);
    border: 1rpx solid rgba(196, 165, 123, 0.3);

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &:not(.disabled):active {
      background: #243044;
    }
  }

  &:not(.disabled).active {
    transform: scale(0.97);
  }
}
</style>
