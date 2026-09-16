# 项目开发约定

本文件适用于整个仓库。开发前先阅读 [复用指南](docs/reuse-guide.md)，以现有代码和用户明确要求为准。

## 先查找，再实现

- 动手前检查相关的 `src/hooks`、`src/components`、`src/utils`、`src/http`、`src/store` 和相似页面。用 `rg` 搜索现有调用，不只看导出名称。
- 开始实现前简要说明准备复用的文件；确有缺口时说明现有接口为什么不能满足，优先做最小补充。
- 优先级：直接复用现有实现 → 在页面中组合现有能力 → 必要时兼容扩展公共能力 → 最后才新增抽象。
- 不因个人偏好重写已有公共实现、增加平行状态、复制 hooks，或换用另一套库。已有缺陷应修复并验证，不能另写一套绕过。
- 修改公共接口前检查所有调用点，保留合理的兼容入口，避免影响已有页面。

## 列表和表单

- 列表页面以 `src/views/UserCurd/index.tsx` 为参考。保持现有侧栏、顶栏和紧凑的 Ant Design 风格，不添加占空间的 page-heading。
- 查询区单独一个 Card；操作栏、表格、分页放在同一个 Card。
- 查询使用 `SearchTableForm`，展开／收起、字段显隐、排序和缓存使用其现有能力。
- 分页、查询、loading 和刷新使用 `useBasePageTable`，统一从 `useTableHooks.ts` 导入，不维护另一份实现。
- 表格选中状态使用 `useTableChecked`，唯一来源是行数据的 `_checked`。选中 ID、记录、数量从行数据派生，不另建 selected ID 状态。
- 表格高度使用 `useElementBottomDistance`，参照 UserCurd 的剩余高度减固定占位方式。先考虑现有 hook，避免页面重复创建 ResizeObserver 或测量 Ant Design 内部 DOM。
- CRUD 弹窗参考 UserCurd 的 `UserFormModal`；页面专属表单放在该页面的 `components` 中，不提前抽象成通用业务框架。

## UI 组件选择

- 项目已有满足需求的封装时优先复用；没有封装时，基础 UI 优先直接使用 Ant Design 或组合其组件，再考虑自定义实现。
- 表格、表单、按钮、弹窗、抽屉、分页、选项卡、提示、空状态、加载态等不重复造轮子。先检查当前安装版本的类型、现有用法和必要的官方文档，确认已有属性或组合方式是否能解决问题。
- 简单布局可以直接用 CSS；不要为替换一小段布局引入组件库，也不要为统一名字给每个 Ant Design 组件再套一层。
- 封装应解决实际重复的交互或配置，而非单纯转发全部 props。优先使用组件公开 API、主题配置和项目已有样式，避免依赖内部 DOM 结构或大范围覆盖全局样式。
- 自定义组件前说明 Ant Design 与项目现有组件的具体缺口，只实现缺失部分。新 UI 库和图标库不能因个人习惯引入。

## 组件归属与目录

- 页面入口使用 `src/views/PageName/index.tsx`；页面专属 UI 放在该页面的 `components`，布局专属 UI 放在 `src/layout/components`，业务无关且确有跨页面用途的组件才放进 `src/components`。
- 组件采用 `ComponentName/index.tsx`、`index.module.less` 的目录形式。页面和组件目录用 PascalCase，hooks 用 `useXxx.ts`，store 和工具文件沿用 lowerCamelCase。不要为统一命名批量重命名现有文件。
- 优先提取页面私有组件和逻辑，有真实复用需求后再提升为公共能力；不要为了缩短文件机械拆分，也不要把整个页面流程塞进通用组件。
- 新增公共展示组件通过 props 接收数据、回调和配置，避免直接依赖页面 store、业务 API、特定实体字段或硬编码业务文案。已有异步字段组件沿用注入加载函数的方式。
- 样式跟随所属组件，真正全局的主题和基础样式才放全局文件。按实际需要建立目录，不创建空目录来凑结构。
- 路由和菜单元数据保留在 `src/router`，业务逻辑放页面或业务模块；HTTP 客户端、拦截器沿用 `src/http`，页面不另建 axios 实例。

## 状态、权限与请求

- 项目沿用 e-boxes；全局状态参考 `src/store/sys.ts`，读取和更新方式参考 `src/views/EBoxUse`。不要引入第二套状态库。
- 页面临时状态留在页面。事件或异步回调需要最新 React 状态时，优先使用 `useRefState`。
- 权限复用 `useAccess`、`Access` 和现有路由权限机制，不在页面复制权限框架。具体业务规则放在业务模块。
- 请求沿用 `src/http`；通用异步读取可组合 `useResource`。通用 hook 不直接依赖某个业务服务或 Mock，订阅等能力通过参数组合。
- 工具函数先查 `src/utils` 和已有依赖；日期使用已有 dayjs，图标沿用现有 @ant-design/icons。

## 工程与验收

- 使用现有 React、TypeScript、Hash Router、`@/` 别名、Less 和 CSS Modules 约定；跨模块使用 `@/`，邻近私有文件使用相对路径。
- 安装依赖用 cnpm，仅添加任务确实需要的依赖，不调整全局源配置。
- 完成后检查：是否重复实现、是否有两份相同状态、是否无必要扩展公共接口、是否改变相邻页面的行为。
- 运行 `npm run typecheck`、`npm run lint`，按改动运行单元测试、浏览器回归和构建。公共 hooks 变动需要验证旧调用方，不能只验证新页面。
- 汇报实际验证范围和未通过的检查。自测服务使用独立端口并在结束后停止；用户使用中的预览服务不擅自停止。
- 新增或调整公共能力时同步更新复用指南，使后续开发能找到入口与示例。
