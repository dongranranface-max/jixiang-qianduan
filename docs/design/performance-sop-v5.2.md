# 性能验收 SOP v5.2

> 集享公社 UI 设计规范 · 性能验收标准与方法
> 版本：v5.2 · 2026-05-28

---

## 一、性能指标定义

| 指标 | 缩写 | 预算值 | 定义 |
|------|------|--------|------|
| 首次内容绘制 | FCP | < 1.8s | First Contentful Paint，首次内容绘制 |
| 最大内容绘制 | LCP | < 2.5s | Largest Contentful Paint，最大内容绘制 |
| 首次输入延迟 | FID | < 100ms | First Input Delay，用户首次交互延迟 |
| 交互到绘制 | TTI | < 3.8s | Time to Interactive，可交互时间 |
| 布局偏移量 | CLS | = 0 | Cumulative Layout Shift，布局偏移为 0 |
| 首屏请求数 | - | < 15 个 | 首屏渲染前的请求数 |
| 资源总大小 | - | < 2MB | 首屏相关资源总和 |

---

## 二、验收工具

### 2.1 必备工具

| 工具 | 用途 | 获取方式 |
|------|------|---------|
| Chrome DevTools | Performance/Lighthouse/Network | Chrome 内置 F12 |
| Lighthouse | 性能评分/FCP/LCP/CLS | DevTools → Lighthouse |
| Network 面板 | 请求数/资源大小 | DevTools → Network |
| Performance 面板 | 帧率/长任务分析 | DevTools → Performance |

### 2.2 性能评分标准

| 评分 | 等级 | 说明 |
|------|------|------|
| 90-100 | 优秀 | 绿色，各指标达标 |
| 50-89 | 需要改进 | 橙色，部分指标超标 |
| 0-49 | 差 | 红色，严重性能问题 |

**目标：** 集享公社用户端性能评分 ≥ 85

---

## 三、FCP 验收方法（< 1.8s）

### 3.1 测量步骤

```
1. 打开 Chrome DevTools（F12）
2. 切换到 Performance 面板
3. 点击 reload 按钮（Ctrl+Shift+R 刷新）
4. 在 Timings 中找到 FCP 标记
5. 记录 FCP 时间
```

### 3.2 FCP 优化 checklist

```
□ SSR/SSG 优先（Nuxt 场景）
□ 关键 CSS 内联（首屏样式）
□ 字体预加载 <link rel="preload">
□ 图片预加载（首屏 Hero 图）
□ 资源并行加载（preconnect/prefetch）
□ 移除阻塞渲染的 JS（defer/async）
```

---

## 四、LCP 验收方法（< 2.5s）

### 4.1 测量步骤

```
1. Lighthouse → Run analysis
2. 查看 LCP 标记时间
3. 点击 LCP 元素，查看具体是哪个元素
```

### 4.2 常见 LCP 元素

| LCP 元素 | 优化方式 |
|---------|---------|
| Hero 图片 | 预加载 + 正确尺寸 + WebP |
| 首屏文字 | 字体预加载 + font-display: swap |
| 资产卡片 | 服务端渲染/骨架屏 |
| 背景图 | 简化/压缩/改用纯色 |

### 4.3 LCP 优化 checklist

```
□ Hero 图片使用 <link rel="preload">
□ 图片格式 WebP，尺寸 ≤ 200KB
□ 图片指定 width/height 或 aspect-ratio
□ 字体使用 font-display: swap
□ 移除大型 JS 阻塞（代码分割/懒加载）
□ 使用 CDN 加速资源加载
```

---

## 五、CLS 验收方法（= 0）

### 5.1 测量步骤

```
1. Lighthouse → Run analysis → CLS 分数
2. Network 面板 → 禁用缓存 → 刷新
3. 查看是否有布局跳动
```

### 5.2 CLS 常见原因

| 原因 | 症状 | 修复方法 |
|------|------|---------|
| 图片无尺寸 | 图片加载后页面跳动 | 指定 width/height 或 aspect-ratio |
| 骨架屏高度不一致 | 真实内容替换后跳动 | 骨架屏高度与真实内容完全一致 |
| 字体加载（FOIT/FOUT） | 文字跳动 | font-display: swap + 字体预加载 |
| 动态内容注入 | 列表/广告注入导致跳动 | 预留固定高度空间 |
| 横幅/Toast 弹出 | 页面内容下移 | fixed 定位，不占空间 |

### 5.3 CLS = 0 保障 checklist

