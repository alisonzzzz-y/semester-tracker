# Semester Tracker - React Application

An application for tracking semester tasks and study progress, with features including task management, weekly scoring, and consecutive day streaks.

## 📦 File Overview

- `src/App.jsx` - Complete React component code

## 🚀 Quick Start - Run Locally

### Step 1: Create a React Project

```bash
# Using Vite (recommended, faster)
npm create vite@latest semester-tracker -- --template react
cd semester-tracker
```

### Step 2: Install Dependencies

```bash
npm install
npm install lucide-react recharts
```

### Step 3: Replace the Code

Copy the contents of the downloaded `src/App.jsx` into `src/App.jsx`

### Step 4: Run

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173`

## 🎨 Current Feature List

### ✅ Dashboard

- Quick add tasks (supports Enter key to submit)
- 4 task categories, 2 with customizable scores (3–8 points)
- Stats cards: Weekly Score, Streak, Today, This Week
- Today's Tasks (created today)
- This Week's Tasks (Monday to today)
- Previous Tasks (historical tasks, sorted by date descending)

### ✅ Calendar

- Month view (starts on Monday, international standard)
- Today button to jump instantly
- Date selection with detail panel on the right
- Task status dots (completed / incomplete)

### ✅ Statistics

- 4 overview stat cards
- Weekly Performance line chart (7-week trend)
- Category Breakdown (completion count comparison)
- 30-Day Activity heatmap

### ✅ Data Management

- localStorage persistence
- Automatic reset every Monday (score, Streak)
- Automatic saving of historical weekly data
- Task deletion (smooth animation)
- Task undo (Undo feature)

## 🎯 Recommended Further Improvements

### 1. Data Enhancements

- 📊 More chart types (pie chart, radar chart)
- 📈 Daily score trends
- 🎯 Goal setting and tracking
- 📝 Task notes feature

### 2. User Experience

- 🔍 Global search
- 🏷️ Task tagging system
- ⏰ Task reminders (due date alerts)
- 🎨 Custom theme colors

### 3. Collaboration Features

- 👥 Multi-user support
- 📤 Share weekly reports
- 🔗 Task link sharing

### 4. Technical Upgrades

- ☁️ Cloud sync (Firebase/Supabase)
- 📱 PWA support (installable as an app)
- 🔔 Browser notifications
- 🌐 i18n multi-language support

## 📚 Code Structure

```
src/App.jsx (1400+ lines)
│
├─ Main Component: SemesterTracker
│  ├─ State management (tasks, weeklyScore, streak, weekHistory...)
│  ├─ Lifecycle (useEffect - data load/save/Monday reset)
│  ├─ Task operations (addTask, completeTask, deleteTask...)
│  └─ Utility functions (getThisMonday, getWeekTasks...)
│
├─ View Components
│  ├─ DashboardView
│  ├─ CalendarView
│  ├─ StatsView
│  └─ WeeklyChart
│
└─ Data Structures
   ├─ tasks: [{id, text, category, score, date, completed}]
   ├─ weekHistory: [{startDate, endDate, score, tasksCompleted}]
   └─ localStorage: {tasks, weeklyScore, streak, lastWeeklyReset, weekHistory}
```

## 🚀 Getting Started

1. **Download the files**: Download `src/App.jsx` and `README.md`
2. **Create the project**: Follow the "Quick Start" steps to set up a React project
3. **Run a test**: Make sure the app runs correctly
4. **Start improving**: Add the features you want!

## 📄 License

MIT License - Free to use and modify

---

# Semester Tracker - React 应用

一个用于跟踪学期任务和学习进度的应用，支持任务管理、每周评分、连续天数统计等功能。

## 📦 文件说明

- `src/App.jsx` - 完整的 React 组件代码

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

将下载的 `src/App.jsx` 内容复制到 `src/App.jsx`

### 步骤 4: 运行

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`

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

## 🎯 推荐的进一步改进方向

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

## 📚 代码结构说明

```
src/App.jsx (1400+ 行)
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

## 🚀 开始使用

1. **下载文件**: 点击下载 `src/App.jsx` 和 `README.md`
2. **创建项目**: 按照"快速开始"步骤创建 React 项目
3. **运行测试**: 确保应用正常运行
4. **开始改进**: 添加你想要的功能！

## 📄 License

MIT License - 可自由使用和修改
