# 纸间书店 · Paper Between

一个用 **Vue 3 + Vite** 完成的课程练习网站。主题是「一家不着急的独立书店」，包含首页、书架、书籍详情、关于四个页面，以及 27 个 Vue 单文件组件。

网站没有使用 UI 框架，所有封面、门面、地图插画都由 CSS 与内联 SVG 绘制，不依赖外部图片。

## 在线预览

- **BrewPage 公网地址**：<https://paperbook-2026-1025-8ntwatz1vs.brewpage.app/>
- 该地址为 30 天临时预览（至 2026-11-24），适合课程提交与演示。
- 路由使用 Hash 模式，刷新任意页面都不会 404。

## 交付物

| 文件 | 说明 |
| --- | --- |
| `实验报告_纸间书店_Vue3.docx` | 按模板补全的实验报告（40 页，含截图、代码与测试） |
| `实验报告_纸间书店_Vue3.pdf` | 报告 PDF 预览版 |
| `shots/` | 桌面端 / 移动端运行截图 |
| `dist/` | 可直接静态托管的构建产物（运行 `pnpm build` 生成） |
| `.github/workflows/deploy.yml` | GitHub Pages 自动部署工作流 |

## 页面

| 路由 | 页面 | 主要内容 |
| --- | --- | --- |
| `/#/` | 首页 | Hero、数据统计、编辑精选、主题书架、语录轮播、本周共读、活动日历、订阅表单 |
| `/#/shelf` | 书架 | 搜索、分类/气质筛选、排序、网格/列表切换、加入书架、URL 查询同步 |
| `/#/books/:id` | 书籍详情 | 动态路由、书籍信息、Tabs、异步读者短评、阅读进度、关联推荐 |
| `/#/about` | 关于 | 书店故事、价值观、时间线、团队、活动报名、FAQ、地图、联系表单 |
| `/#/:pathMatch(.*)*` | 404 | 自定义缺省页 |

## 快速开始

需要 Node.js 18+ 和 pnpm。

```bash
pnpm install
pnpm dev          # http://127.0.0.1:5173
pnpm build        # 构建到 dist/
pnpm preview      # http://127.0.0.1:4173
```

如果系统没有 pnpm，也可以使用 `npm install` 与 `npm run build`。

## 技术栈

- Vue 3.5（`<script setup>`、Composition API）
- Vue Router 4（Hash 模式、动态路由、路由守卫、滚动行为）
- Vite 6
- CSS Variables / Container Queries / Grid / Transition
- localStorage 持久化
- Playwright Core（仅用于本地自动验收与截图）

## 目录结构

```text
paperbook/
├─ src/
│  ├─ assets/styles.css          # 设计变量与全局样式
│  ├─ components/                # 21 个通用/业务组件
│  ├─ composables/               # useShelf / useTheme / useToast
│  ├─ data/books.js              # 书目、主题书架、活动、语录数据
│  ├─ directives/reveal.js       # v-reveal 滚动入场指令
│  ├─ router/index.js            # 路由表、守卫、滚动行为
│  ├─ views/                     # 5 个页面组件
│  ├─ App.vue
│  └─ main.js
├─ scripts/                     # 浏览器验收与截图脚本
├─ shots/                       # 桌面端 / 移动端运行截图
├─ .github/workflows/deploy.yml # GitHub Pages 自动部署
├─ index.html
└─ vite.config.js
```

## 27 个单文件组件

**页面（5）**：`HomeView`、`ShelfView`、`BookDetailView`、`AboutView`、`NotFoundView`

**布局与基础（7）**：`App`、`AppHeader`、`AppFooter`、`BaseButton`、`BaseTag`、`SectionTitle`、`EmptyState`

**书籍业务（7）**：`BookCard`、`BookCover`、`StarRating`、`BookTabs`、`BookReviews`、`ReadingProgress`、`ShelfDrawer`

**交互与表单（8）**：`SearchField`、`FilterPills`、`QuoteMarquee`、`StatBlock`、`NewsletterForm`、`ContactForm`、`FaqList`、`ToastStack`

