// ============================================
//  signature.ts - 请求签名防篡改
//  策略：AES-like 简易签名（timestamp + nonce + payload hash）
//  用途：所有涉及金额/积分的写操作必须携带签名 Header
// ============================================

// --------------------------------------------
//  常量配置
// --------------------------------------------
const SIGN_SECRET = 'JXCITY-SECRET-KEY' // 前端签名盐（与后端约定，非加密密钥）

// --------------------------------------------
//  核心：生成签名
// --------------------------------------------

/**
 * 对敏感数据进行签名
 * @param payload - 请求体（不含 token）
 * @param timestamp - 毫秒时间戳
 * @param nonce - 随机字符串
 */
export function signPayload(payload: Record<string, unknown>, timestamp: number, nonce: string): string {
  // 1. 按 key 排序后序列化
  const sorted = Object.keys(payload)
    .sort()
    .reduce((acc, key) => {
      const val = payload[key]
      if (val !== undefined && val !== null && val !== '') {
        acc[key] = val
      }
      return acc
    }, {} as Record<string, unknown>)

  const bodyStr = JSON.stringify(sorted)

  // 2. 组合签名因子
  const raw = `${timestamp}:${nonce}:${bodyStr}:${SIGN_SECRET}`

  // 3. 简易 hash（前端用，不做真正加密）
  return simpleHash(raw)
}

/**
 * 简单字符串 hash（代替引入完整的 crypto 库）
 */
function simpleHash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
    hash = hash & hash // convert to 32bit integer
  }
  // 转为 8 位十六进制
  return Math.abs(hash).toString(16).padStart(8, '0')
}

// --------------------------------------------
//  签名 Header 生成器
// --------------------------------------------

/**
 * 生成随机字符串作为 nonce
 */
function generateNonce(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export interface SignHeaders {
  'X-Sign-Timestamp': string
  'X-Sign-Nonce': string
  'X-Sign-Token': string
}

/**
 * 为请求生成签名 Header
 * @param payload - 请求体对象
 * @returns 签名 Header 对象
 */
export function generateSignHeaders(payload: Record<string, unknown> = {}): SignHeaders {
  const timestamp = Date.now()
  const nonce = generateNonce()
  const token = signPayload(payload, timestamp, nonce)

  return {
    'X-Sign-Timestamp': String(timestamp),
    'X-Sign-Nonce': nonce,
    'X-Sign-Token': token,
  }
}

// --------------------------------------------
//  判断是否需要签名
// --------------------------------------------
const SIGN_METHODS = ['POST', 'PUT', 'DELETE']
const SIGN_PATHS = [
  '/orders',
  '/cart',
  '/wallet',
  '/financial/subscribe',
  '/financial/redeem',
  '/address',
]

/**
 * 判断请求是否需要签名
 */
export function needsSign(method: string, url: string): boolean {
  if (!SIGN_METHODS.includes(method.toUpperCase())) return false
  return SIGN_PATHS.some((p) => url.includes(p))
}
