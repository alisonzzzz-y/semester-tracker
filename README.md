# Semester Tracker - React 应用

一个用于跟踪学期任务和学习进度的应用，支持任务管理、每周评分、连续天数统计等功能。

## 📦 文件说明

- `semester-tracker.jsx` - 完整的 React 组件代码

## 🚀 快速开始 - 本地运行

### 步骤 1: 创建 React 项目

```bash
# 使用 Vite（推荐，更快）
npm create vite@latest semester-tracker -- --template react
cd semester-tracker
```

### 步骤 2: 安装依赖

```bash
npm install
npm install lucide-react recharts
```

### 步骤 3: 替换代码

将下载的 `semester-tracker.jsx` 内容复制到 `src/App.jsx`

### 步骤 4: 运行

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`

---

## 🤖 使用 Claude Code 进行开发

### 什么是 Claude Code？

Claude Code 是一个命令行工具，可以让 Claude AI 直接帮你编写和修改代码。

### 安装 Claude Code

```bash
# 方法 1: 使用官方安装脚本
curl -fsSL https://docs.anthropic.com/claude/reference/claude-code-install | sh

# 方法 2: 通过 npm
npm install -g @anthropic-ai/claude-code
```

### 使用 Claude Code 的步骤

#### 1. 初始化项目

```bash
cd semester-tracker
claude-code
```

#### 2. 与 Claude Code 对话

在终端中直接输入你想要的改进：

**示例 1 - 添加新功能：**
```
你：添加一个导出数据为 CSV 的功能，在 Statistics 页面添加一个下载按钮

Claude Code 会：
- 分析当前代码
- 创建导出函数
- 添加下载按钮
- 测试功能
```

**示例 2 - 修复问题：**
```
你：修复在 Safari 浏览器上日历显示错位的问题

Claude Code 会：
- 检测浏览器兼容性问题
- 修改 CSS
- 测试修复效果
```

**示例 3 - 优化性能：**
```
你：优化任务列表的渲染性能，任务很多时有点卡

Claude Code 会：
- 分析性能瓶颈
- 添加虚拟滚动或分页
- 优化 re-render
```

---

## 💡 Claude Code 实用命令示例

### 功能开发

```bash
# 添加搜索功能
"在 Dashboard 添加搜索框，可以按任务名称和类别搜索"

# 添加过滤功能
"添加按钮可以只显示已完成/未完成的任务"

# 添加排序功能
"让 Previous Tasks 可以按日期或分数排序"

# 添加批量操作
"添加全选功能，可以批量删除已完成的任务"
```

### 数据管理

```bash
# 云端同步
"集成 Supabase，让数据可以云端同步"

# 导出功能
"添加导出所有数据为 JSON 的按钮"

# 导入功能
"添加导入 JSON 数据的功能，带数据验证"

# 数据备份
"每周自动备份数据到 localStorage 的另一个 key"
```

### UI/UX 优化

```bash
# 响应式设计
"优化移动端显示，小屏幕上改为垂直布局"

# 主题切换
"添加亮色/暗色主题切换功能"

# 动画优化
"给任务完成添加庆祝动画效果"

# 快捷键
"添加键盘快捷键：Ctrl+N 添加任务，Ctrl+S 搜索"
```

### 部署相关

```bash
# Vercel 部署
"帮我配置 Vercel 部署，创建必要的配置文件"

# Netlify 部署
"创建 Netlify 部署配置和 _redirects 文件"