## Vue 教程知识点覆盖

| 知识点 | 主要落点 |
| --- | --- |
| 模板语法、`v-bind`、`v-on`、`v-if` / `v-else`、`v-show`、`v-for` | 所有页面与组件 |
| `ref` / `reactive` / `computed` | `useShelf.js`、`ShelfView.vue`、`BookDetailView.vue` |
| `watch` / `watchEffect` | 书架持久化、搜索防抖、路由查询同步、Tabs |
| 生命周期 `onMounted` / `onUnmounted` / `onActivated` | `AppHeader`、`QuoteMarquee`、`StatBlock`、`ShelfView` |
| 模板引用与 `defineExpose` | `SearchField` 聚焦、`StatBlock` 观察器、`ShelfDrawer` 关闭按钮 |
| Props / Emits | `BookCard`、`BookTabs`、`ReadingProgress`、`SectionTitle` |
| `v-model` 与 `defineModel` | `SearchField`、`FilterPills`、`ReadingProgress`、`BookTabs` |
| 插槽（默认 / 具名） | `BaseButton`、`SectionTitle`、`EmptyState` |
| `provide` / `inject` | `App` 提供 `shelf`、`theme`、`toast`，全局注入 |
| 动态组件与 `KeepAlive` | `App.vue` 的 RouterView + KeepAlive |
| 异步组件与 `Suspense` | `BookDetailView` → `BookReviews` |
| `Transition` / `TransitionGroup` | 页面切换、抽屉、Toast、书目列表、FAQ |
| `Teleport` | 移动端菜单、书架抽屉、Toast |
| 自定义指令 | `v-reveal`（IntersectionObserver 滚动入场） |
| 表单绑定与修饰符 | 联系表单、订阅表单、搜索框、阅读进度 |
| 路由 | 动态路由 `/books/:id`、`beforeEnter` 守卫、`scrollBehavior`、query 同步 |
| 组合式函数 | `useShelf`、`useTheme`、`useToast` |
| 性能与体验 | `v-once`、`v-memo` 思路、CSS `prefers-reduced-motion`、懒加载路由 |
| 全局状态持久化 | localStorage + `watch` 深度监听 |

## 设计说明

- 主色：森林绿 `#2f4a3d`、陶土橙 `#bd6748`、旧纸金 `#d3a34b`、纸白 `#f4ede1`。
- 标题使用宋体/Songti 字族，正文使用无衬线中文字体，形成“纸页 + 现代排版”的对比。
- 每本书的封面根据 `palette` 与 `motif` 动态生成，同一组件支持 11 种封面母题。
- 夜间模式通过 `data-theme="night"` 切换 CSS 变量，偏好写入 localStorage。
- 响应式断点：1100 / 900 / 700 / 620 / 480 px。

## 自动化验收

```bash
# 先启动 preview
pnpm preview

# 另一个终端执行
node scripts/verify.mjs    # 交互、路由、表单、持久化、控制台错误
node scripts/capture.mjs   # 重新生成 shots/ 截图
```

验收脚本覆盖：首页加入书架、抽屉、搜索、分类筛选、列表视图、详情页进度、FAQ、联系表单、404、移动菜单、夜间模式；并检查 console / pageerror / requestfailed。

## 部署

### 当前公网预览

已构建并上传到 BrewPage（免登录静态托管），见上方在线预览地址。构建产物使用 `base: './'` 与 Hash 路由，可直接放在任意静态目录。

### GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。推送到 `main` 后：

1. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**；
2. 等待 `Deploy to GitHub Pages` 工作流完成；
3. 访问 `https://<username>.github.io/<repo>/`。

由于使用 Hash 路由，GitHub Pages 不需要额外的 404 fallback。

```bash
git init
git add .
git commit -m "feat: paperbook vue practice site"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## 说明

本项目为 Web 全栈开发课程练习作品，非商业用途。书名、作者与书籍信息取自公开资料，封面为原创 CSS 绘制，不代表真实版本封面。
