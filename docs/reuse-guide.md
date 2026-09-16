# 现有能力复用指南

先读对应实现及其调用页面，再决定是否需要扩展。项目中有现成实现时，不另写一份。

| 场景 | 入口 | 参考 |
| --- | --- | --- |
| 列表整体布局、CRUD | `src/views/UserCurd/index.tsx` | 查询 Card + 操作栏／表格／分页 Card |
| 查询表单、展开收起、字段设置 | `src/components/SearchTableForm/index.tsx` | `src/components/SearchTableForm/readme.md`、UserCurd |
| 表格分页与刷新 | `src/hooks/useTableHooks.ts` 的 `useBasePageTable` | UserCurd |
| 行选中状态 | 同文件的 `useTableChecked` | 下方行数据示例、`tests/hooks.test.ts` |
| 行增删、复制、按 ID 更新 | 同文件其余行操作 hooks | 先检查参数及当前数据结构 |
| 高度适配 | `src/hooks/useElementBottomDistance.ts` | UserCurd 的 `TABLE_SCROLL_OFFSET` |
| DOM 变化监听 | `src/hooks/useDomChange.ts` | 上面的测量 hook；页面通常无需直接调用 |
| state 与 ref 同步 | `src/hooks/useRefState.ts` | 通过返回的 setter 更新，ref 用于读取最新值 |
| 通用异步请求状态 | `src/hooks/useResource.ts` | 表格 hook 的组合方式 |
| 权限 | `src/hooks/useAccess.ts`、`src/components/Access/index.tsx` | `src/views/AccessPage`、`src/router` |
| 全局状态 | `src/store/sys.ts` | `src/views/EBoxUse` |
| CRUD 弹窗 | `src/views/UserCurd/components/UserFormModal` | 通过 ref 的 `open(config)` 打开 |
| HTTP | `src/http/index.ts`、`src/http/request.ts` | 沿用现有客户端和拦截器 |
| 富文本 | `src/components/EditorPro` | 优先检查已有封装 |
| 面包屑 | `src/components/PublicBreadcrumb` | 沿用布局提供的入口 |
| 本地缓存与工具 | `src/utils/localStore.ts`、`src/utils/index.ts` | 先检查数据格式和已有调用 |

## 表格使用方式

`useBasePageTable` 维护页码、页容量、查询条件和请求状态。`getTableData` 接收这些参数，返回 `{ data, total }`，可返回服务校正后的 `pageNum`、`pageSize` 及 `meta`。修改查询条件或页容量会回到第一页；重复设置相同页容量不会重置页码。

需要 URL 作为查询来源时，传入 `query` 和 `onQueryChange` 使用受控模式，不再另外维护一份页面查询 state。普通 CRUD 直接沿用 UserCurd 的非受控方式。

```tsx
const table = useBasePageTable<Row, SearchParams>({
  defaultPageSize: 5,
  cachePageSizeKey: "example-page-size",
  getTableData: async ({ pageNum, pageSize, searchParams }) => {
    const result = await fetchRows({ pageNum, pageSize, ...searchParams });
    return { data: result.list, total: result.total };
  },
});
const { checkedIds, changeChecked } = useTableChecked({
  tableData: table.tableData,
  setTableData: table.setTableData,
  idName: "id",
});
// Table 的 selectedRowKeys 使用 checkedIds。
// 单选：changeChecked([record.id], checked)。
// 全选：changeChecked(changedRows.map(row => row.id), checked)。
// 清空：changeChecked(checkedIds, false)。
```

`_checked` 是行上的 UI 状态，提交业务接口时显式选择业务字段。重新加载整页数据后，选中状态由新行数据决定，不默认保留跨页选择。

## 通用请求与测量

`useResource(fetcher, deps, options)` 返回 `data`、`error`、`loading`、`reload` 等。依赖变化时重新请求，清理时阻止旧请求覆盖结果；这不等于取消底层网络请求。`options.delay` 控制延迟，`options.subscribe` 可注入返回清理函数的外部订阅。依赖中的对象应稳定，避免每次渲染重复请求。

`useElementBottomDistance(ref)` 已组合 DOM 监听和测量。优先将 ref 放在查询区或操作栏底部，用 `distance - TABLE_SCROLL_OFFSET` 计算表体高度并设置最小值。占位常量应对应页面实际固定区域，不复制另一套监听器。

## 检查命令

```sh
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

单元测试覆盖通用 hooks。浏览器测试覆盖 main 的用户 CRUD 和 e-boxes 示例，使用独立的 8781 端口，测试框架负责启动和回收服务。
