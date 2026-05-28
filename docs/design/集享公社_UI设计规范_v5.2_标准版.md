# 集享公社 · 用户端 UI 设计规范

> **版本 v5.2 · 2026-05-28 · 标准版**
> **版权声明：** 本规范版权归集享公社前端团队所有，仅限内部使用。
> **设计哲学：** 轻奢金融 · 象牙白底 · 深藏青 · 暖金 · 克制留白
> **适用端：** UniApp（用户端 H5 + 微信小程序 + App）

---

## 文档变更日志（v5.1 → v5.2）

| 类别 | 问题 | 处理 |
|------|------|------|
| **P0** | 第18章 VIP V1~V9 与补充项2 V1-V8 冲突 | 统一修正为 V1-V8（8级），删除所有 V9 描述 |
| **P0** | 暖金色 #C4A57B 在浅色背景对比度 3.2:1，WCAG AA 不达标 | 新增 $gold-on-light 变体，浅色背景文字/图标用 #9B7E5E |
| **P0** | 补充项18安全边界描述与确认订单页规范存在歧义 | 统一为：金额/积分/商品价格以后端返回为准，前端不计算不传递 |
| **P1** | Token 命名不一致（$mineral-gray / $mineral-blue 非 color 语义） | 重构为 $mineral-navy / $mineral-slate，颜色语义对齐 |
| **P1** | 字体系统7级冗余 | 精简为 5 级：$font-body / $font-title / $font-heading / $font-hero / $font-asset |
| **P1** | 缺少暗色模式规范 | 新增「第三部分：暗色模式规范」，定义完整变量映射 |
| **P2** | 组件状态矩阵缺失 | 新增「第四部分：组件状态矩阵」 |
| **P2** | 安全区未覆盖 iOS 灵动岛 | 完善 safe-area 规范，增加刘海屏/灵动岛场景 |
| **P2** | 规范文档结构按页面编排，技术规范分散 | 重组为「设计基石→组件库→页面规范→全局协议」四层结构 |
| **P2** | 性能预算无验收方法 | 新增「性能验收 SOP」，量化 FCP/LCP/CLS 测量方法 |

---

# 第一部分：设计基石

## 第1章 · 设计哲学与文明纵深

设计的终极问题不是「它看起来如何」，而是「它如何被感知」。集享公社的用户端设计，以人类文明史上三次重大审美转型为纵深坐标，以认知心理学最新研究成果为根基，构建一套既有人文温度、又有商业效率的界面系统。

### 1.1 三次审美转型的界面映射

| 文明阶段 | 审美特征 | 界面映射 | 示例 |
|---------|---------|---------|------|
| 农业文明 → 秩序之美 | 克制的留白（边界感）、规律网格（秩序感）、金色收获色（财富感） | 网格系统、间距规范、暖金强调色 | 资产卡片、商城入口 |
| 工业文明 → 效率之美 | tabular-nums 等宽数字、系统化阴影层次、固定动效时长 | 金融数字六条铁律、阴影系统、动效时间轴 | 订单金额、倒计时 |
| 信息文明 → 认知降噪 | 克制的留白、有限颜色、统一动效节奏、清晰视觉层级 | 每屏信息块 ≤5 个、操作路径 3 步内、语义色三色完全可区分 | 全局色彩系统 |

### 1.2 暖金色的文明隐喻

金色在人类文明中代表「价值共识」。集享公社选择 **#C4A57B 暖金色**（而非正金色 #FFD700），在财富感之外传递亲和力。