```scss
// 1. 图片必须指定宽高比
.product-image {
  width: 100%;
  aspect-ratio: 1 / 1;  // 固定比例，防止跳动
  object-fit: cover;
}

// 2. 骨架屏与真实内容高度完全一致
.skeleton-card {
  height: 240rpx;  // 必须与真实卡片高度一致
  border-radius: $radius-lg;
}

// 3. 字体加载不阻塞渲染
@font-face {
  font-display: swap;  // 先用系统字体，再用自定义字体
}

// 4. 动态内容使用 fixed/absolute
.banner {
  position: fixed;  // 不占文档流
  top: 0;
  z-index: 999;
}
```

---

## 六、首屏请求数验收（< 15 个）

### 6.1 测量步骤

```
1. Network 面板 → 勾选 "Disable cache"
2. 刷新页面
3. 筛选 Fetch/XHR 和 文档 请求
4. 计数首屏渲染前（FCP 之前）的请求
```

### 6.2 请求数超标排查

```
□ JS/CSS 是否合并（Vite build 分析）
□ 图片是否懒加载（首屏外图片）
□ 接口是否并行（Promise.all）
□ 是否有多余的 initial JS（代码分割检查）
□ 第三方脚本是否阻塞（广告/统计）
```

### 6.3 首屏请求优化

```javascript
// ✅ 正确：路由懒加载 + 接口并行
const ProductDetail = () => import('@/pages/product/detail.vue');
// 商品详情页不阻塞首页加载

// ✅ 正确：图片懒加载
<img lazy-load src="..." />
// 或 Intersection Observer

// ✅ 正确：接口并行
const [products, categories] = await Promise.all([
  getProducts(),
  getCategories()
]);
```

---

## 七、资源大小验收（< 2MB）

### 7.1 测量步骤

```
1. Lighthouse → Run analysis → 资源大小汇总
2. 或 Network 面板 → 勾选 "Disable cache" → 刷新
3. 计算 Transfer Size 总和
```

### 7.2 资源大小分布参考

| 资源类型 | 预算 | 最大限制 | 超标处理 |
|---------|------|---------|---------|
| JS | < 500KB | 800KB | 代码分割/Tree Shaking/压缩 |
| CSS | < 100KB | 150KB | 移除未使用样式 |
| 图片 | < 1MB | 1.5MB | WebP/压缩/CDN |
| 字体 | < 200KB | 300KB | Subset/WOFF2 |
| 其他 | < 200KB | 200KB | 检查/移除 |

### 7.3 图片优化 checklist

```
□ 首屏图片使用 WebP 格式（体积比 JPG 小 30%）
□ 图片压缩质量 80-85%
□ 列表图：200×200rpx，≤ 20KB
□ 详情图：750×750rpx，≤ 100KB
□ Banner 图：750×300rpx，≤ 80KB
□ 使用 CDN 加速图片加载
□ 图片缓存策略（Cache-Control）
```

---

## 八、实战验收 SOP

### 8.1 提测前自检

```
□ Lighthouse 性能评分 ≥ 85
□ FCP < 1.8s
□ LCP < 2.5s
□ CLS = 0
□ 首屏请求数 < 15 个
□ 资源总大小 < 2MB
□ 无 console.error
□ 无阻塞渲染的 JS
□ 图片全部使用 WebP 或已压缩
□ 骨架屏高度与真实内容一致
```

### 8.2 提测标准

| 类型 | 说明 |
|------|------|
| **P0（必须修复）** | FCP > 2.5s / LCP > 3.5s / CLS > 0.1 / 首屏请求 > 25 个 |
| **P1（应该修复）** | FCP > 2.0s / LCP > 3.0s / 首屏请求 > 20 个 |
| **P2（建议优化）** | 评分 < 85 / 资源 > 2MB / 有优化空间 |

### 8.3 验收报告模板

```
页面/模块：_______________________
检测日期：_______________________
检测工具：Chrome DevTools + Lighthouse

性能指标：
- FCP：____ms（预算 < 1800ms）[□ 通过 □ 不通过]
- LCP：____ms（预算 < 2500ms）[□ 通过 □ 不通过]
- CLS：____（预算 = 0）[□ 通过 □ 不通过]
- 首屏请求数：____（预算 < 15）[□ 通过 □ 不通过]
- 资源大小：____KB（预算 < 2048KB）[□ 通过 □ 不通过]
- Lighthouse 评分：____（预算 ≥ 85）[□ 通过 □ 不通过]

主要性能问题：
1. [优先级] [问题描述] → [建议修复]

整体评估：□ 通过  □ 有条件通过  □ 不通过
```

---

**本 SOP 为集享公社 UI 设计规范 v5.2 配套文档，配合主规范文档和 design-tokens-v5.2.scss 使用。**
