# 待办事项应用 (Markdown 笔记版) - 开发指令 (AGENTS)

## 1. 代码规范
- **语言**: React + TypeScript
- **组件范式**: 必须使用函数式组件 (Functional Components) 和 React Hooks (useState, useEffect 等)。
- **样式方案**: 必须使用 Tailwind CSS 类名实现响应式布局。例如使用 `flex` 配合 `flex-1`，或者使用 `grid` 配合 `grid-cols-2` 划分左右两栏。
- **状态管理**: 使用 **Zustand** 管理应用全局状态（包括当前选中的笔记、所有笔记列表、搜索文本等）。
- **Markdown 渲染**: 必须使用 `react-markdown` 进行文本转换为 HTML。
- **代码高亮**: 必须使用 `react-syntax-highlighter`，并通过 `react-markdown` 的自定义 `components` 注入到代码块 (`<code>`) 的渲染中，支持指定语言如 JavaScript、Python 等的高亮效果。

## 2. 数据与存储规范
- **数据持久化**: 必须将所有笔记数据持久化保存在 `LocalStorage` 中。由于笔记可能包含大量文本，每次输入内容（或失焦时）应当自动同步到本地存储，并在页面初始化时读取恢复。
- **模型定义**: 必须明确声明 `Note` 模型接口，包含字段 `id`, `title`, `content`, `createdAt`, `updatedAt`。

## 3. 开发执行步骤
开发建议按以下六个阶段进行验证：
1. **构建基础布局**: 创建主页面结构，侧边栏（笔记列表）+ 右侧（编辑器与预览区分栏）。确保使用 Tailwind CSS 满足响应式（手机端变为上下堆叠）。
2. **状态与持久化配置**: 创建 Zustand Store，封装 LocalStorage 方法，提供增、删、改、查、切换笔记的基础逻辑。
3. **集成 Markdown 解析**: 在预览区引入 `react-markdown`，将静态文本进行初步渲染测试。
4. **实现实时预览与编辑同步**: 将左侧编辑器的内容通过状态传递给右侧的 `react-markdown` 预览组件。验证输入文本时预览区是否实时更新。
5. **添加代码高亮**: 引入 `react-syntax-highlighter`，编写 `react-markdown` 的 `components.code` 渲染规则，确保 Markdown 中的代码块能够高亮展示。
6. **添加笔记管理与高级快捷键**:
   - 完善左侧边栏的搜索和删除功能。
   - 在左侧大文本框中增加快捷键拦截（监听 `Tab` 插入空格；监听 `Ctrl+B` 或 `Cmd+B` 自动在选中文本两端加上 `**`）。

## 4. 关键提示给 AI (AI Prompts)
在实际开发时，你可以通过以下提示词引导 AI 完成功能：
- **布局提示**: “创建左右分栏布局，左侧是 Markdown 编辑器（大文本框），右侧是预览区。使用 Tailwind CSS 实现响应式布局。”
- **解析提示**: “使用 react-markdown 将 Markdown 文本转换为 HTML，在预览区显示渲染后的效果。”
- **同步提示**: “监听编辑器的输入变化，实时更新预览区。当用户在左侧编辑时，右侧同步显示 Markdown 渲染后的效果。”
- **高亮提示**: “配置 react-syntax-highlighter，让代码块支持语法高亮。支持多种编程语言，比如 JavaScript、Python、Java 等。”
- **管理功能提示**: “实现笔记管理功能：左侧添加笔记列表，显示所有笔记的标题；点击笔记可以切换到该笔记；支持创建新笔记、删除笔记；支持搜索笔记（按标题搜索）；数据保存在 LocalStorage。”
- **快捷键提示**: “在编辑器大文本框中，支持 Tab 键插入空格而不是切换焦点，支持 Ctrl+B 加粗选中文本。”

## 5. 注意事项
- 每集成一个核心库（如 `react-markdown` 或 `react-syntax-highlighter`），必须确保依赖安装成功（包括对应的 `@types` 类型声明）再进行下一步开发。
- 处理快捷键时，修改文本后必须重新计算光标的新位置，并将焦点保持在原来的地方，否则会极大地破坏输入体验。
