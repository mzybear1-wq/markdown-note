# 项目实战 - Markdown 笔记应用 技术设计 (TECH_DESIGN)

## 1. 技术选型
本项目的前端开发框架及依赖库与基础实战项目保持一致的现代化风格，同时引入了处理 Markdown 所需的特定库：
- **核心框架**: React + TypeScript + Vite
- **Markdown 解析渲染**: `react-markdown` (用于将 Markdown 文本安全高效地转换为 React/HTML 元素)
- **代码语法高亮**: `react-syntax-highlighter` (搭配 `react-markdown` 的自定义渲染器使用，支持多种语言如 JavaScript, Python, Java 等的高亮)
- **状态管理**: 推荐使用 Zustand（与 todo-pro 一致）或 React 原生 Context + Hooks，管理所有笔记数据及当前激活的笔记状态。
- **样式处理**: Tailwind CSS（实现响应式的左右分栏布局和各种交互样式）
- **数据存储**: LocalStorage API（用于数据持久化保存）

## 2. 数据模型设计 (Data Model)
核心的笔记对象 (Note) 的结构定义：
- `id` (string): 唯一标识符（例如 UUID 或 `Date.now().toString()`）。
- `title` (string): 笔记标题。
- `content` (string): 笔记的 Markdown 原文内容。
- `createdAt` (string/Date): 笔记创建时间。
- `updatedAt` (string/Date): 最后修改时间（支持自动保存或排序）。

全局应用状态 (Store State)：
- `notes` (Note[]): 所有的笔记列表。
- `activeNoteId` (string | null): 当前正在编辑/预览的笔记 ID。
- `searchQuery` (string): 侧边栏搜索过滤文本。

## 3. 系统架构与模块划分
项目可以按照以下功能层级进行划分开发：

1. **整体响应式布局层 (Layout)**
   - 使用 Tailwind CSS 的 Flex 或 Grid，实现三栏或两栏布局。
   - 电脑端：[左侧边栏 (笔记列表)] | [中间区 (Markdown 编辑器)] | [右侧区 (预览区)]。
   - 移动端：自动响应式变为上下布局。

2. **数据状态与持久化层 (State & Storage)**
   - 封装 LocalStorage 读写，保存 `notes` 数组。
   - Zustand Store 负责提供 `addNote`, `deleteNote`, `updateNote`, `setActiveNote` 等核心操作。

3. **侧边栏笔记列表 (Sidebar / NoteList Component)**
   - 包含顶部的搜索框（模糊搜索 `title`）。
   - 包含“新建笔记”按钮。
   - 渲染笔记列表项，点击可切换 `activeNoteId`。支持直接删除。

4. **编辑器区域 (Editor Component)**
   - 核心是一个多行文本框 (`textarea`)。
   - **快捷键拦截**：
     - 监听 `onKeyDown` 事件：当按键为 `Tab` 时，阻止默认的焦点切换行为 (`e.preventDefault()`)，并在光标处插入空格或缩进符。
     - 监听 `Ctrl+B` (或 `Meta+B`)：阻止默认书签行为，获取选中范围，将选中文本用 `**` 包裹以实现加粗。
   - **双向绑定**：监听 `onChange` 并同步更新当前激活 Note 的 `content`。

5. **预览渲染区域 (Preview Component)**
   - 接收当前编辑器的 `content` 字符串。
   - 使用 `<ReactMarkdown>` 组件渲染内容。
   - 配置 `components` 属性：自定义覆盖 `code` 标签的渲染，引入 `<SyntaxHighlighter>` 并配置语言和主题。

## 4. 关键技术难点
- **编辑与预览同步**: 文本框的输入直接写入全局状态，预览区读取该状态并实时渲染。
- **自定义 Markdown 组件**: 正确地从 `react-markdown` 中分离内联代码 (inline code) 和代码块 (code block)，并将代码块的内容传递给 `react-syntax-highlighter`。
- **光标位置与快捷键处理**: 在 `textarea` 中实现自定义快捷键需要准确计算当前光标的 `selectionStart` 和 `selectionEnd`，在插入格式符号后还需要手动还原光标位置，以提升体验。
