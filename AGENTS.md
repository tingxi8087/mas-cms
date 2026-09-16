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
- 分页、查询、loading 和刷新使用 `useBasePageTable`，从 `useTableHooks.ts` 导入。`openDobuleTableHooks.ts` 仅用于兼容旧导入，不维护另一份实现。
- 表格选中状态使用 `useTableChecked`，唯一来源是行数据的 `_checked`。选中 ID、记录、数量从行数据派生，不另建 selected ID 状态。
- 表格高度使用 `useElementBottomDistance`，参照 UserCurd 的剩余高度减固定占位方式。先考虑现有 hook，避免页面重复创建 ResizeObserver 或测量 Ant Design 内部 DOM。
- CRUD 弹窗参考 UserCurd 的 `UserFormModal`；页面专属表单放在该页面的 `components` 中，不提前抽象成通用业务框架。

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
