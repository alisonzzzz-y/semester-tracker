# 🚀 Semester Tracker - 快速开始指南

## 方式 1: 最简单的方式（推荐新手）

### 1. 创建项目

打开终端（命令行），执行：

```bash
# 创建新的 React 项目
npm create vite@latest my-semester-tracker -- --template react

# 进入项目文件夹
cd my-semester-tracker

# 安装基础依赖
npm install

# 安装图表和图标库
npm install lucide-react recharts
```

### 2. 替换代码

- 打开 `my-semester-tracker/src/App.jsx`
- 删除所有内容
- 粘贴下载的 `src/App.jsx` 的内容
- 保存文件

### 3. 运行项目

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:5173` ✅

---

## 方式 2: 使用 Claude Code 进行开发

### 安装 Claude Code

```bash
# macOS/Linux
curl -fsSL https://docs.anthropic.com/claude/reference/claude-code-install | sh

# 或使用 npm
npm install -g @anthropic-ai/claude-code
```

### 使用 Claude Code

```bash
# 在项目目录中
cd my-semester-tracker

# 启动 Claude Code
claude-code
```

### 开始改进

直接用中文描述你想要的功能：

```
示例 1: "添加一个搜索框可以搜索任务"
示例 2: "优化手机端显示"
示例 3: "添加导出数据为 CSV 的功能"
```

---

## 💡 推荐的第一次改进

```
1. "添加主题切换按钮，可以切换亮色和暗色"
2. "让任务可以添加备注"
3. "添加导出数据功能"
```

详见 README.md 获取更多信息！
