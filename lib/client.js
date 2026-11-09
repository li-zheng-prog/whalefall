window.__ModuleLoader__.load({
  id: "whalefall",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    var DSH_BG_CSS = `

/* ---------- 根透明：让固定背景层从最底层透出 ---------- */
html,
body {
  background: transparent !important;
}

#root {
  background: transparent !important;
}

/* ---------- 主题令牌：浅色默认，深色覆盖 ---------- */
body {
  --dsbg-glass: rgba(255, 255, 255, 0.72);
  --dsbg-glass-border: rgba(65, 100, 148, 0.15);
  --dsbg-glass-shadow: 0 1px 3px rgba(37, 68, 110, 0.05),
    0 12px 36px rgba(37, 68, 110, 0.09);
  --dsbg-glass-ring: inset 0 0 0 1px rgba(255, 255, 255, 0.88);
  /* 浮层（tooltip / 会话信息卡）：悬浮在任意内容之上，比内容卡片更实 */
  --dsbg-float: rgba(255, 255, 255, 0.84);
  --dsbg-float-border: rgba(65, 100, 148, 0.18);
  --dsbg-float-shadow: 0 2px 6px rgba(37, 68, 110, 0.08),
    0 18px 48px rgba(37, 68, 110, 0.16);
  --dsbg-float-key: rgba(15, 17, 21, 0.08);
  --dsbg-veil: rgba(246, 249, 253, 0.18);
  --dsbg-sidebar: rgba(246, 250, 255, 0.48);
  --dsbg-sidebar-border: rgba(65, 100, 148, 0.14);
  --dsbg-sidebar-highlight: inset -1px 0 0 rgba(255, 255, 255, 0.60);
  --dsbg-sidebar-sheen: linear-gradient(155deg, rgba(255, 255, 255, 0.54),
    rgba(238, 246, 255, 0.08) 55%, rgba(255, 255, 255, 0.20));
  --dsbg-sidebar-blur: 26px;
  --dsbg-sidebar-saturate: 125%;
  --dsbg-sidebar-brightness: 1.02;
  --dsbg-sidebar-shadow: 0 0 24px rgba(45, 78, 124, 0.06);
}

body[data-ds-dark-theme] {
  --dsbg-glass: rgba(13, 15, 19, 0.55);
  --dsbg-glass-border: hsla(0, 0%, 100%, 0.08);
  --dsbg-glass-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2),
    0 0 4px 0 rgba(0, 0, 0, 0.02), 0 12px 32px 0 rgba(0, 0, 0, 0.08);
  --dsbg-glass-ring: inset 0 0 0 1px hsla(0, 0%, 100%, 0.08);
  /* 浮层：比周围更亮一档，才有“浮起”的层次 */
  --dsbg-float: rgba(30, 36, 46, 0.74);
  --dsbg-float-border: hsla(0, 0%, 100%, 0.12);
  --dsbg-float-shadow: 0 2px 8px rgba(0, 0, 0, 0.38),
    0 20px 48px rgba(0, 0, 0, 0.42);
  --dsbg-float-key: hsla(0, 0%, 100%, 0.12);
  --dsbg-veil: rgba(6, 9, 14, 0.22);
  /* 侧边栏专属：更透 + 更强磨砂 */
  --dsbg-sidebar: rgba(22, 30, 44, 0.32);
  --dsbg-sidebar-border: hsla(0, 0%, 100%, 0.14);
  --dsbg-sidebar-highlight: inset -1px 0 0 hsla(0, 0%, 100%, 0.10),
    inset 1px 0 0 hsla(0, 0%, 100%, 0.05),
    inset -1px 0 0 hsla(0, 0%, 100%, 0.05),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.05);
  --dsbg-sidebar-sheen: linear-gradient(160deg, hsla(0, 0%, 100%, 0.10) 0%,
    hsla(0, 0%, 100%, 0) 38%, hsla(0, 0%, 100%, 0) 72%, hsla(0, 0%, 100%, 0.03) 100%);
  --dsbg-sidebar-blur: 28px;
  --dsbg-sidebar-saturate: 180%;
  --dsbg-sidebar-brightness: 1.22;
  --dsbg-sidebar-shadow: 0 0 18px rgba(0, 0, 0, 0.18);
}

/* ---------- 背景层 ---------- */
#dsh-ds-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  /* 注意：这里不再使用进场 blur/opacity 动画（原 dsh-ds-enter）。
     全屏 WebGL + mask 图层在 filter: blur() 下会被合成器降采样再放大，
     浅色低对比极光会因此出现大块硬边色斑（“渲染出错”）。壁纸应首帧即以最终形态出现。 */
  background: #f2f6fc;
}

#dsh-ds-bg.dsh-ds-dark {
  background: #0a0a0a;
}

#dsh-ds-aurora,
#dsh-ds-constellation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  
  mask: linear-gradient(#000000fc 0%, #000000e8 8.98%, transparent 100%);
  -webkit-mask: linear-gradient(#000000fc 0%, #000000e8 8.98%, transparent 100%);
}

#dsh-ds-constellation {
  background: transparent;
}

/* 浅色极光直接绘制到不透明 2D 画布，避免 WebGL 色块传入显示层。 */
#dsh-ds-aurora2d {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

#dsh-ds-bg:not(.dsh-ds-dark) #dsh-ds-aurora {
  visibility: hidden;
}

#dsh-ds-bg.dsh-ds-dark #dsh-ds-aurora2d {
  display: none;
}

/* 两种主题共享鲸鱼运动；浅色使用蓝色墨点，深色保持 screen 发光。 */
.dsh-ds-whale {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  mix-blend-mode: normal;
  z-index: 2;
}
#dsh-ds-bg.dsh-ds-dark .dsh-ds-whale { mix-blend-mode: screen; }
#dsh-ds-bg:not(.dsh-ds-dark) #dsh-ds-constellation {
  mask: linear-gradient(#0009, #0007 60%, transparent);
  -webkit-mask: linear-gradient(#0009, #0007 60%, transparent);
}

/* ===================================================================== *
 * 外壳透明化（语义锚点：data-slot / data-*，不依赖构建哈希类名）
 * ===================================================================== */

/* 外壳 frame：root 槽位的直接子块 */
[data-slot="root"] > div {
  background: transparent !important;
}

/* 中间栏：直接包含 main 槽位的元素 */
:has(> [data-slot="main"]) {
  background: transparent !important;
}

/* 会话视图根：main.conversation 槽位下的内容块（浅色加薄纱保证可读性） */
[data-slot="main.conversation"] > div {
  background: var(--dsbg-veil) !important;
}

/* 右侧栏列（DSH 自带语义属性）与空面板宿主：
   列本底由下方“右侧面板”一节铺薄纱（与主窗口对话区一致），这两层保持透明，
   避免叠出更深的底色。 */
[data-slot="rightbar"] > div,
[class*="_emptyTabHost_"] {
  background: transparent !important;
}

/* 底部状态/外壳行（存在时也保持透明） */
[data-shell-bottom] {
  background: transparent !important;
}

/* ---------------- 侧边栏：悬浮圆角玻璃卡片 ----------------
   卡片直接画在侧栏内容根元素上，外层列只负责布局（薄纱底、无边框）。
   玻璃材质（底色 + 斜向高光 + 内高光描边 + 背景高斯模糊）画在根元素的
   ::before 上，根元素自己只留描边和外侧投影。两个关键点：
   1) 不能把 backdrop-filter 直接写在根元素上：它会为固定定位后代创建包含块。
      DSH 0.2.2 把 Windows 标题栏的侧栏开关渲染在侧栏根节点里
      （[data-windows-titlebar] 下它靠 position:fixed; left:12px; top:6px
      相对视口定位在标题栏左上角），写在根元素上会把开关从标题栏拽进卡片
      左上角、正好压在鲸鱼 logo 上，标题栏里只剩一个空位。放到 ::before 上
      就没有这个副作用（伪元素没有后代，不创建包含块）。
   2) 负 z-index 的 ::before 需要作用域，否则会被后插入的壁纸层
      （#dsh-ds-bg, z-index:-1）盖住，表现就是“卡片完全没出现”。
      因此根元素用 position:relative; z-index:0 建立层叠上下文，把 ::before
      圈在卡片内部；用 0 而不是 1，是为了让整张卡片留在普通定位元素这一层，
      仍低于拖拽手柄（z-index:11）和浮层（z-index:20）。 */
:has(> [data-slot="sidebar"]) {
  /* 列本底铺与主界面相同的薄纱：卡片四周的 12px 留白才不会露出“裸壁纸”，
     也不会形成一圈比周围更深的描边。 */
  background: var(--dsbg-veil) !important;
  border-right-color: transparent !important;
  box-shadow: none !important;
  /* 允许卡片投影落到列外（否则模糊投影会被列裁成硬边矩形）。 */
  overflow: visible !important;
}

/* 列宽/折叠动画期间保持裁切，避免动画帧里卡片内容溢出到主界面 */
[data-animating] :has(> [data-slot="sidebar"]) {
  overflow: hidden !important;
}

[data-slot="sidebar"] > div {
  /* 侧栏根元素自带内联 width（等于整列宽度），只加 margin 会让它在右侧多出
     24px 被列裁掉：右边留白消失、右侧内容（会话时间、工作区按钮）被切。
     用 max-width 收回来，左右留白才对称。 */
  position: relative;
  z-index: 0;
  max-width: calc(100% - 24px) !important;
  margin: 12px;
  height: calc(100% - 24px) !important;
  /* 玻璃材质在 ::before 上（原因见上方“侧边栏”一节的注释）。 */
  background: transparent !important;
  border: 1px solid var(--dsbg-sidebar-border);
  border-radius: 16px;
  box-shadow:
    0 2px 6px rgba(37, 68, 110, 0.08),
    0 16px 40px rgba(37, 68, 110, 0.16);
  overflow: hidden;
}

/* 玻璃层：高斯模糊只虚化卡片背后的壁纸/极光，卡片内的文字与图标保持清晰
   （无需再套滤镜，避免整块文字发糊）。卡片外围 12px 留白不在模糊范围内——
   列本身只有薄纱，留白处仍是清晰壁纸，保留“卡片浮在壁纸上”的观感。
   圆角用 inherit：折叠态的 12px 也会自动跟随，无需重复覆盖。 */
[data-slot="sidebar"] > div::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--dsbg-sidebar-sheen), var(--dsbg-sidebar);
  box-shadow: var(--dsbg-sidebar-highlight);
  backdrop-filter: blur(var(--dsbg-sidebar-blur)) saturate(var(--dsbg-sidebar-saturate));
  -webkit-backdrop-filter: blur(var(--dsbg-sidebar-blur)) saturate(var(--dsbg-sidebar-saturate));
}

body[data-ds-dark-theme] [data-slot="sidebar"] > div {
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.25),
    0 16px 40px rgba(0, 0, 0, 0.36);
}

/* 折叠成图标轨道（窄）时收窄留白与圆角，避免卡片过窄 */
[data-sidebar-collapsed] [data-slot="sidebar"] > div {
  max-width: calc(100% - 12px) !important;
  margin: 6px;
  height: calc(100% - 12px) !important;
  border-radius: 12px;
}

/* ---------------- 输入框卡片：玻璃 ---------------- */
[data-composer-card] {
  position: relative;
  background: var(--dsbg-glass) !important;
  border-color: var(--dsbg-glass-border) !important;
  box-shadow: var(--dsbg-glass-shadow) !important;
}

/* 模糊放在 ::before：卡片自身若带 backdrop-filter 会建立 backdrop root，
   卡片内弹出的命令菜单/弹层无法再模糊页面内容（文字会透叠、不可读）。 */
[data-composer-card]::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
}

/* 输入框座位：去掉向不透明底色的渐隐，让极光从玻璃下透出 */
[data-composer-seat] {
  background: transparent !important;
}

/* ===================================================================== *
 * 聊天内容玻璃（类名模式匹配，不绑定构建哈希）
 * ===================================================================== */

/* 聊天区卡片：改动文件、计划、定时任务、工具问答、审批、附件等
   统一玻璃；排除卡片内部的覆盖按钮/标题等子元素，以及菜单/弹窗表面。 */
[data-conversation-region="chat"] [class*="_card"]:not([data-composer-card]):not([class*="_cardPreview"]):not([class*="_cardOpen"]):not([class*="_cardMain"]):not([class*="_cardContent"]):not([class*="_cardTitle"]):not([class*="_cardDescription"]):not([class*="_cardIcon"]):not([class*="_cardDetails"]):not([class*="_cardIdentity"]):not([data-menu-material] *):not([role="dialog"] *) {
  background: var(--dsbg-glass) !important;
  backdrop-filter: blur(14px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(140%) !important;
  box-shadow: var(--dsbg-glass-ring) !important;
}

/* 卡片自己的不透明头部（如改动文件卡的 header）：透明化，让整卡透光 */
[data-conversation-region="chat"] [class*="_card"] > button:first-child {
  background: transparent !important;
}

[data-conversation-region="chat"] [class*="_card"] > button:first-child:hover {
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent) !important;
}

/* 交付文件卡（类名含 _file 的卡片本体；排除内部图标/文字块） */
[data-conversation-region="chat"] [class*="_file"]:not([class*="_fileIcon"]):not([class*="_fileBody"]):not([class*="_fileName"]):not([class*="_fileHeader"]):not([class*="_filePath"]):not([class*="_fileCount"]):not([class*="_fileLabel"]):not([data-menu-material] *):not([role="dialog"] *) {
  background: var(--dsbg-glass) !important;
  backdrop-filter: blur(14px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(140%) !important;
  box-shadow: var(--dsbg-glass-ring) !important;
}

/* 交付输出块等 _output 面板 */
[data-conversation-region="chat"] [class*="_output"]:not([data-menu-material] *):not([role="dialog"] *) {
  background: var(--dsbg-glass) !important;
  backdrop-filter: blur(14px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(140%) !important;
  box-shadow: var(--dsbg-glass-ring) !important;
}

/* 消息气泡：只命中气泡表面本身。共享气泡组件的类名是 _bubble_<hash>（带尾部
   哈希），而 0.2.2 的 QuestionReplyView 在气泡外新增了方形包装层
   _bubbleWidth；旧写法 [class*="_bubble"] 会把包装层也刷成玻璃，方形底在
   圆角气泡四角露出来，看起来就是“圆角失效”。
   注意排除 Tooltip：浮层的类名同样是 _bubble_<hash>（role="tooltip"），但它的
   文字色是 DSH 写死的白色（--dsw-static-neutral-bluish-00），直接刷成玻璃会
   白底白字。Tooltip 的玻璃材质与文字色在下方「浮层」一节单独接管。 */
[class*="_bubble_"]:not([role="tooltip"]) {
  background: var(--dsbg-glass) !important;
  backdrop-filter: blur(14px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(140%) !important;
  box-shadow: var(--dsbg-glass-ring) !important;
}

/* ---------- 浮层：Tooltip 与会话信息卡跟随主题 ----------
   DSH 把浮层材质写死在组件里，浅色主题下会留下深色板块：
   1) Tooltip（_bubble_<hash>，role="tooltip"）的底色 --dsw-alias-tooltip-bg
      在浅色主题是深灰（static-neutral-bluish-850），文字色
      --dsw-static-neutral-bluish-00 恒为白；快捷键键帽底色
      --dsw-alias-tooltip-key-bg = color-mix(tooltip-bg, white 18%)，会跟着
      变亮到几乎看不见，所以一并按主题重设。
   2) 会话 / 工作区信息卡（共享 HoverCard）：卡片类写死
      --dsw-hovercard-bg:#2C2C2E，内容类又写死 #fff / #cfd3d6 / #adb2b8，
      复制反馈 _copied_ 也是 #fff，浅色主题下就是一块压不住的黑板。
   这里只换材质和文字色，位置、宽度、圆角、动效仍交给 DSH：Tooltip 用
   role="tooltip" 定位；信息卡用 DSH 自己写在内联 style 上的
   --dsh-hover-preview-fade 变量定位（_preview_ 是文件预览卡，底色本来
   跟随主题，排除）。底色用 --dsbg-float（比 --dsbg-glass 更实一档，悬浮在
   任意内容上都压得住），文字改用 label 语义色：浅色主题是浅色玻璃 + 深色
   文字，深色主题是深色玻璃 + 浅色文字。 */
[role="tooltip"] {
  --dsw-alias-tooltip-bg: var(--dsbg-float) !important;
  --dsw-static-neutral-bluish-00: var(--dsw-alias-label-primary) !important;
  --dsw-alias-tooltip-key-bg: var(--dsbg-float-key) !important;
  background-color: var(--dsbg-float) !important;
  border: 1px solid var(--dsbg-float-border);
  box-shadow: var(--dsbg-float-shadow);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
}

div[style*="--dsh-hover-preview-fade"]:not([class*="_preview_"]) {
  --dsw-hovercard-bg: var(--dsbg-float) !important;
  background-color: var(--dsbg-float) !important;
  border: 1px solid var(--dsbg-float-border);
  box-shadow: var(--dsbg-float-shadow);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
}

div[style*="--dsh-hover-preview-fade"]:not([class*="_preview_"]) :is([class*="_hoverTitle"], [class*="_copied_"]) {
  color: var(--dsw-alias-label-primary) !important;
}

div[style*="--dsh-hover-preview-fade"]:not([class*="_preview_"]) :is([class*="_hoverPath"], [class*="_hoverTime"]) {
  color: var(--dsw-alias-label-secondary) !important;
}

div[style*="--dsh-hover-preview-fade"]:not([class*="_preview_"]) [class*="_hoverStatus"] {
  color: var(--dsw-alias-label-tertiary) !important;
}

/* 代码/工具块、banner、复制按钮 */
[class*="_block_"],
[class*="_bannerWrap"],
[class*="_copyButton"] {
  background: var(--dsbg-glass) !important;
  backdrop-filter: blur(14px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(140%) !important;
  box-shadow: var(--dsbg-glass-ring) !important;
}

/* ---------------- 外壳杂项 ---------------- */

/* 会话列表底部渐隐条：DSH 用不透明侧栏底色做渐变，透明化避免灰色“发光带” */
[class*="_fade"] {
  background: transparent !important;
}

/* 启动屏 */
[class*="_boot_"] {
  background: transparent !important;
}

/* ---------- DSH 0.2.2 外壳新增的不透明表面 ----------
   0.2.2 的 Windows 自定义标题栏（html[data-windows-titlebar]）给中间列铺了
   --dsw-alias-bg-base 不透明底色，并给标题栏拖拽条 .frame::before 铺了
   --dsw-specific-sidebar-fill；这两层纯色会把固定壁纸层完全挡住（表现为
   侧栏能看到极光、主聊天区与标题栏却是纯白）。root 槽位到 main 槽位的
   整条祖先链透明化后，壁纸才能从外壳底下透出。 */
:has([data-slot="main"]) {
  background: transparent !important;
}

/* Windows 标题栏拖拽条（frame::before）：0.2.2 在这条上铺 --dsw-specific-sidebar-fill。
   这里换成和主界面同一层薄纱（--dsbg-veil），否则标题栏直接露壁纸、比下面带薄纱
   的主界面更蓝更饱和，观感上“顶头和主界面透明度不统一”。 */
[data-slot="root"] > div::before {
  background: var(--dsbg-veil) !important;
}

/* 桌面端右上角三颗原生窗口按钮（Window Controls Overlay）：桌面 preload 会创建
   一个隐藏探针 span（内联 background-color:var(--dsw-specific-sidebar-fill)），把
   它的计算背景色同步给 Electron 当 WCO 底色 —— 于是按钮区永远压着一块 #f9fafb
   白底。把探针背景改成透明后，Electron（支持 rgba() 透明 WCO 底色）会让原生按钮
   直接叠在壁纸/薄纱上。只改 background-color，保留 color，按钮图形颜色不变。 */
span[style*="--dsw-specific-sidebar-fill"] {
  background-color: transparent !important;
}

/* 中间列在 Windows 标题栏布局下带 16px 左上圆角（overflow:hidden 会按圆角
   裁剪内容）；透明后统一改成直角，避免窗口边角露出圆角缺口。 */
[data-windows-titlebar] :has(> * > [data-slot="main"]) {
  border-radius: 0 !important;
}

/* ---------- DSH 0.2.2 插件页 sticky 页头 ----------
   插件管理页的 pageBar 用 ::before 铺一条 --dsw-alias-bg-base 不透明底色，用来
   遮住从页头下方滚过的内容；于是整条页头是白色实底，壁纸到这里就断掉。未滚动
   时改为透明（与壁纸一致），滚动时换成玻璃材质，滚过的内容仍然可读。
   滚动后这条玻璃页头做成四角圆角的悬浮条（半径 16px，和左侧栏卡片一致）；
   紧凑态页头底部那根 0.5px 分隔线跟随同样的圆角，不会以直线横穿圆角缺口。
   页头原本铺满整个内容区（pageBar 还额外加了一份 --plugin-page-scrollbar-width
   补偿滚动条），比下方居中的内容列（pageHead 最大 960px）长出很多，看起来就是
   一条过长的横条。这里把玻璃底和分隔线收窄到内容列 + 左右各 24px 内边距并居中：
   与内容列左右对齐，标题/按钮距条边各留 24px，不会被圆角或边缘贴住。
   宽度必须跟着内容列伸缩，不能只写 max-width: 1008px —— 1008px 只对应“内容列
   还是 960px 上限”的宽窗口。窗口变窄（非全屏 / 还原窗口）后内容列 = pageBar 宽
   - 2×页边距，而 pageBar 仍等于整页宽；固定 max-width 会让玻璃条一直铺到整页宽
   （内容列左右各 48px，看起来没有跟着缩小），右端还会伸进 5px 滚动条槽被裁平，
   右上/右下圆角就成了缺口。下面以 100% = pageBar 宽 计算：扣掉左右页边距再各加
   24px（+48px），并用 100% - 2×滚动条宽 兜底，保证圆角不落进滚动条槽；宽窗口下
   该式子自然落在 1008px 上限，与旧版表现一致。 */
[data-natural]::before {
  background: transparent !important;
}

[data-natural][data-scrolled]::before {
  background: var(--dsbg-glass) !important;
  backdrop-filter: blur(14px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(140%) !important;
  border-radius: 16px;
  left: 0 !important;
  right: 0 !important;
  width: min(calc(100% - 2 * var(--plugin-page-inset) + 48px),
    calc(100% - 2 * var(--dsh-scrollbar-width, 5px))) !important;
  max-width: 1008px !important;
  margin-inline: auto !important;
}

[data-natural][data-compact]::after {
  border-radius: 0 0 16px 16px;
  left: 0 !important;
  right: 0 !important;
  width: min(calc(100% - 2 * var(--plugin-page-inset) + 48px),
    calc(100% - 2 * var(--dsh-scrollbar-width, 5px))) !important;
  max-width: 1008px !important;
  margin-inline: auto !important;
}

/* ---------- 设置弹窗：去掉整屏黑色遮罩 ----------
   设置弹窗打开时，DSH 会在 body 末尾 portal 一层整屏 .mask：浅色 #0000003d
   （24% 黑）、深色 #00000080（50% 黑），把主界面连同壁纸整体压暗，看起来
   就是“主界面蒙了一层阴影”；而且这层遮罩从标题栏下沿才开始，壁纸上方还会
   露出一道接缝。这里只清掉设置弹窗自己的遮罩：主界面与壁纸保持原亮度，设置
   面板仍靠自身面板阴影浮起；遮罩节点仍在，点击空白关闭不受影响。
   用设置面板的语义标记 data-shortcut-modal="settings" 反向选中它紧邻的遮罩
   兄弟节点，不依赖构建哈希类名（0.2.2 的结构是 overlay > [mask, panel]）。 */
div[aria-hidden="true"]:has(+ [data-shortcut-modal="settings"]) {
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* ---------- 会话清理：删除/移除确认弹窗去掉整屏黑色遮罩 ----------
   session-cleaner 的确认弹窗（.dsc-mask）和设置弹窗同一个毛病：遮罩从标题栏
   下沿（40px）才开始铺 --dsw-alias-bg-mask-1（50% 黑）+ 模糊，于是顶上那条
   标题栏保持原亮度、下面整个主窗口被压暗，颜色在 40px 处对不上，看起来就是
   “主窗口和顶栏颜色不一致”。这里和设置弹窗一样只清掉遮罩底色与模糊：主窗口
   与顶栏都保持原亮度，弹窗靠自身阴影浮起；遮罩节点仍在（它绑定着 mousedown
   关闭逻辑），点击空白关闭不受影响。 */
.dsc-mask {
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* ---------- DSH 共享弹窗（Modal）：去掉整屏黑色遮罩 ----------
   删除工作区、归档会话、安装插件等 DSH 弹窗都走共享的 Modal 组件，结构是
   overlay > [mask(aria-hidden) + dialog(role="dialog" aria-modal="true")]。
   遮罩同样从标题栏下沿（--dsh-frame-chrome-top，40px）才开始铺
   --dsw-alias-bg-mask-1 和模糊（底色画在遮罩的 ::after 上），于是顶上标题栏
   保持原亮度、下面主界面被压暗，40px 处形成一条“亮顶栏 / 暗主窗口”的接缝。
   这里用“遮罩的下一个兄弟是 aria-modal 对话框”这条语义反查遮罩，把遮罩本身
   和 ::after 的底色、模糊一起清掉：主界面与顶栏都保持原亮度，弹窗靠自身阴影
   浮起；遮罩节点仍在（绑定点按关闭），点击空白关闭不受影响。设置弹窗自己的
   data-shortcut-modal 规则见上方，两条互不影响。 */
div[aria-hidden="true"]:has(+ [role="dialog"][aria-modal="true"]),
div[aria-hidden="true"]:has(+ [role="dialog"][aria-modal="true"])::after {
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* ---------- 轨迹视图：拆掉整块白底 ----------
   轨迹视图根 .eciBTa_root 铺 --dsw-alias-bg-layer-1（浅色纯白 / 深色纯黑），
   把对话主面板已有的 --dsbg-veil 薄纱整个盖住；顶部工具条、时间线图、表格
   滚动区、表格本体、事件详情侧栏也各自铺不透明底色，于是整块主界面又变回
   白底。这里把大面积底色拆掉：视图根、工具条、表格容器/本体透明，直接露出
   对话根的薄纱与壁纸；时间线图补一层薄纱；表格 sticky 表头和事件详情侧栏
   用与左侧栏同款的磨砂玻璃（滚过的行不会从表头文字下透出来）。
   语义锚点：视图根自带 data-conversation-composer-overlay，表格滚动容器自带
   data-trajectory-scroll，均来自 DSH 自身，不依赖构建哈希类名。 */
[data-conversation-composer-overlay] {
  background: transparent !important;
}

/* 顶部工具条：非滚动容器，直接透明，控件和彩色开关压在薄纱上 */
[data-conversation-composer-overlay] > [role="toolbar"] {
  background: transparent !important;
}

/* 顶部时间线图：<section> 下唯一的 <div> 原本铺 --dsw-alias-bg-layer-2 */
[data-conversation-composer-overlay] > section > div {
  background: var(--dsbg-veil) !important;
}

:has(> [data-trajectory-scroll]) {
  background: transparent !important;
}

:has(> [data-trajectory-scroll]) table {
  background: transparent !important;
}

/* 表格 sticky 表头：磨砂层压在行内容上，滚动时文字不会被下面的行穿透 */
:has(> [data-trajectory-scroll]) table th {
  background: var(--dsbg-sidebar) !important;
  backdrop-filter: blur(var(--dsbg-sidebar-blur)) saturate(var(--dsbg-sidebar-saturate)) !important;
  -webkit-backdrop-filter: blur(var(--dsbg-sidebar-blur)) saturate(var(--dsbg-sidebar-saturate)) !important;
}

/* 事件详情侧栏：和侧边栏同款磨砂玻璃面板 */
[data-conversation-composer-overlay] aside {
  background: var(--dsbg-sidebar) !important;
  backdrop-filter: blur(var(--dsbg-sidebar-blur)) saturate(var(--dsbg-sidebar-saturate)) !important;
  -webkit-backdrop-filter: blur(var(--dsbg-sidebar-blur)) saturate(var(--dsbg-sidebar-saturate)) !important;
}

/* ---------- 自动化任务页：拆掉整块白底 ----------
   TaskManagerPage 的根 section 铺 --dsw-alias-bg-base（浅色纯白 / 深色纯黑），
   详情侧栏与底部保存条也铺同色，整页看不到壁纸。根节点改为透明（薄纱统一由
   下面 [data-global-panel] 那层提供，避免叠两层），详情侧栏改用玻璃面板，
   保存条不再铺底色。语义锚点：根节点自带 data-testid="task-manager-page"。 */
section[data-testid="task-manager-page"] {
  background: transparent !important;
}

section[data-testid="task-manager-page"] > aside {
  background: var(--dsbg-sidebar) !important;
  backdrop-filter: blur(var(--dsbg-sidebar-blur)) saturate(var(--dsbg-sidebar-saturate)) !important;
  -webkit-backdrop-filter: blur(var(--dsbg-sidebar-blur)) saturate(var(--dsbg-sidebar-saturate)) !important;
}

section[data-testid="task-manager-page"] aside footer {
  background: transparent !important;
}

/* ---------- 全局页统一薄纱 ----------
   插件 / 自动化任务 / 会话清理这些“全局页”都渲染进布局的 mainPanel 容器，
   该容器在选中全局页时带 data-global-panel 标记。这些页面自身没有底色，壁纸
   直接透出；而对话页的对话根有一层 --dsbg-veil 薄纱，于是切页时背景亮度/
   对比度不一致。这里在统一容器上铺同款薄纱：所有全局页（含以后新增的）都和
   对话页一致，且只叠一层。注意该标记只在全局页出现，对话页不受影响。 */
[data-global-panel] {
  background: var(--dsbg-veil) !important;
}

/* ---------- DSH 0.2.2 右侧面板：透明悬浮玻璃卡片 ----------
   0.2.2 的右栏由 dockkit 渲染（开始 / 终端 / 浏览器 / 文件预览等页签都在这里）：
   停靠面板的 section.tabHost 默认铺 --dsw-alias-bg-base 不透明底色（dockkit 的
   TabHost 规则），空面板宿主 _emptyTabHost_ 同样铺底；于是整块右栏是一块压住
   壁纸的实心色块。这里把它改成悬浮玻璃卡片：斜向高光 + 内高光描边 + 1px 细边
   + 16px 圆角 + 四周 12px 留白（投影只向下，避免左右留白出现暗槽），右栏因此
   浮在极光壁纸上、与左侧栏左右对称。
   底色只叠高光 sheen，不铺左侧栏那层 --dsbg-sidebar 固定深色底：右侧卡片是
   透明玻璃，背后的极光亮蓝色原样透出（左侧栏则是列薄纱 + 深色底 + 模糊的深蓝
   磨砂），两块侧栏保留各自的色调。卡片外那圈 12px 留白由整列
   （[data-rightbar-col]）的 --dsbg-veil 薄纱兜住，不会露出比卡片更亮的裸壁纸。
   不做高斯模糊：卡片背后的壁纸/极光保持清晰，这是右栏原本的透明玻璃材质；
   与左侧栏的磨砂玻璃形成材质对比。
   语义锚点：data-rightbar-col / data-sidebar-right-session（DSH 自带）、
   data-dockkit-*（dockkit 自身属性）与 _tabHost_ 类名模式，不绑定构建哈希。
   浮动面板（_float_）保留 dockkit 自己的悬浮样式，这里排除。 */
[data-rightbar-col] {
  background: var(--dsbg-veil) !important;
}

[data-sidebar-right-session] [data-dockkit-host="dock"] > [data-dockkit-column] > section,
[data-sidebar-right-session] section[class*="_tabHost_"]:not([class*="_float_"]),
[data-sidebar-right-session] [class*="_emptyTabHost_"] {
  background: var(--dsbg-sidebar-sheen) !important;
  border: 1px solid var(--dsbg-sidebar-border) !important;
  border-radius: 16px !important;
  margin: 12px !important;
  /* 投影只向下：offset-y 18px + 负 spread -18px，把阴影矩形往卡片内部收窄，
     左右两侧的外投影只剩约 5% 的尾部（在 12px 留白里不可见），不会再压出
     暗槽；可见部分集中在卡片下沿，给卡片一点浮起感。轮廓仍由 1px 描边 +
     内高光给出。深色主题的数值见下方 body[data-ds-dark-theme] 覆盖。 */
  box-shadow:
    var(--dsbg-sidebar-highlight),
    0 18px 24px -18px rgba(37, 68, 110, 0.22) !important;
}

body[data-ds-dark-theme] [data-sidebar-right-session] [data-dockkit-host="dock"] > [data-dockkit-column] > section,
body[data-ds-dark-theme] [data-sidebar-right-session] section[class*="_tabHost_"]:not([class*="_float_"]),
body[data-ds-dark-theme] [data-sidebar-right-session] [class*="_emptyTabHost_"] {
  box-shadow:
    var(--dsbg-sidebar-highlight),
    0 18px 24px -18px rgba(0, 0, 0, 0.42) !important;
}

/* ---------- 右栏“开始”引导卡：悬停态统一 ----------
   引导卡里“工作区文件 / 浏览器 / 更多工具”用的是 DSH 通用卡：hover 时把不透明
   底色直接替换成半透明的 --dsw-alias-interactive-bg-hover，面板改成透明玻璃后，
   悬停卡会把下面的壁纸透出来，上方（极光亮）和下方（近黑）亮度不同，看起来每张
   卡悬停的“透明度”都不一样；“新建终端”则是终端插件自绘的卡（hover 叠在不透明
   底上），呈均匀浅灰。这里把通用卡的 hover 也叠在它自己的不透明底上：悬停颜色
   = hover 色叠 --dsw-alias-bg-layer-1，和“新建终端”完全一致，也不再随壁纸变化。
   语义锚点：data-sidebar-right-guide（DSH 自带引导容器）；只命中这类 button 卡，
   终端自绘卡（外层是 div）不受影响。 */
@media (hover: hover) {
  [data-sidebar-right-guide] button[class*="entry"]:hover {
    background:
      linear-gradient(var(--dsw-alias-interactive-bg-hover), var(--dsw-alias-interactive-bg-hover)),
      var(--dsw-alias-bg-layer-1) !important;
  }
}

[data-sidebar-right-guide] button[class*="entry"][aria-expanded="true"] {
  background:
    linear-gradient(var(--dsw-alias-interactive-bg-hover), var(--dsw-alias-interactive-bg-hover)),
    var(--dsw-alias-bg-layer-1) !important;
}

`;
/* 浅色：独立 2D 流场与蓝色鲸鱼；深色：原有 WebGL 流体与发光鲸鱼。
 * 离线运行，动画最多 30fps，页面隐藏时暂停，支持减少动态效果与热更新。 */
function apply() {
  "use strict";
  if (typeof document === "undefined") return;

  try {
    var prevHandle = window.__dshDeepSeekBgHandle;
    if (prevHandle && typeof prevHandle.dispose === "function") prevHandle.dispose();
    else {
      var legacyIds = ["dsh-ds-bg"];
      for (var li = 0; li < legacyIds.length; li++) {
        var lel = document.getElementById(legacyIds[li]);
        if (lel && lel.parentNode) lel.parentNode.removeChild(lel);
      }
    }
  } catch (e0) { }
  window.__dshDeepSeekBg = true;

  var disposed = false;
  var cleanups = [];
  function listen(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    cleanups.push(function () { target.removeEventListener(event, handler, options); });
  }
  function releaseGL(gl) {
    cleanups.push(function () {
      var ext = gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    });
  }
  // One render immediately on theme/size changes, even with reduced motion.
  function renderLoop(draw, active) {
    var raf = 0, last = -Infinity;
    function tick(now) {
      raf = 0;
      if (disposed || document.hidden || !active()) return;
      if (now - last >= 1000 / 30) { last = now; draw(now); }
      if (!reducedMotion) raf = requestAnimationFrame(tick);
    }
    function refresh() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = -Infinity;
      tick(performance.now());
    }
    themeRefreshers.push(refresh);
    listen(window, "resize", refresh, { passive: true });
    listen(document, "visibilitychange", refresh);
    cleanups.push(function () { if (raf) cancelAnimationFrame(raf); });
    refresh();
  }
  var syncTimer = 0;
  var themeObserver = null;
  var styleTag = document.getElementById("dsh-deepseek-bg-css");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dsh-deepseek-bg-css";
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = DSH_BG_CSS;

  var darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var isWindows = (navigator.userAgentData && navigator.userAgentData.platform === "Windows") ||
    navigator.userAgent.indexOf("Windows") !== -1;

  /* ------------------------------------------------------------------ *
   * 主题检测
   * ------------------------------------------------------------------ */
  function detectDark() {
    var b = document.body;
    var d = document.documentElement;
    if (b && b.hasAttribute("data-ds-dark-theme")) return true;
    if (d && d.hasAttribute("data-ds-dark-theme")) return true;
    if (b && b.hasAttribute("data-ds-light-theme")) return false;
    if (d && d.hasAttribute("data-ds-light-theme")) return false;
    // DSH 0.2.x 在解析出主题后会标记 html[data-ds-theme-source]；此时 body 上没有
    // dark 属性就代表浅色主题（不能再用系统 prefers-color-scheme 猜测）。
    if (d && d.hasAttribute("data-ds-theme-source")) return false;
    if (d && d.dataset) {
      if (d.dataset.theme === "dark") return true;
      if (d.dataset.theme === "light") return false;
    }
    return !!(darkQuery && darkQuery.matches);
  }

  // 浅色流场：连续域扭曲 + 冰蓝/天蓝/深蓝色带。限制采样尺寸后平滑放大，
  var LIGHT_FLUID = { speed: 0.32, maxSize: 320,
    paper: [246, 249, 253], ice: [150, 201, 242],
    azure: [78, 146, 220], blue: [45, 94, 171] };

  var DARK_AURORA = {
    type: "fluid",
    mouseRadius: 0.09, mouseStrength: 1.8, mouseSmoothing: 0.1, mouseVelocity: 0.2,
    decay: 0.925, distortBoost: 2.2, noiseBoost: 0.3, swirlBoost: 0.8,
    glowIntensity: 0.13, glowColors: ["#fff7d1", "#538dca", "#2d448b"],
    speed: 28, distortion: 18, swirl: 20, swirlIterations: 12,
    scale: 1.77, rotation: 15, proportion: 60, softness: 80, shapeScale: 0,
    offsetX: -124, offsetY: -48,
    colors: ["#000000", "#1A3870", "#204a7e", "#eed8aa", "#000000"],
    lightX: 0.89, lightY: 0.46, lightCore: 0.14, lightHalo: 0.2, vignette: 0.38, lightFollow: 0.63,
    bloomThreshold: 0.61, bloomRange: 0.18, bloomStrength: 0.4, grain: 0.005
  };

  var LIGHT_CONSTELLATION = { lineColor: "rgba(66, 105, 156,", dotColor: "rgba(66, 105, 156,", lineOpacity: 0.15, dotOpacity: 0.24, round: true };
  var DARK_CONSTELLATION = { lineColor: "rgba(255, 255, 255,", dotColor: "rgba(255, 255, 255,", lineOpacity: 0.08, dotOpacity: 0.16, round: false };

  var state = { dark: detectDark() };
  function currentConstellation() { return state.dark ? DARK_CONSTELLATION : LIGHT_CONSTELLATION; }

  /* ------------------------------------------------------------------ *
   * DOM 骨架
   * ------------------------------------------------------------------ */
  var container = document.createElement("div");
  container.id = "dsh-ds-bg";
  // 关键样式内联兜底：即使外部 CSS 未加载，背景层也保持 fixed + 底层
  container.style.cssText = "position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none;" +
    "background:#f2f6fc;";
  var auroraCanvas = document.createElement("canvas");
  auroraCanvas.id = "dsh-ds-aurora";
  // 此 WebGL 画布仅用于深色流体；浅色流场使用下面的 2D 画布。
  auroraCanvas.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;display:block;";
  var constellationCanvas = document.createElement("canvas");
  constellationCanvas.id = "dsh-ds-constellation";
  constellationCanvas.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;display:block;background:transparent;";
  container.appendChild(auroraCanvas);
  var aurora2dCanvas = document.createElement("canvas");
  aurora2dCanvas.id = "dsh-ds-aurora2d";
  aurora2dCanvas.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;";
  var aurora2dCtx = aurora2dCanvas.getContext("2d", { alpha: false });
  container.appendChild(aurora2dCanvas);
  // 两种主题共享鲸鱼轮廓与粒子运动。
  var whaleLayer = document.createElement("div");
  whaleLayer.className = "dsh-ds-whale";
  whaleLayer.setAttribute("aria-hidden", "true");
  whaleLayer.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;" +
    "pointer-events:none;z-index:2;";
  var whaleCanvas = document.createElement("canvas");
  whaleCanvas.className = "dsh-ds-whale-canvas";
  whaleCanvas.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;display:block;";
  whaleLayer.appendChild(whaleCanvas);
  container.appendChild(whaleLayer);
  container.appendChild(constellationCanvas);


  var themeRefreshers = [];
  function applyThemeClass() {
    container.classList.toggle("dsh-ds-dark", state.dark);
    // 内联兜底：容器底色和鲸鱼混合模式随主题同步。
    container.style.setProperty("background", state.dark ? "#0a0a0a" :
      "#f2f6fc", "important");
    whaleLayer.style.mixBlendMode = state.dark ? "screen" : "normal";
    themeRefreshers.forEach(function (refresh) { refresh(); });
    // 两套主题都让 body/html 透明，固定背景层才能从最底层透出；
    // 界面透明化与玻璃材质由 CSS 中的主题令牌负责切换。
    if (document.body) document.body.style.setProperty("background", "transparent", "important");
    if (document.documentElement) document.documentElement.style.setProperty("background", "transparent", "important");
  }
  applyThemeClass();

  function boot() {
    if (!document.body) { listen(document, "DOMContentLoaded", boot); return; }
    applyThemeClass();
    document.body.appendChild(container);
    startLightAurora();
    startAurora();
    if (typeof location === "undefined" || location.search.indexOf("nowhale") === -1) startWhale();
    if (!coarse || reducedMotion) startConstellation();
    observeTheme();
    // 主题属性可能晚于首次 apply 到达（DSH 先渲染再解析主题）：启动后短时间校准
    var syncTries = 0;
    syncTimer = setInterval(function () {
      var d = detectDark();
      if (d !== state.dark) { state.dark = d; applyThemeClass(); }
      if (++syncTries > 20) clearInterval(syncTimer);
    }, 250);
  }

  var VERT = "#version 300 es\nin vec4 a_position;\nout vec2 vUv;\nvoid main() {\n  vUv = a_position.xy * 0.5 + 0.5;\n  gl_Position = a_position;\n}\n";

  var FLOWMAP_FS = "#version 300 es\n" +
    "precision mediump float;\n" +
    "in vec2 vUv;\n" +
    "uniform sampler2D u_prev;\n" +
    "uniform vec2 u_mouse;\n" +
    "uniform vec2 u_velocity;\n" +
    "uniform float u_brushRadius;\n" +
    "uniform float u_brushStrength;\n" +
    "uniform float u_decay;\n" +
    "out vec4 fragColor;\n" +
    "\n" +
    "void main() {\n" +
    "  vec4 prev = texture(u_prev, vUv);\n" +
    "\n" +
    "  prev.r *= u_decay;\n" +
    "  prev.gb = mix(vec2(0.5), prev.gb, u_decay);\n" +
    "\n" +
    "  float dist = distance(vUv, u_mouse);\n" +
    "\n" +
    "  float influence = exp(-dist * dist / (u_brushRadius * u_brushRadius * 0.5));\n" +
    "  influence = max(0.0, influence - 0.01);\n" +
    "\n" +
    "  float speed = length(u_velocity);\n" +
    "  float presenceStrength = u_brushStrength * 0.3;\n" +
    "  float velBonus = min(speed * 3.0, 0.7) * u_brushStrength;\n" +
    "  float totalStrength = presenceStrength + velBonus;\n" +
    "\n" +
    "  prev.r = max(prev.r, influence * totalStrength);\n" +
    "  float blendAmt = influence * min(totalStrength, 0.4) * 0.3;\n" +
    "  prev.g = mix(prev.g, clamp(u_velocity.x * 2.0 + 0.5, 0.0, 1.0), blendAmt);\n" +
    "  prev.b = mix(prev.b, clamp(u_velocity.y * 2.0 + 0.5, 0.0, 1.0), blendAmt);\n" +
    "\n" +
    "  fragColor = prev;\n" +
    "}\n";

  var FLUID_FS = "#version 300 es\n" +
    "precision mediump float;\n" +
    "in vec2 vUv;\n" +
    "uniform float u_time;\n" +
    "uniform vec2 u_resolution;\n" +
    "uniform vec3 u_c1, u_c2, u_c3, u_c4, u_c5;\n" +
    "uniform float u_scale;\n" +
    "uniform vec2 u_offset;\n" +
    "uniform float u_grain;\n" +
    "uniform float u_speed;\n" +
    "uniform sampler2D u_flowmap;\n" +
    "uniform float u_distortBoost;\n" +
    "uniform float u_swirlBoost;\n" +
    "uniform float u_glowIntensity;\n" +
    "uniform vec3 u_glowColor1;\n" +
    "uniform vec3 u_glowColor2;\n" +
    "uniform vec3 u_glowColor3;\n" +
    "uniform vec2 u_lightPos;\n" +
    "uniform float u_lightCore;\n" +
    "uniform float u_lightHalo;\n" +
    "uniform float u_vignette;\n" +
    "uniform float u_bloomThreshold;\n" +
    "uniform float u_bloomRange;\n" +
    "uniform float u_bloomStrength;\n" +
    "out vec4 fragColor;\n" +
    "\n" +
    "vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}\n" +
    "vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}\n" +
    "vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}\n" +
    "vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}\n" +
    "\n" +
    "float snoise(vec3 v){\n" +
    "  const vec2 C=vec2(1./6.,1./3.);\n" +
    "  const vec4 D=vec4(0.,.5,1.,2.);\n" +
    "  vec3 i=floor(v+dot(v,C.yyy));\n" +
    "  vec3 x0=v-i+dot(i,C.xxx);\n" +
    "  vec3 g=step(x0.yzx,x0.xyz);\n" +
    "  vec3 l=1.-g;\n" +
    "  vec3 i1=min(g.xyz,l.zxy);\n" +
    "  vec3 i2=max(g.xyz,l.zxy);\n" +
    "  vec3 x1=x0-i1+C.xxx;\n" +
    "  vec3 x2=x0-i2+C.yyy;\n" +
    "  vec3 x3=x0-D.yyy;\n" +
    "  i=mod289v3(i);\n" +
    "  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));\n" +
    "  float n_=.142857142857;\n" +
    "  vec3 ns=n_*D.wyz-D.xzx;\n" +
    "  vec4 j=p-49.*floor(p*ns.z*ns.z);\n" +
    "  vec4 x_=floor(j*ns.z);\n" +
    "  vec4 y_=floor(j-7.*x_);\n" +
    "  vec4 x=x_*ns.x+ns.yyyy;\n" +
    "  vec4 y=y_*ns.x+ns.yyyy;\n" +
    "  vec4 h=1.-abs(x)-abs(y);\n" +
    "  vec4 b0=vec4(x.xy,y.xy);\n" +
    "  vec4 b1=vec4(x.zw,y.zw);\n" +
    "  vec4 s0=floor(b0)*2.+1.;\n" +
    "  vec4 s1=floor(b1)*2.+1.;\n" +
    "  vec4 sh=-step(h,vec4(0.));\n" +
    "  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;\n" +
    "  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;\n" +
    "  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);\n" +
    "  vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);\n" +
    "  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));\n" +
    "  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;\n" +
    "  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);\n" +
    "  m=m*m;\n" +
    "  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));\n" +
    "}\n" +
    "\n" +
    "float hash(vec2 p){\n" +
    "  vec3 p3=fract(vec3(p.xyx)*.1031);\n" +
    "  p3+=dot(p3,p3.yzx+33.33);\n" +
    "  return fract((p3.x+p3.y)*p3.z);\n" +
    "}\n" +
    "\n" +
    "float fbm(vec3 p){\n" +
    "  float v=0.,amp=.6;vec3 shift=vec3(100.);\n" +
    "  for(int i=0;i<1;i++){v+=amp*snoise(p);p=p*2.+shift;amp*=.4;}\n" +
    "  return v;\n" +
    "}\n" +
    "\n" +
    "float fluidNoise(vec2 uv,float t){\n" +
    "  float n1=fbm(vec3(uv*.6,t*.06));\n" +
    "  float n2=fbm(vec3(uv*.6+5.2,t*.06+1.3));\n" +
    "  vec2 w1=vec2(n1,n2)*.6;\n" +
    "  float n3=fbm(vec3((uv+w1)*.7+1.7,t*.05+3.1));\n" +
    "  float n4=fbm(vec3((uv+w1)*.7+9.2,t*.05+5.7));\n" +
    "  vec2 w2=vec2(n3,n4)*.5;\n" +
    "  return fbm(vec3((uv+w1+w2)*.5,t*.04));\n" +
    "}\n" +
    "\n" +
    "vec2 curlish(vec2 uv,float t){\n" +
    "  float eps=.02;\n" +
    "  float n=snoise(vec3(uv*.8,t));\n" +
    "  float nx=snoise(vec3((uv+vec2(eps,0.))*.8,t));\n" +
    "  float ny=snoise(vec3((uv+vec2(0.,eps))*.8,t));\n" +
    "  return vec2(-(ny-n)/eps,(nx-n)/eps)*.003;\n" +
    "}\n" +
    "\n" +
    "void main(){\n" +
    "  float aspect=u_resolution.x/u_resolution.y;\n" +
    "  vec2 uv=gl_FragCoord.xy/u_resolution;\n" +
    "  vec2 suv=vec2(uv.x*aspect, uv.y) * u_scale + u_offset;\n" +
    "  float t=u_time;\n" +
    "\n" +
    "  // Mouse interaction via flowmap\n" +
    "  vec4 flow = texture(u_flowmap, uv);\n" +
    "  float influence = flow.r;\n" +
    "  vec2 flowDir = (flow.gb - 0.5) * 2.0;\n" +
    "\n" +
    "  // Apply mouse distortion to UV\n" +
    "  suv += flowDir * influence * u_distortBoost * 0.8;\n" +
    "  // Apply mouse swirl\n" +
    "  float swirlAngle = influence * u_swirlBoost * 2.5;\n" +
    "  float cs = cos(swirlAngle), sn = sin(swirlAngle);\n" +
    "  vec2 delta = suv - vec2(uv.x * aspect, uv.y) * u_scale;\n" +
    "  suv += (mat2(cs, sn, -sn, cs) * delta - delta) * influence;\n" +
    "\n" +
    "  vec2 curl=curlish(suv,t*.04);\n" +
    "  vec2 uvD=suv+curl*12.;\n" +
    "  float f=fluidNoise(uvD,t);\n" +
    "  float swirl=snoise(vec3(uvD*.8+f*1.5,t*.035))*.5+.5;\n" +
    "  float n=f*.5+.5;\n" +
    "  vec3 col=mix(u_c1,u_c2,smoothstep(.2,.5,n));\n" +
    "  col=mix(col,u_c3,smoothstep(.35,.65,n+swirl*.25));\n" +
    "  col=mix(col,u_c4,smoothstep(.6,.85,swirl)*.55);\n" +
    "  col=mix(col,u_c5,smoothstep(.5,.8,n*swirl)*.35);\n" +
    "\n" +
    "  // Mouse proximity color shift: 3-color glow blended by distance + noise\n" +
    "  float glow = smoothstep(0.0, 0.8, influence);\n" +
    "  float glowNoise = snoise(vec3(uvD * 1.5, t * 0.08)) * 0.5 + 0.5;\n" +
    "  float glowDist = smoothstep(0.0, 1.0, influence);\n" +
    "  vec3 glowMix = mix(u_glowColor3, u_glowColor2, glowDist);\n" +
    "  glowMix = mix(glowMix, u_glowColor1, glowDist * glowNoise);\n" +
    "  col = mix(col, glowMix, glow * u_glowIntensity);\n" +
    "\n" +
    "  if(u_grain>0.0){\n" +
    "    vec2 flowOffset = (uvD - suv) * u_resolution.y;\n" +
    "    vec2 gp = floor((gl_FragCoord.xy + flowOffset) / 5.0);\n" +
    "    float gr=hash(gp)*2.-1.;\n" +
    "    col+=gr*u_grain;\n" +
    "  }\n" +
    "\n" +
    "  // Self-luminance bloom: bright fluid regions become their own light spots,\n" +
    "  // so glow follows the flow and mouse disturbance instead of a fixed point\n" +
    "  float luma=dot(col,vec3(.299,.587,.114));\n" +
    "  float bloom=smoothstep(u_bloomThreshold-u_bloomRange,u_bloomThreshold+u_bloomRange,luma);\n" +
    "  col+=(col*.85+vec3(.15,.145,.13))*bloom*u_bloomStrength;\n" +
    "\n" +
    "  // Virtual light source: soft warm core (same side as helm lighting)\n" +
    "  float ld=length((uv-u_lightPos)*vec2(aspect,1.));\n" +
    "  float core=exp(-ld*ld*4.5);\n" +
    "  float halo=exp(-ld*1.8);\n" +
    "  col+=vec3(1.,.97,.9)*core*u_lightCore+vec3(.72,.8,1.)*halo*u_lightHalo;\n" +
    "\n" +
    "  float vig=1.-smoothstep(.35,.75,length(uv-.5));\n" +
    "  col=mix(col*(1.-u_vignette),col,vig);\n" +
    "  fragColor=vec4(col,1.);\n" +
    "}\n";

  /* ------------------------------------------------------------------ *
   * 极光引擎（WebGL2）
   * ------------------------------------------------------------------ */
  /* 连续流场在小画布中计算，再双线性放大到不透明显示画布。
     每帧改变流场形状，而不是仅移动几个固定光斑。 */
  function startLightAurora() {
    if (!aurora2dCtx) return;
    var field = document.createElement("canvas");
    var ctx = field.getContext("2d", { alpha: false });
    if (!ctx) return;
    var pixels = null, started = performance.now();
    var cfg = LIGHT_FLUID;
    function smooth(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
    function draw(now) {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.max(1, Math.round(aurora2dCanvas.clientWidth * dpr));
      var h = Math.max(1, Math.round(aurora2dCanvas.clientHeight * dpr));
      var ratio = Math.min(1, cfg.maxSize / Math.max(w, h));
      var fw = Math.max(2, Math.round(w * ratio)), fh = Math.max(2, Math.round(h * ratio));
      if (aurora2dCanvas.width !== w || aurora2dCanvas.height !== h) {
        aurora2dCanvas.width = w; aurora2dCanvas.height = h;
      }
      if (field.width !== fw || field.height !== fh || !pixels) {
        field.width = fw; field.height = fh;
        pixels = ctx.createImageData(fw, fh);
      }
      var t = reducedMotion ? 1.5 : (now - started) * 0.001 * cfg.speed;
      var data = pixels.data, aspect = w / h;
      for (var y = 0; y < fh; y++) {
        var v = y / (fh - 1);
        var fade = 0.80 - 0.58 * smooth(v);
        for (var x = 0; x < fw; x++) {
          var u = x / (fw - 1), px = (u - 0.5) * aspect * 2.6, py = v * 2.6;
          // Smooth domain warping creates broad folds without tile boundaries.
          var qx = px + 0.65 * Math.sin(py * 1.8 + t * 0.8) + 0.30 * Math.cos(px * 1.3 - t);
          var qy = py + 0.55 * Math.sin(px * 1.4 - t * 0.7);
          var ribbon = 0.5 + 0.5 * Math.sin(qx * 1.7 + qy * 2.3 + t + 0.7 * Math.sin(qy * 2.1 - t));
          var azure = smooth(0.5 + 0.5 * Math.sin(qx * 1.2 - qy + t * 0.65));
          var blue = 0.48 * smooth(0.5 + 0.5 * Math.cos(qy * 1.6 + qx * 0.7 - t * 0.5));
          var ink = fade * (0.16 + 0.84 * smooth(ribbon));
          var i = (y * fw + x) * 4;
          // Stable sub-level dither reduces 8-bit bands without temporal sparkle.
          var grain = (((x * 17 + y * 29) % 23) / 22 - 0.5) * 0.65;
          for (var c = 0; c < 3; c++) {
            var color = cfg.ice[c] + (cfg.azure[c] - cfg.ice[c]) * azure;
            color += (cfg.blue[c] - color) * blue;
            data[i + c] = cfg.paper[c] + (color - cfg.paper[c]) * ink + grain;
          }
          data[i + 3] = 255;
        }
      }
      ctx.putImageData(pixels, 0, 0);
      aurora2dCtx.imageSmoothingEnabled = true;
      aurora2dCtx.imageSmoothingQuality = "high";
      aurora2dCtx.drawImage(field, 0, 0, w, h);
    }
    renderLoop(draw, function () { return !state.dark; });
  }

  function startAurora() {
    var canvas = auroraCanvas;
    var gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return;
    releaseGL(gl);

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    function link(vs, fs) {
      if (!vs || !fs) return null;
      var p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
    }
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var progFlow = link(vs, compile(gl.FRAGMENT_SHADER, FLOWMAP_FS));
    var progFluid = link(vs, compile(gl.FRAGMENT_SHADER, FLUID_FS));
    if (!progFlow || !progFluid) return;

    var uFlow = {
      prev: gl.getUniformLocation(progFlow, "u_prev"),
      mouse: gl.getUniformLocation(progFlow, "u_mouse"),
      velocity: gl.getUniformLocation(progFlow, "u_velocity"),
      brushRadius: gl.getUniformLocation(progFlow, "u_brushRadius"),
      brushStrength: gl.getUniformLocation(progFlow, "u_brushStrength"),
      decay: gl.getUniformLocation(progFlow, "u_decay")
    };
    var uFluid = {
      time: gl.getUniformLocation(progFluid, "u_time"),
      resolution: gl.getUniformLocation(progFluid, "u_resolution"),
      scale: gl.getUniformLocation(progFluid, "u_scale"),
      offset: gl.getUniformLocation(progFluid, "u_offset"),
      grain: gl.getUniformLocation(progFluid, "u_grain"),
      speed: gl.getUniformLocation(progFluid, "u_speed"),
      flowmap: gl.getUniformLocation(progFluid, "u_flowmap"),
      distortBoost: gl.getUniformLocation(progFluid, "u_distortBoost"),
      swirlBoost: gl.getUniformLocation(progFluid, "u_swirlBoost"),
      glowIntensity: gl.getUniformLocation(progFluid, "u_glowIntensity"),
      glowColor1: gl.getUniformLocation(progFluid, "u_glowColor1"),
      glowColor2: gl.getUniformLocation(progFluid, "u_glowColor2"),
      glowColor3: gl.getUniformLocation(progFluid, "u_glowColor3"),
      c1: gl.getUniformLocation(progFluid, "u_c1"),
      c2: gl.getUniformLocation(progFluid, "u_c2"),
      c3: gl.getUniformLocation(progFluid, "u_c3"),
      c4: gl.getUniformLocation(progFluid, "u_c4"),
      c5: gl.getUniformLocation(progFluid, "u_c5"),
      lightPos: gl.getUniformLocation(progFluid, "u_lightPos"),
      lightCore: gl.getUniformLocation(progFluid, "u_lightCore"),
      lightHalo: gl.getUniformLocation(progFluid, "u_lightHalo"),
      vignette: gl.getUniformLocation(progFluid, "u_vignette"),
      bloomThreshold: gl.getUniformLocation(progFluid, "u_bloomThreshold"),
      bloomRange: gl.getUniformLocation(progFluid, "u_bloomRange"),
      bloomStrength: gl.getUniformLocation(progFluid, "u_bloomStrength")
    };

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    function bindAttrib(prog) {
      var loc = gl.getAttribLocation(prog, "a_position");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }
    function makeTarget(w, h, data) {
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (data) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { fbo: fbo, tex: tex };
    }

    var W = 0, H = 0, wQ = 0, hQ = 0;
    var flip = false;
    var k = Math.min(window.devicePixelRatio || 1, 1.5);
    function resizeAll() {
      k = Math.min(window.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(canvas.clientWidth * k));
      H = Math.max(1, Math.round(canvas.clientHeight * k));
      [targetA, targetB].forEach(function (target) {
        if (target) { gl.deleteFramebuffer(target.fbo); gl.deleteTexture(target.tex); }
      });
      canvas.width = W; canvas.height = H;
      wQ = Math.max(1, Math.round(W / 4)); hQ = Math.max(1, Math.round(H / 4));
      var init = new Uint8Array(wQ * hQ * 4);
      for (var i = 0; i < wQ * hQ; i++) { init[4 * i] = 0; init[4 * i + 1] = 128; init[4 * i + 2] = 128; init[4 * i + 3] = 255; }
      targetA = makeTarget(wQ, hQ, init);
      targetB = makeTarget(wQ, hQ, init);
    }
    var targetA = null, targetB = null;
    resizeAll();

    var mouse = { x: 0.5, y: 0.5, smoothX: 0.5, smoothY: 0.5, vx: 0, vy: 0, svx: 0, svy: 0 };
    var useMouse = !reducedMotion && !coarse && !isWindows;
    function onMove(e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;
    }
    if (useMouse) listen(window, "mousemove", onMove, { passive: true });

    var start = performance.now();

    function hex2rgb(hex) {
      var h = hex.replace("#", "");
      return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
    }

    function frame(now) {
      if (disposed) return;
      var cfg = DARK_AURORA;
      if (!state.dark) return;

      var kk = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.round(canvas.clientWidth * kk);
      var h = Math.round(canvas.clientHeight * kk);
      if (w !== W || h !== H) resizeAll();

      mouse.smoothX += (mouse.x - mouse.smoothX) * cfg.mouseSmoothing;
      mouse.smoothY += (mouse.y - mouse.smoothY) * cfg.mouseSmoothing;
      mouse.svx += ((mouse.x - mouse.smoothX) * 0.5 - mouse.svx) * cfg.mouseVelocity;
      mouse.svy += ((mouse.y - mouse.smoothY) * 0.5 - mouse.svy) * cfg.mouseVelocity;

      // --- flowmap pass（鼠标笔刷 → 低分辨率流场，双缓冲乒乓） ---
      var src = flip ? targetA : targetB;
      var dst = flip ? targetB : targetA;
      flip = !flip;
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
      gl.viewport(0, 0, wQ, hQ);
      gl.useProgram(progFlow);
      bindAttrib(progFlow);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.uniform1i(uFlow.prev, 0);
      gl.uniform2f(uFlow.mouse, mouse.smoothX, mouse.smoothY);
      gl.uniform2f(uFlow.velocity, mouse.svx, mouse.svy);
      gl.uniform1f(uFlow.brushRadius, cfg.mouseRadius);
      gl.uniform1f(uFlow.brushStrength, useMouse ? cfg.mouseStrength : 0);
      gl.uniform1f(uFlow.decay, cfg.decay);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, W, H);

      // --- 渲染 ---
      var t = reducedMotion ? 0 : (now - start) * 0.001 * (cfg.speed / 100);
      gl.useProgram(progFluid);
      bindAttrib(progFluid);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dst.tex);
      gl.uniform1i(uFluid.flowmap, 0);
      gl.uniform1f(uFluid.time, t);
      gl.uniform2f(uFluid.resolution, W, H);
      gl.uniform1f(uFluid.scale, cfg.scale);
      gl.uniform2f(uFluid.offset, cfg.offsetX / 100, cfg.offsetY / 100);
      gl.uniform1f(uFluid.grain, cfg.grain);
      gl.uniform1f(uFluid.distortBoost, cfg.distortBoost);
      gl.uniform1f(uFluid.swirlBoost, cfg.swirlBoost);
      var lx = cfg.lightX != null ? cfg.lightX : 0.89;
      var lf = useMouse && cfg.lightFollow != null ? cfg.lightFollow : 0;
      gl.uniform2f(uFluid.lightPos, lx + (mouse.smoothX - lx) * lf, cfg.lightY != null ? cfg.lightY : 0.46);
      gl.uniform1f(uFluid.lightCore, coarse ? 0 : (cfg.lightCore != null ? cfg.lightCore : 0.14));
      gl.uniform1f(uFluid.lightHalo, coarse ? 0 : (cfg.lightHalo != null ? cfg.lightHalo : 0.2));
      gl.uniform1f(uFluid.vignette, cfg.vignette != null ? cfg.vignette : 0.38);
      gl.uniform1f(uFluid.bloomThreshold, cfg.bloomThreshold != null ? cfg.bloomThreshold : 0.61);
      gl.uniform1f(uFluid.bloomRange, cfg.bloomRange != null ? cfg.bloomRange : 0.18);
      gl.uniform1f(uFluid.bloomStrength, cfg.bloomStrength != null ? cfg.bloomStrength : 0.4);
      gl.uniform1f(uFluid.glowIntensity, cfg.glowIntensity);
      var gc1 = hex2rgb(cfg.glowColors[0] || "#ffffff");
      var gc2 = hex2rgb(cfg.glowColors[1] || cfg.glowColors[0] || "#ffffff");
      var gc3 = hex2rgb(cfg.glowColors[2] || cfg.glowColors[0] || "#ffffff");
      gl.uniform3f(uFluid.glowColor1, gc1[0], gc1[1], gc1[2]);
      gl.uniform3f(uFluid.glowColor2, gc2[0], gc2[1], gc2[2]);
      gl.uniform3f(uFluid.glowColor3, gc3[0], gc3[1], gc3[2]);
      var cs = cfg.colors || [];
      for (var ci = 0; ci < 5; ci++) {
        var c = hex2rgb(cs[ci] || cs[cs.length - 1] || "#000000");
        gl.uniform3f([uFluid.c1, uFluid.c2, uFluid.c3, uFluid.c4, uFluid.c5][ci], c[0], c[1], c[2]);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    renderLoop(frame, function () { return state.dark; });
  }

  var WHALE_PATH = 'M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746V14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z';
  var LIGHT_DEFAULTS = { x: 4.5, y: 5.5, z: 3, range: 14, shadeMin: 0.2, shadeMax: 1.116, followX: 1.05 };
  var MOUSE_DEFAULTS = { radius: 4.9, strength: 0.8, decay: 0.2, distort: 5 };
  var WAVE_DEFAULTS = { speed: 1.5, amount: 0.06 };

  function sampleWhalePixels() {
    var T = 60;
    var c = document.createElement("canvas");
    c.width = T; c.height = T;
    var a = c.getContext("2d");
    a.fillStyle = "#000"; a.fillRect(0, 0, T, T);
    var r = Math.min(T / 24, T / 18);
    a.save();
    a.translate((T - 24 * r) / 2, (T - 18 * r) / 2);
    a.scale(r, r);
    a.fillStyle = "#fff";
    a.fill(new Path2D(WHALE_PATH));
    a.restore();
    var d = a.getImageData(0, 0, T, T);
    var lum = new Float32Array(T * T);
    for (var i = 0; i < T * T; i++) lum[i] = (0.299 * d.data[4*i] + 0.587 * d.data[4*i+1] + 0.114 * d.data[4*i+2]) / 255;
    var positions = [], scattered = [], opacities = [], edges = [];
    var half = T / 2;
    function isEdge(x, y) {
      for (var yy = -2; yy <= 2; yy++) for (var xx = -2; xx <= 2; xx++) {
        if (xx === 0 && yy === 0) continue;
        var nx = x + xx, ny = y + yy;
        if (nx < 0 || ny < 0 || nx >= T || ny >= T) continue;
        if (lum[ny * T + nx] > 0.2) return false;
      }
      return true;
    }
    for (var y = 0; y < T; y++) for (var x = 0; x < T; x++) {
      var l = lum[y * T + x];
      if (l > 0.2 && !isEdge(x, y)) {
        positions.push((x - half) * 0.18, (half - y) * 0.18, 0);
        opacities.push(l);
        var ec = 0;
        for (var yy = -1; yy <= 1; yy++) for (var xx = -1; xx <= 1; xx++) {
          if (xx === 0 && yy === 0) continue;
          var nx = x + xx, ny = y + yy;
          if (nx < 0 || ny < 0 || nx >= T || ny >= T || lum[ny * T + nx] <= 0.2) ec++;
        }
        edges.push(ec / 8);
        var phi = Math.random() * Math.PI * 2;
        var th = Math.acos(2 * Math.random() - 1);
        var rad = 3 * (0.4 + 0.6 * Math.random());
        scattered.push(Math.sin(th) * Math.cos(phi) * rad, Math.sin(th) * Math.sin(phi) * rad, Math.cos(th) * rad * 0.5);
      }
    }
    return {
      positions: new Float32Array(positions),
      scatteredPositions: new Float32Array(scattered),
      opacities: new Float32Array(opacities),
      edges: new Float32Array(edges),
      count: positions.length / 3
    };
  }

  // ---- 粒子 shader：共享运动，片元按主题选择发光或蓝色墨点 ----
  var WHALE_VS = "#version 300 es\n" +
    "precision highp float;\n" +
    "in vec3 position;\n" +
    "in float aOpacity;\n" +
    "in float aIndex;\n" +
    "in float aEdge;\n" +
    "in vec3 aScattered;\n" +
    "in vec3 aCenter;\n" +
    "in float aScale;\n" +
    "uniform float uTime;\n" +
    "uniform float uWaveSpeed;\n" +
    "uniform float uWaveAmount;\n" +
    "uniform vec2 uMouse;\n" +
    "uniform float uMouseRadius;\n" +
    "uniform float uMouseStrength;\n" +
    "uniform float uMouseDistort;\n" +
    "uniform float uAssembly;\n" +
    "uniform float uLoose;\n" +
    "uniform float uScatter;\n" +
    "uniform vec3 uLightPos;\n" +
    "uniform float uLightRange;\n" +
    "uniform float uShadeMin;\n" +
    "uniform float uShadeMax;\n" +
    "uniform mat4 uModel;\n" +
    "uniform mat4 uView;\n" +
    "uniform mat4 uProj;\n" +
    "uniform float uPointScale;\n" +
    "out float vOpacity;\n" +
    "out vec3 vWorldPos;\n" +
    "out float vAssembly;\n" +
    "out float vLight;\n" +
    "void main() {\n" +
    "  vOpacity = aOpacity;\n" +
    "  vAssembly = uAssembly;\n" +
    "  vec3 targetCenter = aCenter;\n" +
    "  vec3 localOffset = position * aScale;\n" +
    "  vec3 scatteredCenter = aScattered;\n" +
    "  float assembly = smoothstep(0.0, 1.0, uAssembly);\n" +
    "  vec3 center = mix(scatteredCenter, targetCenter, assembly);\n" +
    "  vec3 pos = center + localOffset;\n" +
    "  vWorldPos = center;\n" +
    "  float loose = uLoose * mix(0.25, 1.0, aEdge) * assembly;\n" +
    "  if (loose > 0.001) {\n" +
    "    vec3 jitter = vec3(\n" +
    "      fract(sin(aIndex * 12.9898) * 43758.5453) - 0.5,\n" +
    "      fract(sin(aIndex * 78.2330) * 12543.1230) - 0.5,\n" +
    "      fract(sin(aIndex * 39.4250) * 26711.7700) - 0.5\n" +
    "    );\n" +
    "    pos += jitter * 0.05 * loose;\n" +
    "    pos.x += sin(uTime * 0.50 + aIndex * 0.53) * 0.06 * loose;\n" +
    "    pos.y += cos(uTime * 0.42 + aIndex * 0.71) * 0.06 * loose;\n" +
    "    pos.z += sin(uTime * 0.36 + aIndex * 0.91) * 0.08 * loose;\n" +
    "    float tail = smoothstep(0.5, 4.5, targetCenter.x) * uLoose * assembly;\n" +
    "    pos.y += sin(uTime * 1.1 - targetCenter.x * 0.7) * 0.1 * tail;\n" +
    "    pos.z += cos(uTime * 0.9 - targetCenter.x * 0.55) * 0.06 * tail;\n" +
    "  }\n" +
    "  if (uScatter > 0.001) {\n" +
    "    float disperse = uScatter * mix(0.5, 1.0, aEdge);\n" +
    "    pos += (scatteredCenter - center) * disperse;\n" +
    "    pos.z += sin(uTime * 0.6 + aIndex * 0.3) * disperse * 0.6;\n" +
    "  }\n" +
    "  if (assembly > 0.95) {\n" +
    "    float effectStrength = (assembly - 0.95) * 20.0;\n" +
    "    float dist = length(center.xy);\n" +
    "    float waveFade = smoothstep(0.0, 3.0, dist);\n" +
    "    float wave = sin(dist * 3.0 - uTime * uWaveSpeed) * uWaveAmount * effectStrength * waveFade;\n" +
    "    pos.z += wave;\n" +
    "  }\n" +
    "  if (assembly > 0.8) {\n" +
    "    float mouseEffect = (assembly - 0.8) * 5.0;\n" +
    "    vec2 toMouse = center.xy - uMouse;\n" +
    "    float mouseDist = length(toMouse);\n" +
    "    if (mouseDist < uMouseRadius && mouseDist > 0.001) {\n" +
    "      float t = 1.0 - mouseDist / uMouseRadius;\n" +
    "      float force = t * t * t * mouseEffect * uMouseStrength;\n" +
    "      vec2 radialDir = toMouse / mouseDist;\n" +
    "      float noiseAngle = sin(aIndex * 0.37 + uTime * 0.5) * uMouseDistort;\n" +
    "      float ca = cos(noiseAngle);\n" +
    "      float sa = sin(noiseAngle);\n" +
    "      vec2 pushDir = vec2(radialDir.x * ca - radialDir.y * sa, radialDir.x * sa + radialDir.y * ca);\n" +
    "      pos.xy += pushDir * force * 2.0;\n" +
    "      pos.z += sin(aIndex * 1.7 + uTime) * force * 0.8;\n" +
    "    }\n" +
    "  }\n" +
    "  if (assembly < 0.9) {\n" +
    "    float scatter = smoothstep(0.9, 0.0, assembly);\n" +
    "    pos.x += sin(uTime * 0.5 + aIndex * 0.1) * 0.2 * scatter;\n" +
    "    pos.y += cos(uTime * 0.4 + aIndex * 0.07) * 0.2 * scatter;\n" +
    "    pos.z += sin(uTime * 0.3 + aIndex * 0.13) * 0.15 * scatter;\n" +
    "  }\n" +
    "  vec4 worldPos = uModel * vec4(pos, 1.0);\n" +
    "  float lightDist = distance(worldPos.xyz, uLightPos);\n" +
    "  float lit = clamp(1.0 - lightDist / uLightRange, 0.0, 1.0);\n" +
    "  vLight = mix(uShadeMin, uShadeMax, lit * lit);\n" +
    "  vec4 mvPosition = uView * uModel * vec4(pos, 1.0);\n" +
    "  gl_PointSize = max(1.0, uPointScale * aScale);\n" +
    "  gl_Position = uProj * mvPosition;\n" +
    "}\n";

  var WHALE_FS = "#version 300 es\n" +
    "precision highp float;\n" +
    "in float vOpacity;\n" +
    "in vec3 vWorldPos;\n" +
    "in float vAssembly;\n" +
    "in float vLight;\n" +
    "uniform float uTime;\n" +
    "uniform vec3 uColor;\n" +
    "uniform float uLightTheme;\n" +
    "out vec4 fragColor;\n" +
    "void main() {\n" +
    "  float dist = length(vWorldPos.xy);\n" +
    "  float glow = smoothstep(8.0, 0.0, dist) * 0.3 * vAssembly;\n" +
    "  float baseAlpha = mix(0.45, 0.75, vAssembly);\n" +
    "  float alpha = vOpacity * (baseAlpha + glow);\n" +
    "  float shimmer = sin(uTime * 1.5 + vWorldPos.x * 5.0 + vWorldPos.y * 3.0) * 0.1 + 0.9;\n" +
    "  alpha *= shimmer * min(vLight, 1.0);\n" +
    "  vec3 color = (uColor + glow * vec3(0.2, 0.3, 0.5)) * vLight;\n" +
    "  color = mix(color, color * vec3(1.07, 1.02, 0.94), clamp(vLight - 1.0, 0.0, 1.0));\n" +
    "  if (uLightTheme > 0.5) {\n" +
    "    alpha = clamp(alpha * 0.62 * vAssembly, 0.0, 0.65);\n" +
    "    color = mix(vec3(0.18, 0.37, 0.66), vec3(0.28, 0.55, 0.70), clamp(vLight, 0.0, 1.0));\n" +
    "    fragColor = vec4(color * alpha, alpha);\n" +
    "  } else { fragColor = vec4(color, alpha); }\n" +
    "}\n";

  // ---- 4x4 矩阵工具（列主序，与 WebGL uniform 一致） ----
  function m4Identity() { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); }
  function m4Mul(a, b) {
    var o = new Float32Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      o[c*4+r] = a[0*4+r]*b[c*4+0] + a[1*4+r]*b[c*4+1] + a[2*4+r]*b[c*4+2] + a[3*4+r]*b[c*4+3];
    }
    return o;
  }
  function m4Translation(tx, ty, tz) {
    var m = m4Identity(); m[12] = tx; m[13] = ty; m[14] = tz; return m;
  }
  function m4RotationX(a) { var c = Math.cos(a), s = Math.sin(a); var m = m4Identity(); m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m; }
  function m4RotationY(a) { var c = Math.cos(a), s = Math.sin(a); var m = m4Identity(); m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m; }
  function m4RotationZ(a) { var c = Math.cos(a), s = Math.sin(a); var m = m4Identity(); m[0] = c; m[1] = s; m[4] = -s; m[5] = c; return m; }
  function m4Scale(s) { var m = m4Identity(); m[0] = s; m[5] = s; m[10] = s; return m; }
  function m4Perspective(fovY, aspect, near, far) {
    var f = 1 / Math.tan(fovY / 2), nf = 1 / (near - far);
    return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0]);
  }
  function m4Inverse(m) {
    var o = new Float32Array(16);
    var i = new Float32Array([m[0],m[4],m[8],m[12], m[1],m[5],m[9],m[13], m[2],m[6],m[10],m[14], m[3],m[7],m[11],m[15]]);
    var d = 1 / (i[0]*i[5]*i[10]*i[15] - i[0]*i[5]*i[11]*i[14] - i[0]*i[9]*i[6]*i[15] + i[0]*i[9]*i[7]*i[14] +
                i[0]*i[13]*i[6]*i[11] - i[0]*i[13]*i[7]*i[10] - i[4]*i[1]*i[10]*i[15] + i[4]*i[1]*i[11]*i[14] +
                i[4]*i[9]*i[2]*i[15] - i[4]*i[9]*i[3]*i[14] - i[4]*i[13]*i[2]*i[11] + i[4]*i[13]*i[3]*i[10] +
                i[8]*i[1]*i[6]*i[15] - i[8]*i[1]*i[7]*i[14] - i[8]*i[5]*i[2]*i[15] + i[8]*i[5]*i[3]*i[14] +
                i[8]*i[13]*i[2]*i[7] - i[8]*i[13]*i[3]*i[6] - i[12]*i[1]*i[6]*i[11] + i[12]*i[1]*i[7]*i[10] +
                i[12]*i[5]*i[2]*i[11] - i[12]*i[5]*i[3]*i[10] - i[12]*i[9]*i[2]*i[7] + i[12]*i[9]*i[3]*i[6]);
    o[0] = (i[5]*i[10]*i[15] - i[5]*i[11]*i[14] - i[9]*i[6]*i[15] + i[9]*i[7]*i[14] + i[13]*i[6]*i[11] - i[13]*i[7]*i[10]) * d;
    o[4] = (-i[4]*i[10]*i[15] + i[4]*i[11]*i[14] + i[8]*i[6]*i[15] - i[8]*i[7]*i[14] - i[12]*i[6]*i[11] + i[12]*i[7]*i[10]) * d;
    o[8] = (i[4]*i[9]*i[15] - i[4]*i[11]*i[13] - i[8]*i[5]*i[15] + i[8]*i[7]*i[13] + i[12]*i[5]*i[11] - i[12]*i[9]*i[7]) * d;
    o[12] = (-i[4]*i[9]*i[14] + i[4]*i[10]*i[13] + i[8]*i[5]*i[14] - i[8]*i[6]*i[13] - i[12]*i[5]*i[10] + i[12]*i[9]*i[6]) * d;
    o[1] = (-i[1]*i[10]*i[15] + i[1]*i[11]*i[14] + i[9]*i[2]*i[15] - i[9]*i[3]*i[14] - i[13]*i[2]*i[11] + i[13]*i[3]*i[10]) * d;
    o[5] = (i[0]*i[10]*i[15] - i[0]*i[11]*i[14] - i[8]*i[2]*i[15] + i[8]*i[3]*i[14] + i[12]*i[2]*i[11] - i[12]*i[3]*i[10]) * d;
    o[9] = (-i[0]*i[9]*i[15] + i[0]*i[11]*i[13] + i[8]*i[1]*i[15] - i[8]*i[3]*i[13] - i[12]*i[1]*i[11] + i[12]*i[9]*i[3]) * d;
    o[13] = (i[0]*i[9]*i[14] - i[0]*i[10]*i[13] - i[8]*i[1]*i[14] + i[8]*i[2]*i[13] + i[12]*i[1]*i[10] - i[12]*i[9]*i[2]) * d;
    o[2] = (i[1]*i[6]*i[15] - i[1]*i[7]*i[14] - i[5]*i[2]*i[15] + i[5]*i[3]*i[14] + i[13]*i[2]*i[7] - i[13]*i[3]*i[6]) * d;
    o[6] = (-i[0]*i[6]*i[15] + i[0]*i[7]*i[14] + i[4]*i[2]*i[15] - i[4]*i[3]*i[14] - i[12]*i[2]*i[7] + i[12]*i[3]*i[6]) * d;
    o[10] = (i[0]*i[5]*i[15] - i[0]*i[7]*i[13] - i[4]*i[1]*i[15] + i[4]*i[3]*i[13] + i[12]*i[1]*i[7] - i[12]*i[5]*i[3]) * d;
    o[14] = (-i[0]*i[5]*i[14] + i[0]*i[6]*i[13] + i[4]*i[1]*i[14] - i[4]*i[2]*i[13] - i[12]*i[1]*i[6] + i[12]*i[5]*i[2]) * d;
    o[3] = (-i[1]*i[6]*i[11] + i[1]*i[7]*i[10] + i[5]*i[2]*i[11] - i[5]*i[3]*i[10] - i[9]*i[2]*i[7] + i[9]*i[3]*i[6]) * d;
    o[7] = (i[0]*i[6]*i[11] - i[0]*i[7]*i[10] - i[4]*i[2]*i[11] + i[4]*i[3]*i[10] + i[8]*i[2]*i[7] - i[8]*i[3]*i[6]) * d;
    o[11] = (-i[0]*i[5]*i[11] + i[0]*i[7]*i[9] + i[4]*i[1]*i[11] - i[4]*i[3]*i[9] - i[8]*i[1]*i[7] + i[8]*i[5]*i[3]) * d;
    o[15] = (i[0]*i[5]*i[10] - i[0]*i[6]*i[9] - i[4]*i[1]*i[10] + i[4]*i[2]*i[9] + i[8]*i[1]*i[6] - i[8]*i[5]*i[2]) * d;
    return o;
  }

  function startWhale() {
    var canvas = whaleCanvas;
    var gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) { canvas.dataset.state = "no-webgl2"; return; }
    releaseGL(gl);
    var data;
    try { data = sampleWhalePixels(); } catch (e) { canvas.dataset.state = "sample-fail"; return; }
    if (!data || data.count === 0) { canvas.dataset.state = "sample-empty"; return; }
    canvas.dataset.count = data.count;
    initWhaleGL(gl, canvas, data);
  }

  function initWhaleGL(gl, canvas, data) {
    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        if (typeof console !== "undefined") console.error("whale shader:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, WHALE_VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, WHALE_FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.dataset.state = "link-fail";
      return;
    }
    canvas.dataset.state = "shader-ok";
    gl.useProgram(prog);

    function buf(attr, arr, size) {
      var loc = gl.getAttribLocation(prog, attr);
      var b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
    buf("aCenter", data.positions, 3);
    buf("aScattered", data.scatteredPositions, 3);
    buf("aOpacity", data.opacities, 1);
    buf("aEdge", data.edges, 1);
    var idx = new Float32Array(data.count);
    for (var i = 0; i < data.count; i++) idx[i] = i;
    buf("aIndex", idx, 1);
    var scaleArr = new Float32Array(data.count);
    for (var i2 = 0; i2 < data.count; i2++) scaleArr[i2] = 0.5 + 1 * Math.random();
    buf("aScale", scaleArr, 1);

    var u = {};
    ["uTime","uWaveSpeed","uWaveAmount","uMouse","uMouseRadius","uMouseStrength","uMouseDistort",
     "uAssembly","uLoose","uScatter","uLightPos","uLightRange","uShadeMin","uShadeMax",
     "uModel","uView","uProj","uPointScale","uColor","uLightTheme"].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // three.js AdditiveBlending
    gl.disable(gl.DEPTH_TEST);

    var mouse = { x: 0, y: 0, active: false, hasMoved: false };
    function onMove(e) {
      mouse.active = true;
      mouse.hasMoved = true;
      var w = window.innerWidth || 1, h = window.innerHeight || 1;
      mouse.x = (e.clientX / w) * 2 - 1;
      mouse.y = -((e.clientY / h) * 2 - 1);
    }
    function onLeave() { mouse.active = false; }
    function onVis() { if (document.hidden) mouse.active = false; }
    if (!reducedMotion) {
      listen(window, "mousemove", onMove, { passive: true });
      listen(window, "mouseleave", onLeave);
      listen(document, "visibilitychange", onVis);
    }

    var start = performance.now();
    var last = 0;
    var strength = 0;
    var b = { x: 0, y: 0 };
    var FOV = 50 * Math.PI / 180;
    var CAM_DIST = 15;
    var HALF_H = Math.tan(FOV / 2) * CAM_DIST; // viewport（z=0 平面）半高
    var view = m4Translation(0, 0, -15);

    function resize() {
      var w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();

    function frame(now) {

      if (disposed) return;
      var dt = Math.min(0.5, (now - last) / 1000);
      last = now;

      var w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (Math.round(w * dpr) !== canvas.width || Math.round(h * dpr) !== canvas.height) resize();

      var elapsed = reducedMotion ? 30 : (now - start) / 1000;
      var L = Math.max(0, Math.min(1, (elapsed - 0.3) / 2.5));
      var D = 1 - Math.pow(1 - L, 3); // easeOutCubic 组装
      var E = 0; // 固定背景无滚动分散

      var rotZ = elapsed * ((1 - D) * 0.3) + 0.04 * Math.sin(0.25 * elapsed);
      var rotX = 0.05 * Math.sin(0.08 * elapsed * 0.7);
      var rotY = 0.1 * Math.sin(0.08 * elapsed);
      var posY = 0.15 * Math.sin(0.4 * elapsed);
      var scale = 0.75 + 0.25 * D;
      var model = m4Mul(m4Mul(m4Translation(0, posY, 0),
        m4Mul(m4RotationZ(rotZ), m4Mul(m4RotationY(rotY), m4RotationX(rotX)))), m4Scale(scale));

      var aspect = canvas.width / canvas.height;
      var proj = m4Perspective(FOV, aspect, 0.1, 100);
      gl.uniformMatrix4fv(u.uModel, false, model);
      gl.uniformMatrix4fv(u.uView, false, view);
      gl.uniformMatrix4fv(u.uProj, false, proj);
      gl.uniform1f(u.uTime, elapsed);
      gl.uniform1f(u.uWaveSpeed, WAVE_DEFAULTS.speed);
      gl.uniform1f(u.uWaveAmount, WAVE_DEFAULTS.amount);
      gl.uniform1f(u.uAssembly, D);
      gl.uniform1f(u.uLoose, 1);
      gl.uniform1f(u.uScatter, 0);
      gl.uniform1f(u.uMouseRadius, MOUSE_DEFAULTS.radius);
      gl.uniform1f(u.uMouseDistort, MOUSE_DEFAULTS.distort);
      var target = mouse.active ? MOUSE_DEFAULTS.strength : 0;
      strength += (target - strength) * (1 - Math.pow(0.05, dt));
      gl.uniform1f(u.uMouseStrength, strength);
      var halfW = HALF_H * aspect;
      gl.uniform3f(u.uLightPos, LIGHT_DEFAULTS.x + mouse.x * halfW * LIGHT_DEFAULTS.followX, LIGHT_DEFAULTS.y, LIGHT_DEFAULTS.z);
      gl.uniform1f(u.uLightRange, LIGHT_DEFAULTS.range);
      gl.uniform1f(u.uShadeMin, LIGHT_DEFAULTS.shadeMin);
      gl.uniform1f(u.uShadeMax, LIGHT_DEFAULTS.shadeMax);
      if (mouse.hasMoved) {
        var wx = mouse.x * halfW, wy = mouse.y * HALF_H;
        if (strength < 0.01) { b.x = wx; b.y = wy; }
        else { b.x += (wx - b.x) * MOUSE_DEFAULTS.decay; b.y += (wy - b.y) * MOUSE_DEFAULTS.decay; }
      }
      var inv = m4Inverse(model);
      var ux = inv[0]*b.x + inv[4]*b.y + inv[12];
      var uy = inv[1]*b.x + inv[5]*b.y + inv[13];
      gl.uniform2f(u.uMouse, ux, uy);
      gl.uniform3f(u.uColor, 0.75 * D, 0.8 * D, 0.9 * D);
      gl.uniform1f(u.uPointScale, 0.06 * scale * (canvas.height / (2 * HALF_H)));

      gl.uniform1f(u.uLightTheme, state.dark ? 0 : 1);
      gl.blendFunc(state.dark ? gl.SRC_ALPHA : gl.ONE, state.dark ? gl.ONE : gl.ONE_MINUS_SRC_ALPHA);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, data.count);
    }

    renderLoop(frame, function () { return true; });
  }

  /* ------------------------------------------------------------------ *
   * 星座网格引擎（2D canvas）
   * ------------------------------------------------------------------ */
  function startConstellation() {
    var canvas = constellationCanvas;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var dots = [], cols = 0, rows = 0;
    var mouse = { x: NaN, y: NaN };
    var raf = 0;
    var idle = false;
    var last = 0;
    var FRAME = 1000 / 30;
    var resizeTimer = null;

    function buildGrid() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      cols = Math.ceil(w / 90) + 1;
      rows = Math.ceil(h / 90) + 1;
      var ox = (w - (cols - 1) * 90) / 2;
      var oy = (h - (rows - 1) * 90) / 2;
      dots = [];
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var rx = ox + 90 * x, ry = oy + 90 * y;
          dots.push({ restX: rx, restY: ry, x: rx, y: ry, vx: 0, vy: 0 });
        }
      }
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }
    resize();

    function onMove(e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      wake();
    }
    if (!reducedMotion) listen(window, "mousemove", onMove, { passive: true });

    function draw(mx, my, active) {
      var opts = currentConstellation();
      var w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = opts.lineColor + " " + opts.lineOpacity + ")";
      ctx.lineWidth = 0.5;
      var i, j, a, b, dx, dy, dist, ux, uy;
      for (j = 0; j < rows; j++) {
        for (i = 0; i < cols - 1; i++) {
          a = dots[j * cols + i]; b = dots[j * cols + i + 1];
          dx = b.x - a.x; dy = b.y - a.y;
          dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 20) continue;
          ux = dx / dist; uy = dy / dist;
          ctx.beginPath();
          ctx.moveTo(a.x + 10 * ux, a.y + 10 * uy);
          ctx.lineTo(b.x - 10 * ux, b.y - 10 * uy);
          ctx.stroke();
        }
      }
      for (i = 0; i < cols; i++) {
        for (j = 0; j < rows - 1; j++) {
          a = dots[j * cols + i]; b = dots[(j + 1) * cols + i];
          dx = b.x - a.x; dy = b.y - a.y;
          dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 20) continue;
          ux = dx / dist; uy = dy / dist;
          ctx.beginPath();
          ctx.moveTo(a.x + 10 * ux, a.y + 10 * uy);
          ctx.lineTo(b.x - 10 * ux, b.y - 10 * uy);
          ctx.stroke();
        }
      }

      ctx.fillStyle = opts.dotColor + " " + opts.dotOpacity + ")";
      for (i = 0; i < dots.length; i++) {
        var p = dots[i];
        var n = 1.8, alpha = opts.dotOpacity;
        if (!isNaN(mx) && !isNaN(my)) {
          dx = p.x - mx; dy = p.y - my;
          dist = Math.sqrt(dx * dx + dy * dy);
          var l = Math.max(0, 1 - dist / 140);
          n = 1.8 + 2 * l;
          alpha = opts.dotOpacity + 0.4 * l;
        }
        ctx.globalAlpha = state.dark ? alpha : alpha / opts.dotOpacity;
        if (opts.round) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, n, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillRect(p.x - n, p.y - n, 2 * n, 2 * n);
        }
      }
      ctx.globalAlpha = 1;
    }

    function wake() {
      if (disposed || document.hidden || reducedMotion) return;
      if (idle) {
        idle = false;
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    }

    function loop(now) {
      if (disposed) return;
      if (now - last < FRAME) { raf = requestAnimationFrame(loop); return; }
      last = now - (now - last) % FRAME;

      // 布局未就绪时补一次尺寸同步
      if (Math.round(canvas.clientWidth * dpr) !== canvas.width ||
          Math.round(canvas.clientHeight * dpr) !== canvas.height) {
        resize();
      }

      var mx = mouse.x, my = mouse.y;
      var maxSpeed = 0;
      for (var i = 0; i < dots.length; i++) {
        var p = dots[i];
        if (!isNaN(mx) && !isNaN(my)) {
          var dx = p.x - mx, dy = p.y - my;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140 && d > 0.1) {
            var e = (1 - d / 140) * 30;
            var ux = dx / d, uy = dy / d;
            p.vx += ux * e * 0.1;
            p.vy += uy * e * 0.1;
          }
        }
        p.vx += 0.05 * (p.restX - p.x);
        p.vy += 0.05 * (p.restY - p.y);
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;
        var sp = Math.abs(p.vx) + Math.abs(p.vy);
        if (sp > maxSpeed) maxSpeed = sp;
      }
      draw(mx, my, true);
      if (maxSpeed < 0.01) {
        idle = true;
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    themeRefreshers.push(function () { draw(NaN, NaN, false); });
    cleanups.push(function () { cancelAnimationFrame(raf); clearTimeout(resizeTimer); });
    listen(document, "visibilitychange", function () {
      if (document.hidden) { cancelAnimationFrame(raf); idle = true; }
      else { draw(NaN, NaN, false); wake(); }
    });
    if (reducedMotion) {
      draw(NaN, NaN, false); // 静态单帧
    } else {
      idle = false;
      raf = requestAnimationFrame(loop);
    }

    listen(window, "resize", function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        draw(NaN, NaN, false);
        wake();
      }, 150);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 主题联动
   * ------------------------------------------------------------------ */
  function observeTheme() {
    var apply = function () {
      var d = detectDark();
      if (d !== state.dark) {
        state.dark = d;
        applyThemeClass();
      }
    };
    if (window.MutationObserver) {
      var mo = new MutationObserver(apply);
      themeObserver = mo;
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ds-dark-theme", "data-ds-light-theme", "class"] });
      if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme", "data-ds-light-theme"] });
      else listen(document, "DOMContentLoaded", function () { mo.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme", "data-ds-light-theme"] }); });
    }
    if (darkQuery && darkQuery.addEventListener) {
      listen(darkQuery, "change", apply);
    }
  }

  /* 供 HMR 重建时调用：停掉本实例的 DOM 与计时器（渲染循环通过 disposed 标志停止）。 */
  function dispose() {
    disposed = true;
    cleanups.forEach(function (cleanup) { try { cleanup(); } catch (e) { } });
    themeRefreshers.length = 0;
    try { if (container && container.parentNode) container.parentNode.removeChild(container); } catch (e) { }
    try { if (styleTag && styleTag.parentNode) styleTag.parentNode.removeChild(styleTag); } catch (e) { }
    try { if (syncTimer) clearInterval(syncTimer); } catch (e) { }
    try { if (themeObserver) themeObserver.disconnect(); } catch (e) { }
    if (window.__dshDeepSeekBgHandle && window.__dshDeepSeekBgHandle.dispose === dispose) window.__dshDeepSeekBgHandle = null;
    window.__dshDeepSeekBg = false;
  }
  window.__dshDeepSeekBgHandle = { dispose: dispose };

  boot();
}

    exports.apply = apply;
    return module.exports;
  }
});