**重要约束：**
- 所有金色均使用 #C4A57B（暖调），禁止使用正金色 #FFD700
- 金色是唯一强调色，仅占 5-8% 视觉面积
- 浅色背景（$bg-primary）上的金色文字/图标使用 **$gold-on-light (#9B7E5E)**，确保 WCAG AA 对比度 ≥ 4.5:1

### 1.3 色彩决策逻辑

| 原则 | 说明 |
|------|------|
| 稀缺性制造焦点 | 金色强调色极低比例（5-10%），每次出现都制造焦点 |
| 藏青代替黑色 | #2F3542 保留 22% 蓝色调，比纯黑更有温度 |
| 语义色可区分 | 三色在明度和色相上均完全可区分（绿 #3D8B6E / 橙 #D4850A / 红 #C0454A），确保色盲用户可读 |

### 1.4 认知偏误规避

| 偏误类型 | 规避方案 |
|---------|---------|
| 确认偏误 | 所有删除操作必须二次确认弹框（不可用 Toast 代替） |
| 锚定效应 | 页面只显示真实价格，折扣标签仅用于真实促销 |
| 损失厌恶 | 积分过期/会员到期等场景使用绿色正向文案而非红色警告 |
| 峰终定律 | 签到成功/下单完成必须给予正向强的动画反馈 |
| 现状偏误 | 积分自动入账等功能默认关闭，需要用户主动开启 |

---

## 第2章 · 认知心理学与交互根基

### 2.1 注意力经济

| 策略 | 实现方式 |
|------|---------|
| 稀缺性制造焦点 | 金色强调色极低比例（5-10%），每次出现都制造焦点 |
| 渐进式信息披露 | 首屏不展现全部信息，通过模块折叠、Tab 切换逐步展示 |
| 格式塔闭合 | glass-card 圆角+阴影+白色半透明，用户用周边视野即可「闭合」形状 |

### 2.2 工作记忆负荷控制

| 指标 | 预算值 |
|------|--------|
| 每屏信息块 | ≤ 5 个（首页：资产卡/搜索/Hero/金刚区/商城入口） |
| 操作路径 | 3 步内（选商品→加购→结算） |
| 即时状态反馈 | 每次操作都有视觉反馈，不让用户进入等待焦虑 |

### 2.3 具身认知与触觉反馈

| 策略 | 实现方式 |
|------|---------|
| 按压反馈 | 所有可点击卡片 scale(0.98) + 阴影减弱，模拟实物被按下的重量感 |
| 弹性动画 | Modal 弹出使用 cubic-bezier(0.34,1.56,0.64,1)，模拟橡皮筋回弹 |
| 震动反馈 | 数量 ±、删除确认、签到成功等关键操作调用 uni.vibrateShort() |
| 一致性原则 | 所有 btn-fire 使用相同的按压曲线，所有 glass-card 使用相同的 clay-shadow |

---

## 第3章 · 色彩系统

### 3.1 浅色模式色彩 Token

```scss
// ============================================================
// 集享公社 Design Token · 色彩系统 v5.2
// 使用方式：token 名称在代码中引用，HEX 值在设计工具中对应
// ============================================================

// --- 背景色 ---
$bg-primary:      #F8F7F4;   // 页面全局背景（象限白）
$bg-secondary:    #FFFFFF;   // 卡片/浮层/模态框
$bg-tertiary:     #EFEEEA;   // 骨架屏/输入框/列表分隔

// --- 暖色点缀 ---
$warm-yellow:     #EDE9E1;   // 活动卡片/优惠提示背景

// --- 品牌金（强调色）---
// 核心金：用于深色背景上的元素 / 按钮 / 边框 / 选中态
$gold:            #C4A57B;   // 主金（禁用正金色 #FFD700）
$gold-light:      #DFD0B5;   // 浅金：收益数字 / hover 态
$gold-dark:       #9B7E5E;   // 深金：深色背景上金色文字
// 浅色背景专用金变体：确保 WCAG AA 对比度 ≥ 4.5:1
$gold-on-light:   #9B7E5E;   // 浅色背景上的金色文字/图标（$bg-primary 上 #C4A57B 对比度 3.2:1 ❌）

// --- 藏青（主文字/深色卡片）---
$mineral-navy:    #2F3542;   // 资产卡/Hero/商城入口（禁用纯黑 #000）
$mineral-slate:   #707B8C;   // 蓝灰：次级文字/辅助说明（命名统一：slate=蓝灰）

// --- 语义色 ---
$success:         #3D8B6E;   // 绿色：成功/已完成/正向收益
$warning:         #D4850A;   // 橙色：警告/库存紧张/即将过期
$danger:          #C0454A;   // 红色：错误/删除/亏损

// --- 文字色 ---
$text-primary:    #141414;   // 标题/重要正文（字重 700+）
$text-secondary:  #5C5C5C;   // 正文（字重 500）
$text-muted:      #8A8A8A;   // 辅助/时间戳/占位符
$text-inverse:    #FFFFFF;   // 深色背景上的白色文字

// --- 边框 ---
$border-color:    rgba(20,20,20,0.08);   // 默认边框/卡片边框
$border-gold:     rgba(184,152,118,0.40); // 金色边框：重点卡片/FL聚焦/选中态

// --- 渐变 ---
$gold-gradient:   linear-gradient(135deg, #C4A57B 0%, #DFD0B5 100%);
$navy-gradient:   linear-gradient(180deg, #2F3542 0%, #1A1F2A 100%);
```

### 3.2 暗色模式色彩 Token

```scss
// ============================================================
// 暗色模式色彩 Token（v5.2 新增）
// 触发条件：prefers-color-scheme: dark 或用户手动开启
// ============================================================

// --- 背景色 ---
$dark-bg-primary:   #121212;   // 页面全局背景（深黑）
$dark-bg-secondary: #1E1E1E;   // 卡片/浮层/模态框
$dark-bg-tertiary:  #2A2A2A;   // 骨架屏/输入框/列表分隔

// --- 暖色点缀 ---
$dark-warm-yellow:  #2A2520;   // 活动卡片/优惠提示背景

// --- 品牌金（暗色模式下保持金色，避免纯白文字）---
$dark-gold:         #C4A57B;   // 主金（暗色模式下不变）
$dark-gold-light:   #E8D9BC;   // 浅金（暗色模式下提亮）
$dark-gold-dark:    #9B7E5E;   // 深金（暗色模式下保持）
$dark-gold-on-dark: #DFD0B5;   // 暗色背景上的金色文字（对比度优化）

// --- 藏青（暗色模式下可适当调整）---
$dark-mineral-navy: #2F3542;   // 资产卡/Hero（保持深色不变）
$dark-mineral-slate:#9CA3AF;   // 蓝灰（暗色模式下提亮）

// --- 语义色（暗色模式下提升明度确保对比度）---
$dark-success:      #4ADE80;   // 绿色（暗色模式提亮）
$dark-warning:      #FBBF24;   // 橙色（暗色模式提亮）
$dark-danger:       #F87171;   // 红色（暗色模式提亮）

// --- 文字色 ---
$dark-text-primary: #F5F5F5;   // 标题/重要正文
$dark-text-secondary: #D1D5DB; // 正文
$dark-text-muted:   #9CA3AF;   // 辅助/时间戳/占位符
$dark-text-inverse:  #141414;   // 浅色背景上的深色文字

// --- 边框 ---
$dark-border-color:  rgba(255,255,255,0.10);
$dark-border-gold:   rgba(196,165,123,0.50);
```

### 3.3 暗色模式实现规范

```scss
// 实现方式：CSS 变量 + prefers-color-scheme 媒体查询
// 示例：app.vue 或全局 style 中使用

@media (prefers-color-scheme: dark) {
  page {
    background-color: $dark-bg-primary;
    color: $dark-text-primary;
  }
  
  // 使用 [data-theme="dark"] 覆盖媒体查询，支持手动切换
  page[data-theme="dark"] {
    background-color: $dark-bg-primary;
    color: $dark-text-primary;
  }
}

// 注意：
// 1. 资产卡/Hero 等深色组件在暗色模式下保持深色，不反转
// 2. 金融数据展示区域优先保持高对比度
// 3. 图片/插画使用 filter: brightness(0.9) 适配暗色模式
// 4. 金色在暗色模式下保持暖调，不变白
```

---

## 第4章 · 字体系统

### 4.1 字体 Token（精简为 5 级）

```scss
// ============================================================
// 字体系统 v5.2（7级精简为5级）
// 中文统一使用 PingFang SC / Noto Sans SC
// 英文/数字使用 Helvetica Neue / DIN Alternate
// ============================================================

// 基础字体
$font-family-cn:    "PingFang SC", "Noto Sans SC", -apple-system, sans-serif;
$font-family-en:    "Helvetica Neue", "DIN Alternate", "Roboto", sans-serif;
$font-family-mono:   "SF Mono", "Roboto Mono", monospace;

// --- 字体尺寸（5级）---
$font-body:         28rpx;   // 正文/次要信息（合并 caption→body）
$font-title:        32rpx;   // 页面标题/重要正文（合并 page-title）
$font-heading:      40rpx;   // 区块标题（合并 banner）
$font-hero:         48rpx;   // Hero/大数字
$font-asset:        52rpx;   // 资产余额专用（特殊场景使用）

// --- 字体字重 ---
$font-weight-regular:   400;   // 辅助/占位符
$font-weight-medium:    500;   // 正文（中文统一使用 500，不可 400）
$font-weight-semibold:  600;   // 标题
$font-weight-bold:      700;   // 重要标题/金额
$font-weight-heavy:     800;   // 资产数字

// --- 行高规范 ---
$line-height-tight:    1.2;   // 标题/金额
$line-height-normal:   1.5;   // 正文
$line-height-loose:    1.8;   // 说明文字

// --- 字间距 ---
$letter-spacing-tight:  -0.02em;  // 大标题
$letter-spacing-normal:  0;       // 正文
$letter-spacing-wide:    0.05em; // 英文大写/标签
```

### 4.2 金融数字六条铁律

```scss
// 金融数据展示强制规范
.financial-number {
  font-family: $font-family-en;      // ① 英文字体（数字更清晰）
  font-variant-numeric: tabular-nums; // ② tabular-nums（强制等宽）
  font-weight: $font-weight-bold;    // ⑤ 字重 700+
  letter-spacing: -0.02em;            // ③ 千分位已由字体处理
  
  // ④ 正负色
  &.positive { color: $gold-light; }  // 正收益→浅金
  &.negative { color: $danger; }     // 亏损→红色
  
  // ⑥ 超10万可拆行
  &.large-amount {
    font-size: $font-asset;
    line-height: $line-height-tight;
  }
}

// 金额展示格式规范
// ¥12,800.00 （整数部分千分位，2位小数）
// ¥5.2%     （收益率1位小数）
// +12,800   （正收益带+号，负收益带-号）
```

---

## 第5章 · 间距与圆角系统

### 5.1 间距 Token

```scss
// ============================================================
// 间距系统（基于 8rpx 基准网格）
// ============================================================

$space-xs:    8rpx;    // 标签内 padding / 图标文字间距
$space-sm:    16rpx;   // 列表内元素间距 / 标签组
$space-base:  28rpx;   // 卡片内边距 / 模块间距（基准值）
$space-lg:    40rpx;   // 区块间距离 / 模块间分隔
$space-xl:    56rpx;   // 页面顶部 / 底部安全区
$space-2xl:   72rpx;   // Hero 区域 / 全屏分隔

// --- 安全区规范（v5.2 完善）---
$safe-area-top:    calc(var(--status-bar-height) + 44rpx);  // 顶部（含状态栏）
$safe-area-bottom: 100rpx;                                   // 底部 TabBar 高度
// iPhone 14 Pro+ 灵动岛额外间距（覆盖 safe-area-top）
$safe-area-dynamic-island: 56rpx;   // 灵动岛场景额外 +12rpx
```

### 5.2 圆角 Token

```scss
// ============================================================
// 圆角系统（与尺寸正相关，禁止混用）
// ============================================================

$radius-sm:   12rpx;   // 标签 / 小按钮
$radius-md:   16rpx;   // 输入框
$radius-lg:   24rpx;   // 普通卡片
$radius-xl:   28rpx;   // 资产卡 / 大卡片
$radius-full: 9999rpx; // 胶囊按钮 / 头像 / 圆形徽章

// 圆角使用原则
// - 小元素（< 48rpx）→ $radius-sm
// - 中元素（48-80rpx）→ $radius-md
// - 大元素（> 80rpx）→ $radius-lg / $radius-xl
// - 胶囊/圆形 → $radius-full
// ⚠️ 圆角必须与尺寸正相关，禁止在同一组件上混用不同半径
```

---

## 第6章 · 阴影系统

```scss
// ============================================================
// 阴影系统
// ============================================================

// 基础卡片阴影（白底/象限白底）
$shadow-clay:   0 12rpx 48rpx rgba(47,53,66,0.06);

// Hover 态（卡片/按钮）
$shadow-hover:  0 20rpx 40rpx rgba(0,0,0,0.08);

// 金色主题卡片暖光晕
$shadow-fire:   0 12rpx 40rpx rgba(196,165,123,0.22);

// 选中态/卡激活态外发光
$shadow-gold:   0 0 20rpx rgba(196,165,123,0.30);

// 资产卡等深色卡片强阴影
$shadow-asset:  0 16rpx 64rpx rgba(0,0,0,0.28);

// 品牌主操作按钮
$shadow-btn:    0 12rpx 40rpx rgba(47,53,66,0.22);

// 阴影使用原则
// 1. 同一组件族使用相同阴影（如所有 glass-card 使用 $shadow-clay）
// 2. Hover 态阴影加深，Active 态阴影减弱（模拟按压）
// 3. 深色背景禁用浓重阴影（使用 $shadow-gold 替代）
// 4. 禁止在同一组件上叠加超过 2 层阴影（性能问题）
```

---

## 第7章 · 动效体系

### 7.1 动效命名与参数

```scss
// ============================================================
// 动效体系 v5.2
// ============================================================

// --- 时长规范 ---
$duration-instant:  0.12s;   // 微交互：按钮按压 scale
$duration-fast:     0.18s;   // 快交互：hover / active 反馈
$duration-normal:   0.25s;   // 标准：展开/收起/滑入
$duration-slow:     0.38s;   // 慢：页面内容滑入
$duration-animate:  1.4s;   // 动画：骨架屏 / 加载条纹
$duration-marquee:  20s;     // 循环：跑马灯

// --- 缓动曲线 ---
$ease-out:      cubic-bezier(0.0, 0.0, 0.2, 1);      // 标准退出
$ease-in-out:   cubic-bezier(0.4, 0.0, 0.2, 1);     // 标准进入/退出
$ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1);  // 弹性：Modal 弹出
$ease-spring:   cubic-bezier(0.25, 0.46, 0.45, 0.94); // 弹簧：数量 ±

// --- 具体动效 ---
$effect-btn-tap:      scale(1) → scale(0.955) → scale(0.98);  // 0.18s
$effect-fl-float:     translateY + scale(0.82);                  // 0.22s
$effect-slide-up:     translateY(40rpx)→0 + fade-in;           // 0.38s
$effect-pop-in:       scale(0.92)→1 + opacity 0→1;             // 0.30s $ease-bounce
$effect-shimmer:      linear-gradient 200% 宽度从左向右扫;        // 1.4s infinite
$effect-marquee:      translateX 0→-33.33% 无限循环;             // 20s linear
$effect-pulse:        scale + opacity 脉冲;                       // 1.5s ease-in-out infinite
$effect-hero-shimmer: translateX 光泽扫过;                        // 4s ease-in-out infinite
$effect-premium-glow: shadow-gold ↔ shadow-fire 呼吸;           // 4s infinite
$effect-countdown-ring: SVG stroke-dashoffset 动态计算;          // 每秒更新
$effect-toast:        opacity + translateY(-20rpx→0);            // 0.25s / 0.2s

// --- 按钮 Loading 态 ---
$effect-btn-flow: repeating-linear-gradient 斜条纹流动;  // 1.4s
```

### 7.2 动效性能预算（v5.2 新增）

```scss
// ============================================================
// 动效性能规范（v5.2 新增）
// ============================================================

// GPU 加速强制规范
// ✅ 使用：transform / opacity
// ❌ 禁止：width / height / margin / padding / box-shadow 动画

@mixin gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}

// 动画帧率要求：所有动画 ≥ 60fps
// 测量方法：Chrome DevTools → Performance → Frame Rendering

// --- 场景动画预算 ---
$animation-budget: (
  "首屏加载":    (elements: 0,  reason: "骨架屏除外，用户等待时不应有额外动画")),
  "页面切换":    (elements: 3,  max-duration: 400ms, reason: "仅过渡元素")),
  "列表滑动":    (elements: 0,  reason: "惯性滚动除外，禁止列表 item 动画")),
  "Modal弹出":   (elements: 2,  max-duration: 300ms, reason: "遮罩 + 内容各一个")),
  "Toast提示":   (elements: 1,  max-duration: 250ms, reason: "仅 Toast 本身")),
  "骨架屏":      (elements: 1,  reason: "shimmer 动画独占"))
);

// 同时动画元素上限：单屏 ≤ 10 个（包含骨架屏 shimmer）
// 页面进入动画总时长：≤ 600ms
// 移动端优先：减少动效，确保低端设备流畅

// --- 动效哲学 ---
// 1. 有意义才动（骨架屏/流动按钮/按压反馈）
// 2. 节奏即信息（快=即时反馈/正常=标准切换/慢=装饰性）
// 3. 克制原则（单屏同时动画元素 ≤ 10 个）
```

---

# 第二部分：组件库

## 第8章 · 按钮系统

### 8.1 按钮变体

```scss
// ============================================================
// 按钮系统 v5.2
// ============================================================

// --- 按钮尺寸 ---
$btn-height-sm:     64rpx;   // 紧凑场景
$btn-height-base:   80rpx;   // 标准按钮
$btn-height-lg:     88rpx;   // 全屏 CTA / 主要操作
$btn-height-xl:     96rpx;   // 超大 CTA

// --- 按钮变体 ---

// 主操作按钮（深色渐变）
.btn-primary {
  background: $mineral-navy-gradient;
  color: $text-inverse;
  box-shadow: $shadow-btn;
  font-size: $font-title;
  font-weight: $font-weight-semibold;
  height: $btn-height-base;
  border-radius: $radius-full;
  
  &:hover { transform: scale(1.02); box-shadow: $shadow-hover; }
  &:active { transform: scale(0.98); box-shadow: $shadow-clay; }
}

// 重要操作（藏青渐变）
.btn-fire {
  background: linear-gradient(135deg, #3D4654 0%, #2F3542 100%);
  color: $text-inverse;
  box-shadow: $shadow-fire;
  font-size: $font-title;
  font-weight: $font-weight-semibold;
  height: $btn-height-lg;
  border-radius: $radius-full;
}

// 金色 CTA（升级/申购/注册）
.btn-gold {
  background: $gold-gradient;
  color: $mineral-navy;
  font-size: $font-title;
  font-weight: $font-weight-bold;
  height: $btn-height-lg;
  border-radius: $radius-full;
  
  &:hover { transform: scale(1.02); box-shadow: $shadow-gold; }
  &:active { transform: scale(0.98); }
}

// 次级操作（描边）
.btn-outline {
  background: transparent;
  border: 1rpx solid $border-color;
  color: $text-secondary;
  font-size: $font-title;
  font-weight: $font-weight-medium;
  height: $btn-height-base;
  border-radius: $radius-full;
}

// 辅助操作（幽灵）
.btn-ghost {
  background: transparent;
  color: $text-muted;
  font-size: $font-body;
  font-weight: $font-weight-medium;
}

// 禁用态
.btn-disabled {
  background: rgba(47,53,66,0.12);
  color: $text-muted;
  pointer-events: none;
  cursor: not-allowed;
}

// 按钮 Loading 态
.btn-loading {
  position: relative;
  pointer-events: none;
  color: transparent !important;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10rpx,
      rgba(255,255,255,0.15) 10rpx,
      rgba(255,255,255,0.15) 20rpx
    );
    animation: btn-flow-load 1.4s linear infinite;
  }
}

@keyframes btn-flow-load {
  0% { background-position: 0 0; }
  100% { background-position: 56rpx 0; }
}
```

### 8.2 按钮状态矩阵

| 状态 | 视觉表现 | 可点击 |
|------|---------|--------|
| Default | 渐变背景 + 白字 + 阴影 | ✅ |
| Hover | scale(1.02) + shadow-hover | ✅ |
| Active/Pressed | scale(0.98) + 阴影减弱 | ✅ |
| Loading | 斜条纹动画 + disabled | ❌ |
| Disabled | 28% 透明度 + 不可点击 | ❌ |
| Success | 绿色背景 + ✓ 图标（可选） | ✅ |
| Error | 红色背景 + × 图标（可选） | ✅ |

---

## 第9章 · FL 浮动标签输入框

### 9.1 FL 输入框规范

```scss
// ============================================================
// FL 浮动标签输入框（Floating Label）
// ============================================================

// --- 尺寸 ---
$fl-height:       96rpx;   // 输入框总高度
$fl-label-size:   22rpx;   // 默认 label 字号
$fl-label-float:  18rpx;   // 浮动后 label 字号
$fl-padding-x:    28rpx;   // 左右内边距

// --- 状态 ---

// 默认态（Fixed）
.fl-input {
  position: relative;
  height: $fl-height;
  
  label {
    position: absolute;
    left: $fl-padding-x;
    top: 50%;
    transform: translateY(-50%);
    font-size: $fl-label-size;
    font-weight: $font-weight-medium;
    color: $text-secondary;
    pointer-events: none;
    transition: all 0.22s ease;
  }
  
  input {
    width: 100%;
    height: 100%;
    padding: 36rpx $fl-padding-x 0;
    border: 1rpx solid $border-color;
    border-radius: $radius-md;
    font-size: $font-title;
    background: $bg-secondary;
    
    &:focus {
      border-color: $gold-on-light;  // 浅色背景用深金
      box-shadow: 0 0 0 4rpx rgba(155,126,94,0.12);
      
      + label {
        top: 22rpx;
        transform: translateY(0);
        font-size: $fl-label-float;
        color: $gold-on-light;
        font-weight: $font-weight-medium;
      }
    }
    
    // 有内容时保持浮动
    &:not(:placeholder-shown) + label,
    &:valid + label {
      top: 22rpx;
      transform: translateY(0);
      font-size: $fl-label-float;
    }
  }
}

// 聚焦态
.fl-input.focused {
  label {
    top: 22rpx;
    font-size: $fl-label-float;
    color: $gold-on-light;
    font-weight: $font-weight-medium;
    transform: scale(0.82);
    transform-origin: left top;
  }
  
  input {
    border-color: $gold-on-light;
    box-shadow: 0 0 0 4rpx rgba(155,126,94,0.12);
  }
}

// 错误态
.fl-input.error {
  input {
    border-color: $danger;
    box-shadow: 0 0 0 4rpx rgba(192,69,74,0.12);
  }
  
  .fl-error-msg {
    display: block;
    font-size: $font-body;
    color: $danger;
    margin-top: 8rpx;
  }
}
```

---

## 第10章 · 骨架屏系统

### 10.1 骨架屏规范

```scss
// ============================================================
// 骨架屏（Skeleton）
// ============================================================

$skeleton-bg:       rgba(47,53,66,0.07);   // 骨架背景色
$skeleton-shimmer:  linear-gradient(
  90deg,
  transparent 0%,
  rgba(255,255,255,0.5) 50%,
  transparent 100%
);  // shimmer 渐变

@keyframes shimmer-sweep {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: $skeleton-bg;
  border-radius: $radius-sm;
  
  // shimmer 动画
  &.animate {
    background: linear-gradient(
      90deg,
      $skeleton-bg 0%,
      rgba(255,255,255,0.5) 50%,
      $skeleton-bg 100%
    );
    background-size: 200% 100%;
    animation: shimmer-sweep 1.4s linear infinite;
  }
  
  // 骨架屏类型
  &.skeleton-text     { height: 28rpx; width: 100%; border-radius: $radius-sm; }
  &.skeleton-title    { height: 40rpx; width: 60%; border-radius: $radius-sm; }
  &.skeleton-avatar   { width: 80rpx; height: 80rpx; border-radius: $radius-full; }
  &.skeleton-image    { width: 200rpx; height: 200rpx; border-radius: $radius-md; }
  &.skeleton-button   { height: 88rpx; width: 100%; border-radius: $radius-full; }
  &.skeleton-card     { height: 240rpx; width: 100%; border-radius: $radius-lg; }
}

// CLS 预防原则
// 1. 骨架屏高度必须与真实数据完全一致
// 2. 图片骨架必须指定宽高比（aspect-ratio）
// 3. 禁止骨架屏与真实内容混排（先骨架后内容）
```

### 10.2 加载状态五级规范（L1-L5）

| 层级 | 场景 | UI 响应 | 示例 |
|------|------|---------|------|
| **L1 局部** | 单个元素/组件加载中 | 骨架屏（单行/单卡片） | 列表中的某一项 |
| **L2 页面级** | 整页数据首次加载 | 全屏骨架屏（模拟完整页面布局） | 首次进入商品详情/用户中心 |
| **L3 操作反馈** | 表单提交/关键操作中 | btn-flow-load 斜条纹 + 全局遮罩 | 下单/支付/申购 |
| **L4 成功反馈** | 操作成功（无需页面跳转） | Toast success，duration 2s | 收藏成功/加购成功/签到成功 |
| **L5 失败反馈** | 操作/加载失败 | Toast error + 重试机制 | 网络错误/接口报错/库存不足 |

---

## 第11章 · TabBar 导航

```scss
// ============================================================
// LuxuryTabbar — 底部导航
// ============================================================

$tabbar-height:       100rpx;
$tabbar-icon-size:    48rpx;
$tabbar-dot-size:     6rpx;
$tabbar-font-size:    20rpx;

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $tabbar-height;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1rpx solid rgba(20,20,20,0.06);
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
  
  &-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8rpx 0;
    position: relative;
    
    // 选中金色圆点
    &.active::before {
      content: '';
      position: absolute;
      top: 8rpx;
      width: $tabbar-dot-size;
      height: $tabbar-dot-size;
      background: $gold;
      border-radius: $radius-full;
    }
    
    .icon { font-size: $tabbar-icon-size; }
    
    .text {
      font-size: $tabbar-font-size;
      font-weight: $font-weight-regular;
      color: $text-muted;
      margin-top: 4rpx;
    }
    
    &.active .text {
      color: $gold-on-light;
      font-weight: $font-weight-medium;
    }
  }
}

// 路由锁定：tabBar 对应页面禁止使用 navigateTo，只能 SwitchTab
// 支持页面：/pages/index/index, /pages/catalog/index, /pages/cart/index, /pages/user/index
```

---

## 第12章 · Toast 提示

```scss
// ============================================================
// Toast 提示系统
// ============================================================

// --- 位置 ---
$toast-top:      calc(var(--status-bar-height) + 16rpx);

// --- 样式 ---
.toast {
  position: fixed;
  top: $toast-top;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(47,53,66,0.90);
  color: $text-inverse;
  padding: 20rpx 36rpx;
  border-radius: 40rpx;
  font-size: $font-body;
  font-weight: $font-weight-medium;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 12rpx;
  max-width: 600rpx;
  white-space: nowrap;
  
  // 动画
  &.toast-enter {
    animation: toast-in 0.25s ease-out forwards;
  }
  
  &.toast-leave {
    animation: toast-out 0.20s ease-in forwards;
  }
  
  // 类型
  &.toast-success .toast-icon { color: $success; }
  &.toast-error   .toast-icon { color: $danger; }
  &.toast-warning .toast-icon { color: $warning; }
}

@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(-20rpx); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes toast-out {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to   { opacity: 0; transform: translateX(-50%) translateY(-20rpx); }
}

// Toast 类型规范
// 成功：绿色 ✓ 图标，时间 2s
// 失败/错误：红色 × 图标，时间 3s
// 警告：橙色 ⚠ 图标，时间 3s，icon=none
// 信息：纯文字，无图标
```

---

## 第13章 · 通用页面状态机

| 状态 | 设计响应 |
|------|---------|
| **Loading** | 骨架屏替代 spinner，全屏或局部视数据依赖 |
| **Empty** | 插画（emoji 80rpx）+ 主副文案 + 行动引导按钮 |
| **Error** | 错误图标（emoji）+ 说明 +「重试」按钮 |
| **Success** | 正常内容渲染，列表数据更新 |
| **Partially Loaded** | 核心数据先展示，次级数据加载中显示骨架 |

---

# 第三部分：页面规范

## 第14章 · 启动页与引导页

**需求依据：** 移动端必须有。承担品牌第一印象、用户引导（首次启动）、登录态判断三大职责。

### 14.1 启动页（Splash Screen）

| 项目 | 规范 |
|------|------|
| 触发时机 | 冷启动（首次打开 App）时显示 |
| 展示内容 | 品牌 Logo（居中，白色或金色版本）+ 平台 Slogan（底部） |
| 动画 | Logo fade-in + scale(0.95→1)，0.6s ease-out |
| 停留时长 | 品牌 Logo 显示 1.5s 后自动跳转 |
| 跳转逻辑 | 已登录→首页；未登录→引导页（首次）或登录页（再次） |

### 14.2 新用户引导页（Onboarding）

| 项目 | 规范 |
|------|------|
| 触发时机 | 首次打开 App 且未登录时，只展示一次 |
| 引导页数量 | 3 页（可配置） |
| 每页内容 | 品牌插画大图（占 60% 屏幕高度）+ 标题（$font-title/700）+ 副文案（$font-body/500/$text-secondary） |
| 底部指示点 | 当前页金色圆点，已过页灰色圆点 |
| 最后一页 | 「立即体验」按钮（btn-gold，88rpx 高） |
| 跳过入口 | 右上角「跳过」文字按钮，点击直接进入登录页 |

---

## 第15章 · 首页（Index）

### 15.1 模块完整清单（11个模块）

| # | 模块 | 规范 |
|---|------|------|
| ① | 资产状态聚合卡（登录后） | sticky 悬浮顶部，深色渐变毛玻璃卡，总资产+昨日收益+积分三栏 |
| ② | 轮播 Banner | 高度 300rpx，3-5张，自动轮播 3s + 手动滑动，底部金色指示点 |
| ③ | Hero 品牌大卡 | 高度 340rpx，深色渐变背景，内嵌搜索栏，hero-shimmer 动画 |
| ④ | 实时数据跑马灯 | 深色横条 72rpx，pulse-dot + data-marquee 无限循环 |
| ⑤ | 金刚区 3×3 快捷入口 | 白色玻璃卡片网格，9 个核心功能，支持红点 + 登录拦截 |
| ⑥ | 限时活动双卡片 | 左：限时秒杀（含整点倒计时）；右：会员专区（含等级进度条） |
| ⑦ | 三大商城入口 | 纵向深色渐变卡，消费(#2C3542)/换购(#3D3024)/兑换(#1E2530) |
| ⑧ | 热门分类网格 | 4×2 图标网格，背景色后端返回或固定 ID 映射 |
| ⑨ | 商品推荐瀑布流 | 双列瀑布流 + 骨架屏 + onReachBottom 触底加载 |
| ⑩ | 订单状态横栏（登录后） | 待付款/待发货/待收货/已完成 4栏，未登录灰色占位 |
| ⑪ | 安全区 + TabBar | 预留 safe-area-bottom，LuxuryTabbar 毛玻璃组件 |

### 15.2 生命周期数据流

| 钩子 | 职责 |
|------|------|
| onMounted | 设备信息 → loadProducts(true) → loadHotCategories() → startCountdown() |
| onShow | checkAuth() → assetStore.fetchBalance() → 刷新内容数据 |
| onPullDownRefresh | 并行刷新全部数据 → uni.stopPullDownRefresh() |
| onReachBottom | loadProducts(false) 翻页加载（hasMore 控制） |

---

## 第16章 · 商品详情页

### 16.1 价格与销量区域（按商品类型）

| 商品类型 | 价格展示规范 |
|---------|------------|
| 消费商品 | 现价（$text-primary，32rpx/700）+ 原价（划线）+ 销量（已售 N件） |
| 换购商品 | 现金价 + 「+ N积分」($gold) 换购公式（例：¥128=¥80现金+4800积分） |
| 兑换商品 | N积分全额兑换 ($gold) + 无现金支付 |

**硬性规则：**
- 换购商品支付公式：「¥{现金}=¥{X}现金+{N}积分」
- 消费商品返还提示：「确认收货后获得 {N} 积分（70%生态+30%兑换）」

### 16.2 底部操作栏

| 按钮 | 规范 |
|------|------|
| 收藏 | 空心星→实心星($gold)，点击震动反馈 |
| 客服 | 跳转客服聊天页 |
| 加入购物车 | btn-outline，88rpx，加购成功 Toast |
| 立即购买 | btn-fire，88rpx，跳转确认订单页 |

---

## 第17章 · 确认订单页

### 17.1 订单类型与提交逻辑

| 订单类型 | 流程 |
|---------|------|
| 消费订单 | 预下单 → 唤起微信/支付宝支付 → 支付成功 → 创建订单 → 跳转订单详情 |
| 换购订单 | 预下单 → 验证银行卡绑定 → 冻结积分 → 创建订单 → 跳转订单详情 |
| 兑换订单 | 预下单 → 冻结积分 → 创建订单 → 跳转订单详情 |

### 17.2 换购订单资金拆分 UI（70%/30%）

**位置：** 确认订单页，商品清单与结算栏之间

```html
<!-- 资金分配说明卡片 -->
<view class="fund-allocation-card">
  <view class="card-title">资金自动分配说明</view>
  <view class="allocation-item">
    <view class="allocation-icon">①</view>
    <view class="allocation-text">
      <text class="amount">70% 资金</text>
      <text class="desc">→ 平台代付至您的绑定银行卡（自动处理）</text>
    </view>
  </view>
  <view class="allocation-item">
    <view class="allocation-icon">②</view>
    <view class="allocation-text">
      <text class="amount">30% 金额</text>
      <text class="desc">→ 转化为等值消费积分，存入您的积分账户</text>
    </view>
  </view>
  <view class="allocation-footer">
    换购订单完成后，积分将直接可用于兑换商城，全部流程自动完成
  </view>
</view>
```

### 17.3 银行卡绑定强提示

- **换购下单前检测：** 未绑定 → 弹窗「请先绑定银行卡」+「去绑定」(btn-gold) +「稍后再说」
- **解绑提示：** 解绑前 Toast「解绑后如需换购需重新绑定」

---

## 第18章 · 用户中心（User）

### 18.1 VIP 能量球进度（v5.2 修正：V1-V8）

**⚠️ 重要修正：** 原 v5.1 第18章描述 V1~V9（9个）与补充项2冲突。**统一修正为 V1-V8（8级）。**

```scss
// VIP 等级规范（v5.2 统一）
$vip-levels: (
  "V1": (name: "创客", threshold: 5000,   dailyReward: 50),
  "V2": (name: "达人", threshold: 10000,  dailyReward: 50),
  "V3": (name: "合伙人", threshold: 30000, dailyReward: 900),
  "V4": (name: "总监", threshold: 100000, dailyReward: 900),
  "V5": (name: "经理", threshold: 300000, dailyReward: 900),
  "V6": (name: "总裁", threshold: 1000000, dailyReward: 900),
  "V7": (name: "董事", threshold: 3000000, dailyReward: 900),
  "V8": (name: "创始人", threshold: 8000000, dailyReward: 900)
);

// UI 规范：
// - 统一使用 8 个能量球（V1-V8），V9 不存在
// - VIP 进度条分为 8 等分，每个能量球对应一个等级里程碑
// - 各等级升级后，能量球永久激活发光
```

### 18.2 昨日分红 Banner

- 毛玻璃卡片，shadow-gold 发光效果
- 点击跳转签到页
- 签到成功后 Banner 更新为当日已签到态（disabled）

---

## 第19章 · 增值理财页（Wealth）

### 19.1 增值理财页入口拦截（v5.2 完善）

| 用户状态 | 入口表现 | 处理 |
|---------|---------|------|
| 未实名认证 | disabled 态 | 显示「请先完成实名认证」+ 跳转认证页按钮 |
| 未成年（<18岁） | disabled 态 | 显示「暂不支持 18 岁以下用户参与理财」 |
| 已实名成年用户 | 正常展示 | 正常进入理财项目列表 |

### 19.2 收益率展示规范（广告法合规）

| 要求 | 说明 |
|------|------|
| 标注方式 | 「历史参考年化收益率 5%~12%」，区间而非固定数字 |
| **禁止用语** | ❌「保证收益」❌「承诺回报」❌「稳赚不赔」❌「固定收益」 |
| **合规用语** | ✅「预期收益」✅「历史参考」✅「年化收益率（仅供参考）」 |
| 风险提示 | 页面底部展示「理财有风险，投资需谨慎。历史收益不代表未来表现。」 |

**高收益项目警告：**
- 年化收益率 > 15% → 额外展示「高风险项目，请谨慎投资」红色警告标签
- 页面底部：风险等级标签（高/中/低风险），使用 $danger/$warning/$success

### 19.3 首次投资风险确认

- **首次进入理财申购页：** 强制展示风险确认对话框
- **一生一次：** 二次投资不再弹出
- **对话框内容：** 「理财有风险，投资需谨慎。历史收益不代表未来表现。请确认您已了解相关风险。」
- **必须操作：** 用户必须勾选「我已阅读并理解理财风险」+ 点击「确认投资」才可继续申购

---

# 第四部分：全局协议

## 第20章 · 双积分体系 UI 统一规范（v5.2 重点）

### 20.1 积分类型视觉区分标准

| 积分类型 | 颜色 | 标签样式 | 用途说明 |
|---------|------|---------|---------|
| **生态积分** | $gold (#C4A57B) | 金色标签「生态」 | 可理财/可换购/可分润/可分红 |
| **消费积分** | #7F9C89（绿松石色） | 绿松石标签「兑换」 | 仅限兑换商城兑换商品 |

### 20.2 各页面积分展示规范

| 页面 | 展示要求 | 异常状态 |
|------|---------|---------|
| 首页资产卡 / 用户中心资产条 | ✅ 三栏区分（总资产/生态积分/消费积分） | 金色标签/绿松石标签 |
| 积分明细页 | ✅ 收支列表区分积分类型 | 来源标注色与积分类型一致 |
| 确认订单页-积分抵扣区 | ✅ 须明确标注「生态积分抵扣」 | 标签颜色区分，未可用时置灰提示 |
| 购物车结算栏 | ✅ 须明确标注「生态积分抵扣」 | 标签颜色区分，未可用时置灰提示 |
| 增值理财页-申购区 | ✅ 仅显示生态积分余额 | 消费积分区显示「不可用于理财」 |
| 兑换商城 | ✅ 仅显示消费积分余额 | 生态积分显示「不可用于兑换」 |
| 推广分享页-奖励展示 | ✅ 奖励积分数标注类型 | 「+50生态积分（推荐奖励）」 |

### 20.3 积分不足的 UI 反馈

```
生态积分不足：提示「生态积分不足，当前可用 {N}，无法完成换购/理财」
消费积分不足：提示「兑换积分不足，当前可用 {N}，无法完成兑换」
混合场景：优先消耗生态积分，消费积分作为补充
积分显示精度：积分取整（向下取整），不显示小数
```

---

## 第21章 · 路由规范

### 21.1 路由方法使用规范

| 方法 | 使用场景 | 典型触发 |
|------|---------|---------|
| SwitchTab | tabBar 页面跳转（首页/分类/购物车/用户中心） | LuxuryTabbar 点击 |
| navigateTo | 普通页面跳转（商品详情/订单列表/搜索等） | 列表卡片点击 |
| redirectTo | 关闭当前页跳转（登录成功/注册成功） | 表单提交成功 |
| reLaunch | 清除所有页面栈跳转（退出登录后跳转首页） | 退出登录 |
| navigateBack | 返回上一页 | 顶部返回按钮 |

### 21.2 参数规范

| 项目 | 规范 |
|------|------|
| ID 传递 | 所有需要传递 ID 的页面，使用 `/pages/xxx/detail?id={id}` |
| 登录拦截 | redirect 参数携带来源 URL，例：`/pages/auth/login?redirect=/pages/order/confirm` |
| **安全红线** | 禁止在 URL 中传递敏感数据（金额/积分/密码） |
| **安全红线** | 禁止通过页面 URL 参数传递订单金额（必须从后端拉取） |

### 21.3 登录拦截路由守卫

```javascript
// 需要登录的操作（加购/下单/兑换/申购等）
const handleProtectedAction = () => {
  if (!checkAuth()) {
    uni.navigateTo({
      url: `/pages/auth/login?redirect=${encodeURIComponent(getCurrentPageUrl())}`
    });
    return;
  }
  // 继续执行操作...
};
```

---

## 第22章 · Token 刷新与登录失效流程

### 22.1 Token 生命周期

| Token 类型 | 有效期 | 用途 |
|-----------|--------|------|
| access token | 30 分钟 | 用于所有 API 请求 |
| refresh token | 7 天 | 用于刷新 access token |
| refresh token 过期 | 需重新登录 | 删除本地 Token，跳转登录页 |

### 22.2 Token 刷新流程

| 时机 | 判断 | 行为 |
|------|------|------|
| T-5min | access token 剩余 5 分钟 | 静默调用刷新接口 |
| 刷新成功 | - | access token 更新，继续使用 |
| 刷新失败（refresh 未过期） | - | 重试 1 次，仍失败则跳转登录 |
| refresh token 已过期 | - | 跳转登录页，携带 redirect 参数 |

---

## 第23章 · 列表性能规范

### 23.1 虚拟列表规范

| 适用场景 | 实现方案 |
|---------|---------|
| 商品列表 > 50 项 | 使用 uni-data-list 或 wxs 虚拟列表 |
| 订单列表 > 30 项 | 渲染性能比原生列表高 3-5 倍 |
| 积分明细 > 50 项 | 虚拟列表占位高度必须与真实数据一致 |

### 23.2 图片加载规范

| 项目 | 规范 |
|------|------|
| lazy-load | 列表图片使用 lazy-load 属性，屏幕外图片不加载 |
| 列表图规格 | 统一 200×200rpx，保证加载速度 |
| 详情图规格 | 750×750rpx |
| 图片格式 | 优先 WebP（体积比 JPG 小 30%），不支持时降级 JPG |

### 23.3 分页加载规范

| 项目 | 规范 |
|------|------|
| 每页数据量 | 20 条（平衡首屏加载速度和翻页体验） |
| 触底加载 | onReachBottom，距离底部 ≤ 100rpx 时触发 |
| 防重复加载 | loading=true 时禁止重复触发 onReachBottom |
| 加载失败 | 显示「加载失败，点击重试」可点击文本，不自动重试 |

---

## 第24章 · 网络状态与离线处理

### 24.1 全局网络状态监听

```javascript
// App 启动时注册
uni.onNetworkStatusChange((res) => {
  if (!res.isConnected) {
    showNetworkBanner('offline');  // 显示离线横幅
    pausePolling();  // 暂停轮询
  } else if (res.networkType !== 'none') {
    showNetworkBanner('reconnecting');  // 显示重连中
    resumePolling();  // 恢复轮询
    setTimeout(() => hideNetworkBanner(), 2000);  // 2s 后消失
  }
});
```

### 24.2 网络异常横幅规范

| 状态 | 背景色 | 文案 | 样式 |
|------|--------|------|------|
| 离线 | rgba(47,53,66,0.95) | 「当前网络不可用，部分功能暂不可用」 | 白色文字，32rpx，无图标 |
| 重连中 | rgba(212,133,10,0.90) | 「网络连接中...」 | 白色文字，32rpx |
| 恢复 | rgba(61,139,110,0.90) | 「网络已恢复」 | 白色文字，2s 自动消失 |

### 24.3 各页面离线处理策略

| 页面 | 离线处理 | 恢复后 |
|------|---------|--------|
| 列表页（商品/订单/积分） | 显示已缓存数据 + 「网络不可用，显示缓存数据」 | 重连后自动刷新 |
| 商品详情页 | 已缓存数据可浏览，新数据加载失败显示最后缓存内容 | 重连后刷新 |
| 确认订单/支付页 | 禁止提交操作，提示「网络不可用，请检查网络后重试」 | 重连前不可操作 |
| 物流页 | 暂停轮询，显示最后一条物流状态 + 「物流更新暂停」 | 重连后自动恢复 |

---

## 第25章 · 银行卡信息安全规范（PCI-DSS 合规）

### 25.1 前端展示安全

| 信息 | 展示规范 | 示例 |
|------|---------|------|
| 卡号 | 仅显示后 4 位，前位以 • 替代 | ••••••••••1234 |
| 持卡人姓名 | 脱敏显示 | 张*龙 |
| 预留手机号 | 脱敏显示 | 138****5678 |
| **安全红线** | 完整卡号禁止在任何页面展示 | - |

### 25.2 解绑安全流程

1. **解绑前验证：** 必须验证支付密码，不可跳过
2. **解绑确认：** showModal（confirmColor: #C0454A），内容「解绑后如需换购需重新绑定银行卡，是否确认解绑？」
3. **解绑后：** 清除本地缓存数据，服务器端解除绑定关系

### 25.3 防截屏规范

| 平台 | 实现方式 |
|------|---------|
| iOS | iOS WKWebView disableSnapshotApplication |
| Android | window FLAG_SECURE 防止截屏 |
| 截屏检测 | 截屏时记录日志但不阻断用户 |

---

## 第26章 · 页面间数据传递安全规范（v5.2 重点）

### 26.1 禁止做法（安全红线）

| ❌ 禁止 | 风险 |
|--------|------|
| 通过 localStorage/SessionStorage 传递订单商品数据和金额 | 可被用户篡改 |
| 通过 globalData 传递敏感数据（金额/积分/商品价格） | 可被用户篡改 |
| 前端计算订单最终金额 | 价格篡改风险 |

### 26.2 正确做法

| 场景 | 正确做法 | 安全说明 |
|------|---------|---------|
| 页面参数传递 | 仅传递 ID | 例：`/pages/product/detail?id=123` |
| 详情页数据拉取 | 根据 ID 从后端拉取最新商品详情和价格 | 以后端返回为准 |
| 购物车→确认订单 | 后端根据 cartItemIds 重新计算价格 | 防价格篡改 |
| 确认订单金额 | 后端计算并返回，前端仅展示 | 前端不做任何金额计算 |
| 积分抵扣 | 后端计算可用积分和抵扣上限 | 前端不传递积分余额到后端 |

### 26.3 订单金额防篡改规范

```
后端在创建订单时重新计算金额（不信任前端传入的金额参数）
后端记录商品下单时的单价（下单时间戳），用于后续对账
前端展示金额与后端计算金额不一致时，以后端为准并提示用户「价格已更新」
```

---

# 第五部分：组件状态矩阵（v5.2 新增）

## 第27章 · 完整组件状态矩阵

### 27.1 输入框状态矩阵

| 状态 | 视觉表现 |
|------|---------|
| Default | 浅灰边框 + placeholder 文字 |
| Focused | 金色边框($gold-on-light) + 外发光 4rpx + label 上浮 |
| Filled | label 保持浮动 + 正常边框 |
| Error | 红色边框 + 错误提示文字 + shake 动画 |
| Disabled | 灰色背景 + 不可编辑 + 50% 透明度 |
| Loading | 右侧 loading spinner + 不可编辑 |

### 27.2 卡片组件状态

| 状态 | 视觉表现 |
|------|---------|
| Default | $shadow-clay + $bg-secondary |
| Hover | scale(1.01) + $shadow-hover |
| Active/Pressed | scale(0.98) + 阴影减弱 |
| Loading | 骨架屏覆盖内容 |
| Selected | $shadow-gold + $border-gold |
| Disabled | 50% 透明度 + 不可点击 |

### 27.3 SKU 选择器状态

| 规格状态 | 视觉表现 |
|---------|---------|
| 未选 | 白底 + 1rpx $border-color 边框 |
| 已选 | $gold 背景 + 白字 |
| 不可选（库存0） | 灰色背景 + 删除线 + 不可点击 |

### 27.4 倒计时组件状态

| 剩余时间 | 视觉表现 |
|---------|---------|
| ≥ 1 天 | 「N天 HH:mm:ss」正常样式 |
| < 1 天 | 「HH:mm:ss」正常样式 |
| < 1 小时 | 「mm:ss」字体变 $danger |
| < 5 分钟 | 「mm:ss」+ pulse-dot 动画 + 字体 $danger |
| 归零 | 执行 onExpire 回调（关闭秒杀入口/关闭支付页） |

---

# 第六部分：性能验收 SOP（v5.2 新增）

## 第28章 · 性能验收标准与方法

### 28.1 性能指标定义

| 指标 | 预算值 | 定义 |
|------|--------|------|
| **FCP** | < 1.8s | First Contentful Paint，首次内容绘制 |
| **LCP** | < 2.5s | Largest Contentful Paint，最大内容绘制 |
| **首屏请求数** | < 15 个 | 首屏渲染前的请求数 |
| **资源总大小** | < 2MB | 首屏相关资源总和 |
| **CLS** | = 0 | Cumulative Layout Shift，布局偏移为 0 |
| **图片懒加载阈值** | 屏幕外 200rpx | 预加载提前量 |

### 28.2 验收方法

```bash
# 1. FCP / LCP 测量
# Chrome DevTools → Lighthouse → Run analysis
# 或 Performance 面板 → Timings → FCP/LCP 标记点

# 2. 首屏请求数统计
# Network 面板 → 过滤 Fetch/XHR → 计数首屏渲染前的请求
# 建议：资源合并 + 接口并行 + 懒加载非关键资源

# 3. 资源大小分析
# Lighthouse → Opportunities → 资源大小汇总
# 或 Network 面板 → Transfer Size 列求和

# 4. CLS 测量
# Lighthouse → Core Web Vitals → CLS 分数
# 常见 CLS 问题：
#   - 图片无宽高比 → 指定 aspect-ratio
#   - 骨架屏高度与真实内容不一致 → 严格对齐
#   - 字体加载导致文字跳动 → font-display: swap

# 5. 图片优化验收
# Lighthouse → Image formats → 确认使用 WebP
# 手动检查：单张图片 ≤ 200KB（列表图）/ ≤ 500KB（详情图）
```

### 28.3 首屏性能优化 checklist

```
[ ] 骨架屏占位与真实内容高度完全一致（CLS=0）
[ ] 图片指定宽高比（aspect-ratio）或固定尺寸
[ ] 非关键资源懒加载（路由懒加载/图片懒加载）
[ ] 接口并行请求（Promise.all）
[ ] SSR/SSG 优先（Nuxt 场景）
[ ] 资源压缩（JS/CSS/图片）
[ ] 缓存策略（Service Worker / HTTP Cache）
[ ] 移除未使用的依赖
```

---

# 第七部分：无障碍设计（WCAG 2.1 AA）

## 第29章 · WCAG 2.1 AA 合规检查清单

### 29.1 对比度要求

| 类型 | 要求 | 验证方法 |
|------|------|---------|
| 正文文字（< 18px / < 14px bold） | ≥ 4.5:1 | Lighthouse → Contrast |
| 大文字（≥ 18px / ≥ 14px bold） | ≥ 3.0:1 | Lighthouse → Contrast |
| **⚠️ 重点检查** | $gold (#C4A57B) 在 $bg-primary (#F8F7F4) 上对比度 3.2:1 ❌ | 浅色背景使用 $gold-on-light (#9B7E5E) ✅ |

### 29.2 可操作性要求

| 要求 | 测量标准 | 当前实现 |
|------|---------|---------|
| 可点击目标 ≥ 44×44px | WCAG 2.1 | 按钮高度 ≥ 88rpx ✅ |
| TabBar 图标 + 文字高度 | WCAG 2.1 | 100rpx 含安全区 ✅ |
| 列表项点击区域 ≥ 80rpx | 内部规范 | 符合 ✅ |

### 29.3 语义化要求

| 要求 | 实现方式 |
|------|---------|
| 表单 label 关联 | 使用 `for`/`id` 关联，或 placeholder + aria-label |
| 按钮文字 | 必须有文字内容或 aria-label |
| 图片 alt | 所有 `<image>` 组件必须有 alt 属性 |
| 焦点状态 | Tab 导航焦点状态可见（$gold 边框） |
| Modal 焦点锁定 | Modal 弹出后焦点锁定在 Modal 内 |

### 29.4 键盘操作要求

| 要求 | 实现方式 |
|------|---------|
| Tab 导航顺序 | 符合视觉顺序（从上到下/从左到右） |
| 焦点状态可见 | 使用金色边框 + outline 标识 |
| Modal 焦点锁定 | Trap focus 在 Modal 内，ESC 关闭 |
| Skip link | 提供「跳转到主要内容」链接（可选） |

---

# 附录

## 附录A · Design Token 速查表（SCSS）

```scss
// ============================================================
// 集享公社 Design Token v5.2 · 完整速查表
// ============================================================

// --- 色彩 ---
// 背景
$bg-primary:      #F8F7F4;
$bg-secondary:    #FFFFFF;
$bg-tertiary:     #EFEEEA;
$warm-yellow:     #EDE9E1;

// 金色
$gold:            #C4A57B;      // 主金
$gold-light:      #DFD0B5;      // 浅金
$gold-dark:       #9B7E5E;      // 深金
$gold-on-light:   #9B7E5E;      // 浅色背景专用（对比度合规）

// 藏青
$mineral-navy:    #2F3542;      // 藏青（主文字/深色卡片）
$mineral-slate:   #707B8C;      // 蓝灰（次级文字）

// 语义色
$success:         #3D8B6E;      // 绿
$warning:         #D4850A;      // 橙
$danger:          #C0454A;      // 红

// 文字
$text-primary:    #141414;
$text-secondary:  #5C5C5C;
$text-muted:      #8A8A8A;
$text-inverse:    #FFFFFF;

// 边框
$border-color:    rgba(20,20,20,0.08);
$border-gold:    rgba(184,152,118,0.40);

// --- 字体 ---
$font-body:       28rpx;
$font-title:      32rpx;
$font-heading:    40rpx;
$font-hero:       48rpx;
$font-asset:      52rpx;

// --- 间距 ---
$space-xs:    8rpx;
$space-sm:    16rpx;
$space-base:  28rpx;
$space-lg:    40rpx;
$space-xl:    56rpx;
$space-2xl:   72rpx;

// --- 圆角 ---
$radius-sm:   12rpx;
$radius-md:   16rpx;
$radius-lg:   24rpx;
$radius-xl:   28rpx;
$radius-full: 9999rpx;

// --- 阴影 ---
$shadow-clay:   0 12rpx 48rpx rgba(47,53,66,0.06);
$shadow-hover:  0 20rpx 40rpx rgba(0,0,0,0.08);
$shadow-fire:   0 12rpx 40rpx rgba(196,165,123,0.22);
$shadow-gold:   0 0 20rpx rgba(196,165,123,0.30);
$shadow-asset:  0 16rpx 64rpx rgba(0,0,0,0.28);
$shadow-btn:    0 12rpx 40rpx rgba(47,53,66,0.22);

// --- 动效时长 ---
$duration-instant:  0.12s;
$duration-fast:    0.18s;
$duration-normal:   0.25s;
$duration-slow:    0.38s;
$duration-animate: 1.4s;
$duration-marquee: 20s;

// --- 按钮 ---
$btn-height-sm:   64rpx;
$btn-height-base: 80rpx;
$btn-height-lg:   88rpx;
$btn-height-xl:   96rpx;

// --- TabBar ---
$tabbar-height:    100rpx;
$tabbar-icon-size: 48rpx;
```

## 附录B · 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v4.0 | 2026-05-28 | 初始版本 |
| v4.5 | 2026-05-28 | 新增众筹/银行卡/客服/物流/评价/视频/发票/推广/管理后台等16个章节 |
| v4.6 | 2026-05-28 | P1新增：支付记录页/退款记录页/商户管理后台/支付与资金后台/后台权限管理 |
| v5.0 | 2026-05-28 | 用户端页面完整分章版，按用户浏览路径逐页细化37个章节 |
| **v5.2** | 2026-05-28 | 8项P0/P1修复 + 4项P2优化：V9冲突修正/金色对比度/Token重构/暗色模式/字体精简/状态矩阵/安全区完善/文档结构重组 |

---

**本文档版权归集享公社前端团队所有，仅限内部使用。**
