/**
 * useToast — 全局统一 Toast 提示（v5.2 规范）
 *
 * 用法：
 *   import { useToast } from '@/composables/useToast'
 *   const toast = useToast()
 *   toast.success('保存成功')
 *   toast.error('加载失败')
 *   toast.warning('积分不足')
 *   toast.info('验证码已发送')
 */
import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastState {
  visible: boolean
  message: string
  type: ToastType
  duration: number
}

// 全局单例
const state = reactive<ToastState>({
  visible: false,
  message: '',
  type: 'info',
  duration: 2000,
})

let timer: ReturnType<typeof setTimeout> | null = null

function show(message: string, type: ToastType = 'info', duration?: number) {
  if (timer) clearTimeout(timer)

  state.message = message
  state.type = type
  state.duration = duration ?? (type === 'success' ? 2000 : 3000)
  state.visible = true

  timer = setTimeout(() => {
    state.visible = false
    timer = setTimeout(() => {
      state.visible = false
    }, 250)
  }, state.duration)
}

export function useToast() {
  return {
    state,
    show: (message: string, type?: ToastType, duration?: number) =>
      show(message, type ?? 'info', duration),
    success: (message: string, duration?: number) =>
      show(message, 'success', duration ?? 2000),
    error: (message: string, duration?: number) =>
      show(message, 'error', duration ?? 3000),
    warning: (message: string, duration?: number) =>
      show(message, 'warning', duration ?? 3000),
    info: (message: string, duration?: number) =>
      show(message, 'info', duration ?? 2000),
  }
}