# 环境变量
"添加环境变量配置，区分开发和生产环境"
```

---

## 🎨 当前功能清单

### ✅ Dashboard
- 快速添加任务（支持 Enter 键提交）
- 4 种任务类别，2 种可自定义分数（3-8分）
- 统计卡片：Weekly Score、Streak、Today、This Week
- Today's Tasks（今天）
- This Week's Tasks（本周一到今天）
- Previous Tasks（历史任务，按日期倒序）

### ✅ Calendar
- 月视图（周一开始，符合国际标准）
- Today 按钮一键跳转
- 日期选择，右侧显示详情
- 任务状态 dots（已完成/未完成）

### ✅ Statistics
- 4 个总览统计卡片
- Weekly Performance 折线图（7周趋势）
- Category Breakdown（类别完成次数对比）
- 30-Day Activity 热力图

### ✅ 数据管理
- localStorage 持久化
- 每周一自动重置（分数、Streak）
- 历史周数据自动保存
- 任务删除（流畅动画）
- 任务撤销（Undo 功能）

---

## 🎯 推荐的进一步改进方向

使用 Claude Code 可以轻松实现：

### 1. 数据增强
- 📊 更多图表类型（饼图、雷达图）
- 📈 每日分数趋势
- 🎯 目标设定和追踪
- 📝 任务备注功能

### 2. 用户体验
- 🔍 全局搜索
- 🏷️ 任务标签系统
- ⏰ 任务提醒（到期提醒）
- 🎨 自定义主题色

### 3. 协作功能
- 👥 多用户支持
- 📤 分享周报告
- 🔗 任务链接分享

### 4. 技术升级
- ☁️ 云端同步（Firebase/Supabase）
- 📱 PWA 支持（可安装为 App）
- 🔔 浏览器通知
- 🌐 i18n 多语言

---

## 📚 代码结构说明

```
semester-tracker.jsx (1400+ 行)
│
├─ 主组件 SemesterTracker
│  ├─ 状态管理 (tasks, weeklyScore, streak, weekHistory...)
│  ├─ 生命周期 (useEffect - 数据加载/保存/周一重置)
│  ├─ 任务操作 (addTask, completeTask, deleteTask...)
│  └─ 工具函数 (getThisMonday, getWeekTasks...)
│
├─ 视图组件
│  ├─ DashboardView (仪表盘)
│  ├─ CalendarView (日历)
│  ├─ StatsView (统计)
│  └─ WeeklyChart (折线图)
│
└─ 数据结构
   ├─ tasks: [{id, text, category, score, date, completed}]
   ├─ weekHistory: [{startDate, endDate, score, tasksCompleted}]
   └─ localStorage: {tasks, weeklyScore, streak, lastWeeklyReset, weekHistory}
```

---

## 🛠️ Claude Code 使用最佳实践

### ✅ 好的提问方式

```
✅ "在 Dashboard 的 Add Task 卡片右上角添加一个设置图标，点击可以配置默认分类"
✅ "修改 Calendar 的日期格子，让它在 hover 时显示当天的任务数量"
✅ "优化 Previous Tasks 的加载性能，当任务超过 100 个时使用虚拟滚动"
```

### ❌ 不好的提问方式

```
❌ "改进一下"（太模糊）
❌ "添加很多功能"（一次改太多）
❌ "让它更好看"（没有具体指标）
```

### 💡 提示技巧

1. **一次只改一个功能** - 避免冲突
2. **说明具体位置** - "在哪里"添加
3. **描述期望效果** - "做什么"
4. **提供设计参考** - "参考 XX 的设计"

---

## 📞 常见问题

### Q: Claude Code 和普通 Claude 有什么区别？

A: Claude Code 可以直接操作你的代码文件，运行命令，测试代码。普通 Claude 只能提供建议。

### Q: 需要联网吗？

A: 需要，Claude Code 通过 API 与 Claude AI 通信。

### Q: 会覆盖我的代码吗？

A: Claude Code 会先展示要修改的内容，需要你确认后才会执行。

### Q: 如何撤销 Claude Code 的修改？

A: 使用 Git 版本控制，或在修改前先备份文件。

---

## 🚀 开始使用

1. **下载文件**: 点击下载 `semester-tracker.jsx` 和 `README.md`
2. **创建项目**: 按照"快速开始"步骤创建 React 项目
3. **运行测试**: 确保应用正常运行
4. **安装 Claude Code**: 按照说明安装
5. **开始改进**: 用 Claude Code 添加你想要的功能！

---

## 📄 License

MIT License - 可自由使用和修改
