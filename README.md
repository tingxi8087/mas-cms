# MAS-CMS

MAS-CMS 是一个基于 React + Vite + TypeScript + Ant Design 的后台管理模板。它更偏向“可直接开业务”的中后台骨架：内置 Hash 路由、权限包装、固定后台布局、请求封装、搜索表单、表格分页 hooks、CRUD 示例页，以及 e-boxes 状态示例。

这个模板的目标不是做一个花哨的展示站，而是提供一套稳定、清晰、容易复制的后台页面写法。新增页面时，优先复用已有的布局、搜索表单、表格 hooks 和 8px 间距规范。

## 技术栈

- 框架：React 18
- 构建：Vite 5
- 语言：TypeScript
- UI：Ant Design 5
- 路由：React Router 6，Hash 模式
- 样式：Less / CSS Modules
- 请求：Axios
- 状态：e-boxes
- 其他：moment、lodash、react-quill、mas-encrypt

## 快速开始

### 安装依赖

推荐使用 `cnpm`：

```bash
cnpm install
```

也可以使用 npm：

```bash
npm install
```

### 本地开发

```bash
npm run start
```

等价于：

```bash
vite --mode dev
```

### 构建

```bash
npm run build
```

开发环境配置构建：

```bash
npm run build:dev
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```text
src/
├── .utils/          # 路由渲染、权限包装等工具
├── assets/          # 静态资源
├── components/      # 公共组件，如面包屑、SearchTableForm、富文本编辑器
├── hooks/           # 表格分页、选中、复制、新增、删除等 hooks
├── http/            # 请求封装
├── layout/          # 后台整体布局入口、配置和布局私有组件
├── mock/            # 本地 mock 数据
├── router/          # 路由配置与路由守卫
├── store/           # e-boxes 状态
├── typings/         # 全局类型声明
├── utils/           # 通用工具
├── global.less      # 全局样式入口
├── theme.less       # 主题变量
└── views/           # 页面视图
    ├── Login/       # 登录页
    ├── UserCurd/    # 用户 CRUD 示例页，页面私有组件放在 components/
    ├── EBoxUse/     # e-boxes 示例
    ├── AccessPage/  # 权限示例页
    ├── NoLayout/    # 无布局页
    ├── 403.tsx      # 无权限页
    └── 404.tsx      # 未找到页
```

## 后台模板说明

### 整体布局

布局入口在 `src/layout/Layout.tsx`，样式在 `src/layout/index.module.less`。布局内部子组件放在 `src/layout/components`，例如顶部导航、侧栏菜单和用户菜单。

当前布局使用 CSS Grid：

- `nav`：顶部导航，固定高度。
- `side`：左侧菜单，固定宽度，可折叠。
- `main`：主内容区域，占满剩余空间。

外层容器高度为 `100vh`，整体不滚动；主区域使用 `overflow: auto`，页面内容超出时只在主区域滚动。这样顶部导航和侧边栏不会被页面内容挤动，也不会出现 body 和内容区双滚动互相打架的问题。

布局配置在 `src/layout/layoutConfig.ts`：

```ts
export const layoutConfig = eBox({
  NAV_NAME: "mas-cms",
  navHeight: 50,
  sideNavWidth: 200,
  boxMinWidth: 1200,
  collapsed: false,
  bodyPadding: {
    top: 16,
    left: 16,
  },
});
```

建议：

- 不要在业务页面里重新实现整页布局。
- 页面只负责主区域里的业务内容。
- 布局入口、配置和私有组件分开维护：`Layout.tsx` 负责组合，`layoutConfig.ts` 负责可配置参数，`components/` 放布局内部组件。
- 需要无导航页时，使用已有的 `layoutStore.sideNavHide` / `layoutStore.topNavHide` 机制。
- 主区域里的页面模块优先使用 `Card size="small"` 承载，适合后台的密度和扫描习惯。

### 路由与菜单

路由配置在 `src/router/index.tsx`。菜单由路由配置生成，常用字段包括：

- `label`：菜单名称。
- `path`：路由路径。
- `element`：页面组件。
- `icon`：菜单图标。
- `hideMenu`：是否隐藏菜单项。
- `access`：权限标识。
- `children`：子菜单。

推荐写法：

```tsx
{
  label: "用户管理",
  path: "/curd/users",
  icon: <AppstoreOutlined />,
  access: "admin",
  element: <UserCurd />,
}
```

建议：

- 页面入口优先使用目录下的 `index.tsx`，路由中写 `@/views/UserCurd`。
- 页面私有子组件放进当前页面目录的 `components/`，例如 `src/views/UserCurd/components/UserFormModal/index.tsx`。
- 子路由较多时，按业务模块建立目录。
- 不要把复杂页面逻辑写进路由文件，路由只做配置。

## 组件目录规范

标准 React 组件统一使用目录式结构：

```text
ComponentName/
├── index.tsx          # 组件入口
├── index.module.less  # 组件私有样式
└── components/        # 当前组件的私有子组件；没有子组件时不要创建
```

使用建议：

- 公共组件放在 `src/components/ComponentName`。
- 页面私有组件放在 `src/views/PageName/components/ComponentName`。
- layout 私有组件放在 `src/layout/components/ComponentName`。
- 组件对外只暴露目录入口，导入时写 `@/components/Access` 或 `./components/UserFormModal`。
- 组件样式优先写在本组件自己的 `index.module.less`，不要依赖父组件样式。
- 组件内部继续拆分时，才创建当前组件的 `components/`，不要平铺到父级目录。
- 没有子组件时不创建空的 `components/`，目录保持轻量。

当前示例：

- `src/components/SearchTableForm`
- `src/components/Access`
- `src/components/PublicBreadcrumb`
- `src/layout/components/Nav`
- `src/views/UserCurd/components/UserFormModal`

## 页面开发推荐写法

后台页面建议按“查询区 + 操作区 + 列表区 + 弹窗/抽屉”的方式组织。

推荐结构：

```tsx
return (
  <>
    <Card size="small">
      <SearchTableForm />
    </Card>

    <Card size="small">
      <div className={styles.optionsHeader}>
        <Button type="primary">新增</Button>
      </div>
      <Table />
    </Card>

    <UserFormModal ref={userFormModalRef} />
  </>
);
```

建议：

- 查询表单使用 `SearchTableForm`。
- 列表数据使用 `useBasePageTable` 管理分页、loading、查询参数和刷新。
- 新增/编辑弹窗放在页面自己的 `components/` 目录，并使用 `ref.open(config) + onEvent`。
- 查询参数提交前要清理空值，避免把 `undefined`、`null`、空字符串传给接口。
- 页面内样式使用 `index.module.less`，不要使用远程 CSS 工具类。
- 操作按钮放在列表 Card 的顶部或单独 Card 中，保持页面层级清晰。

## 请求层规范

请求统一从 `src/http` 引入：

```ts
import { request, mRequest, createHttpClient } from "@/http";
```

兼容旧路径：

```ts
import { request } from "@/http/request";
import { mRequest } from "@/http/mRequest";
```

当前约定：

- `createHttpClient(options)` 用于创建统一配置的 axios 实例。
- 默认 `baseURL` 读取 `VITE_API_BASE_URL`，默认 `timeout` 为 `15000`。
- 请求拦截器只保留认证扩展点，默认不强制注入 token 或 cookie。
- 响应默认返回 `response.data`，业务页面不需要再手动拆 axios response。
- `401` 提示登录失效，`403` 提示无权限，`500` 提示服务器异常，其他错误展示接口返回的 `message/msg/error`。
- `mRequest` 保留 mock/业务状态提示：当返回值 `status === 0` 且 `data` 是字符串时自动 `message.error`。

建议：

- 业务页面不要直接 `Axios.create()`，优先复用 `request` / `mRequest`。
- 新增特殊服务端地址时，用 `createHttpClient({ baseURL })` 创建实例。
- 登录态可能是 cookie、Bearer token、自定义 header 或签名参数，模板不预设方案。
- 接入认证时集中改 `prepareRequestConfig` 或传入 axios options，例如 cookie 场景可按项目需要配置 `withCredentials`。

## SearchTableForm 使用

`SearchTableForm` 位于 `src/components/SearchTableForm`，适合后台列表页的查询区。

支持字段类型：

- `input`
- `inputNumber`
- `select`
- `selectAsync`
- `date`
- `dateRange`
- `cascader`
- `numberRange`
- `selectRange`
- `custom`

基础示例：

```tsx
const fields: FormFieldConfig[] = [
  {
    name: "name",
    label: "姓名",
    type: "input",
    placeholder: "请输入姓名",
  },
  {
    name: "age",
    label: "年龄",
    type: "inputNumber",
    placeholder: "请输入年龄",
  },
];

<SearchTableForm
  fields={fields}
  value={searchParams}
  onFinish={(values) => setSearchParams(normalizeSearchParams(values))}
  onReset={() => setSearchParams({})}
  enableFieldSetting
  fieldSettingCacheKey="user-search-fields"
/>;
```

字段选择建议：

- 查询字段超过 4 个时可以开启 `enableFieldSetting`。
- `fieldSettingCacheKey` 要按页面唯一命名，避免不同页面互相覆盖。
- 必须展示的字段放进 `disabledHideFields`。

## 全局状态管理

项目使用 `e-boxes` 做轻量状态管理。它的特点是写法接近普通对象，适合后台模板里这些小而明确的全局状态：用户信息、布局开关、权限列表、运行时配置等。

当前状态文件：

- `src/store/index.ts`：通用示例状态，目前包含 `store.userId`。
- `src/store/sys.ts`：系统级状态，目前包含 `layoutStore` 和 `accessStore`。
- `src/layout/layoutConfig.ts`：布局配置状态，如顶部高度、侧栏宽度、折叠状态、内容区 padding。

### e-boxes 基础用法

定义状态：

```ts
import eBox from "e-boxes";

export const userStore = eBox({
  userId: 1,
  userName: "admin",
});
```

在组件中使用：

```tsx
import { userStore } from "@/store";

export default function UserInfo() {
  const { userId, userName } = userStore;

  return (
    <div>
      <span>{userId}</span>
      <span>{userName}</span>
    </div>
  );
}
```

更新状态：

```tsx
userStore.userName = "new-admin";
```

批量更新：

```tsx
userStore.set({
  userId: 2,
  userName: "operator",
});
```

在 store 上挂方法：

```ts
export const counterStore = eBox({
  count: 0,
  add() {
    counterStore.count += 1;
  },
});
```

组件中调用：

```tsx
export default function Counter() {
  const { count, add } = counterStore;

  return (
    <>
      <div>{count}</div>
      <button onClick={add}>添加</button>
    </>
  );
}
```

重要约定：

- UI 中要展示的状态，建议在组件顶层解构，例如 `const { count } = counterStore`。
- 事件里可以直接写 `counterStore.count += 1` 或调用 store 上的方法。
- 批量更新用 `store.set({ ... })`，比连续多次赋值更清晰。
- 非 UI 方法里如果只是读取当前值，可以使用 `store.$` 或 `store.get()` 获取原始状态快照。
- store 适合放全局共享且变化频率不高的状态，不适合替代所有局部 `useState`。

项目示例：

```tsx
const state = eBox({
  count: 0,
});

export default function EBoxUse() {
  const { count } = state;

  return (
    <Card>
      <div>用eBoxes进行局部状态管理</div>
      <div>num:{count}</div>
      <Button onClick={() => state.count++}>添加</Button>
    </Card>
  );
}
```

推荐放进 e-boxes 的状态：

- 登录用户基础信息。
- 权限列表。
- 布局开关。
- 主题、语言、页面偏好等低频全局配置。

不推荐放进 e-boxes 的状态：

- 表单输入过程中的每个字段。
- 弹窗内部的临时状态。
- 高频动画状态。
- 只在一个组件内部使用的普通局部状态。

### layoutStore

`layoutStore` 用于控制整体布局展示：

```ts
export const layoutStore = eBox({
  sideNavHide: false,
  topNavHide: false,
});
```

适用场景：

- 登录页、全屏页、嵌入页需要隐藏侧栏或顶栏。
- 某些页面需要临时切换为无导航模式。

建议：

- 页面进入时修改布局状态，页面离开时恢复默认值。
- 不要在业务组件深层随意修改布局，最好集中在页面入口处理。
- 如果页面只是不想出现在菜单里，用路由的 `hideMenu`，不要改 `layoutStore`。

### accessStore

`accessStore` 用于保存权限列表：

```ts
export const accessStore = eBox<any>({ list: [] });
```

适用场景：

- 登录后保存用户权限。
- 路由守卫或菜单渲染时判断 `access`。
- 页面按钮权限判断。

建议：

- 权限字段保持稳定，例如统一使用 `admin`、`user:create`、`user:delete` 这类可读 key。
- 菜单级权限放路由配置，按钮级权限在页面内部判断。
- 不要把权限判断散落成大量字符串判断，统一使用 `hasAccess`、`useAccess` 或 `Access` 组件。

### 按钮级权限

按钮权限和路由权限共用 `accessStore.list`。路由配置里的 `access` 仍负责页面是否可进入；页面内部按钮、操作列、批量操作等使用按钮级权限。

工具函数：

```ts
import { hasAccess } from "@/.utils/access";

const canCreate = hasAccess("user:create");
const canUseAny = hasAccess(["admin", "user:create"]);
```

Hook：

```tsx
import { useAccess } from "@/hooks/useAccess";

export default function Toolbar() {
  const canCreate = useAccess("user:create");

  return <Button disabled={!canCreate}>新增</Button>;
}
```

组件：

```tsx
import Access from "@/components/Access";

<Access code="user:create">
  <Button type="primary">新增</Button>
</Access>;

<Access code="user:delete" fallback={<Button disabled>无权限</Button>}>
  <Button danger>删除</Button>
</Access>;

<Access code="user:delete" mode="disabled">
  <Button danger>删除</Button>
</Access>;
```

使用建议：

- 单个按钮是否展示，用 `Access`。
- 操作列里需要计算多个按钮状态，用 `useAccess`。
- 非 React 逻辑或路由工具里，用 `hasAccess`。
- `mode="hidden"` 是默认行为；需要保留按钮位置时使用 `mode="disabled"`。

### layoutConfig

`layoutConfig` 是布局参数状态：

```ts
export const layoutConfig = eBox({
  NAV_NAME: "mas-cms",
  navHeight: 50,
  navPadding: 16,
  sideNavWidth: 200,
  collapsed: false,
  bodyPadding: {
    top: 16,
    left: 16,
  },
});
```

适用场景：

- 控制侧栏折叠。
- 统一顶部导航高度。
- 配置后台整体最小宽度，避免窗口过窄时布局被压变形。
- 统一主内容区 padding。

建议：

- 主内容区间距继续遵守 8px / 16px 规范。
- `boxMinWidth` 用于整个后台的最小宽度，推荐按业务表格复杂度配置，常见值是 `1200` 或 `1360`。
- 不要在业务页面里覆盖整体布局尺寸。
- 如果要新增布局配置，优先放进 `layoutConfig`，不要散落在多个组件常量里。

### localStore 工具

`src/utils/localStore.ts` 提供了基于 `localStorage` 的加密存储封装：

- `localStoreSet`
- `localStoreGet`
- `localStoreHas`
- `localStoreGetAll`
- `localStoreDel`

适用场景：

- 登录 token。
- 用户偏好。
- 需要跨刷新保留的轻量配置。

注意：

- 它会写入统一的 `masStore`。
- 适合少量本地状态，不适合存大对象或高频变化数据。
- 读取失败会抛错，使用时要注意异常处理或清缓存提示。

## Hooks 用法场景

项目里主要有两份表格相关 hooks：

- `src/hooks/openDobuleTableHooks.ts`
- `src/hooks/useTableHooks.ts`

当前用户管理示例使用的是 `openDobuleTableHooks.ts`。两份文件能力相近，`useTableHooks.ts` 额外包含 `useAddRowAtEnd`，并对部分派生值做了 `useMemo` 优化。如果新页面没有特别原因，建议统一使用 `openDobuleTableHooks.ts`，后续可以再合并成一份标准 hooks。

### useRefState

`useRefState` 位于 `src/hooks/useRefState.ts`。

它适合解决“React state 在当前闭包里还是旧值，但异步回调又需要立即拿到最新值”的问题。

返回值：

```ts
const [state, setState, stateRef] = useRefState(0);
```

- `state`：正常 React state，参与渲染。
- `setState`：用法和 React 原生 `setState` 一致，支持值更新和函数式更新。
- `stateRef`：只读 ref，`stateRef.current` 可以即时拿到最新状态。

示例：

```tsx
const [count, setCount, countRef] = useRefState(0);

const handleClick = () => {
  setCount(1);

  console.log(count); // 当前闭包里仍然是旧值
  console.log(countRef.current); // 1
};
```

函数式更新：

```tsx
setCount((prev) => prev + 1);
console.log(countRef.current); // 立即拿到更新后的值
```

适用场景：

- `setTimeout` / `setInterval`。
- DOM 事件监听。
- `ResizeObserver` / `MutationObserver` 回调。
- 请求回调中需要读取最新状态。
- 需要避免闭包旧值，但又希望状态仍然触发 React 渲染。

注意：

- 通过 `setState` 更新时会同步写入 `stateRef.current`。
- `stateRef` 是只读类型，不建议也不应该通过 `stateRef.current = xxx` 反向改状态。
- 如果某个值完全不需要触发渲染，直接用 `useRef` 即可，不需要 `useRefState`。

### useDomChange

`useDomChange` 位于 `src/hooks/useDomChange.ts`。

它是一个底层通用 hook，用来监听页面和 DOM 变化，并返回变化版本号。

监听来源：

- `window.resize`
- `window.orientationchange`
- 捕获阶段滚动事件
- `ResizeObserver`
- `MutationObserver`

基础用法：

```tsx
const cardRef = useRef<HTMLDivElement>(null);
const { version, refresh } = useDomChange([cardRef]);
```

适用场景：

- 页面尺寸变化后重新测量布局。
- 某个节点内容变化后重新计算高度。
- 上层测量类 hook 的基础能力。

注意：

- 它不关心业务，不计算距离，也不处理表格。
- 传入的 refs 应尽量稳定，避免每次 render 都创建新的数组。
- 如果只是手动触发一次重新计算，可以调用 `refresh()`。

### useElementBottomDistance

`useElementBottomDistance` 位于 `src/hooks/useElementBottomDistance.ts`。

它内部调用 `useDomChange`，用于计算指定节点底部到浏览器底部的距离：

```ts
window.innerHeight - element.getBoundingClientRect().bottom
```

基础用法：

```tsx
const searchCardRef = useRef<HTMLDivElement>(null);

const { distance, rect, refresh, version } = useElementBottomDistance(searchCardRef);
```

返回值：

- `distance`：节点底部到浏览器底部的距离。
- `rect`：当前节点的位置信息。
- `refresh`：手动重新测量。
- `version`：DOM 变化版本号。

适用场景：

- 根据筛选区高度计算列表剩余高度。
- 弹窗、抽屉、面板变化后重新计算可用空间。
- 根据真实 DOM 位置做自适应布局，而不是写死 `calc(100vh - xxx)`。

用户管理页中的使用方式：

```tsx
const { distance: searchCardBottomDistance } =
  useElementBottomDistance(searchCardRef, {
    extraRefs: [tableCardRef, optionsHeaderRef],
  });
```

然后页面用这个距离扣除操作区、表头、分页器、Card padding 等高度，得到 `Table` 的 `scroll.y`，让数据只在表格内部滚动，主区域不产生滚动条。

### useStoredState

`useStoredState` 是表格 hooks 内部使用的存储型 state，目前没有对外 export。它的作用是把某个 state 同步到 `localStorage`，刷新页面后可以恢复上次值。

当前主要用于 `useBasePageTable` 的 `pageSize` 缓存：

```ts
const [defaultPageSize, setDefaultPageSize] = useStoredState(
  options.cachePageSizeKey || "_useBasePageTable_defaultPageSize",
  options.defaultPageSize || 20,
);
```

适用场景：

- 记住用户上次选择的表格 pageSize。
- 记住查询字段选择顺序。
- 记住某个页面的轻量偏好。

不适用场景：

- 服务端权威数据。
- 复杂表单草稿。
- 高频变化的输入值。
- 多页面共享的大型状态。

注意：

- `key` 必须稳定且页面唯一，避免不同页面互相覆盖。
- 当前存储格式是 `{ value }`，不要直接假设 localStorage 里就是原始值。
- 如果要开放给业务使用，建议把它移动到独立 hooks 文件，例如 `src/hooks/useStoredState.ts`，并补充类型和测试。

### useBasePageTable

适用场景：

- 普通后台分页列表。
- 查询条件变化时回到第一页。
- 切换 pageSize 时重新请求。
- 新增、编辑、删除后刷新列表。
- 希望缓存 pageSize。

核心职责：

- 管理 `pageNum`、`pageSize`、`total`。
- 管理 `searchParams`。
- 管理 `tableData`。
- 管理 `loading`。
- 提供 `reloadTable`。
- 内置请求防抖和请求标识，避免旧请求覆盖新结果。

示例：

```tsx
const {
  pageNum,
  setPageNum,
  pageSize,
  setPageSize,
  total,
  searchParams,
  setSearchParams,
  tableData,
  loading,
  reloadTable,
} = useBasePageTable<User, UserSearchParams>({
  defaultPageSize: 10,
  cachePageSizeKey: "user-page-size",
  getTableData: async ({ pageNum, pageSize, searchParams }) => {
    const res = await getUserList({
      pageNum,
      pageSize,
      ...searchParams,
    });

    return {
      data: res.data.list,
      total: res.data.total,
      pageNum: res.data.pageNum,
      pageSize: res.data.pageSize,
    };
  },
});
```

配合 Table：

```tsx
<Table
  rowKey="id"
  dataSource={tableData}
  loading={loading}
  pagination={{
    current: pageNum,
    pageSize,
    total,
    showSizeChanger: true,
  }}
  onChange={(pagination) => {
    if (pagination.current) setPageNum(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  }}
/>
```

### useReloadDataById

适用场景：

- 表格行很多，只想刷新某几行。
- 行内编辑保存后，需要重新拉取当前行最新数据。
- 状态切换后，只更新被操作的行，不刷新整页。

注意：

- 需要提供 `getTableDataById`。
- 需要传入 `setTableData` 和主键字段 `idName`。
- 如果接口本身返回列表顺序不稳定，建议直接用 `reloadTable` 全量刷新。

### useTableChecked

适用场景：

- 自定义多选列。
- 批量删除、批量复制、批量提交。
- 不想依赖 antd Table 的 `rowSelection`，希望选中态跟业务数据放在一起。

返回值包括：

- `toggleChecked`
- `changeChecked`
- `handleSelectAll`
- `checkedIds`
- `checkedItems`
- `isAllChecked`
- `checkedCount`
- `isIndeterminate`

建议：

- 主键字段统一传 `idName`，例如 `"id"`。
- 批量操作后及时清理 `_checked` 或刷新数据。
- 如果只是普通 Table 多选，可以优先使用 antd 的 `rowSelection`；如果选中态要参与复杂业务，再使用这个 hook。

### useGetIndexById

适用场景：

- 根据 id 找到当前表格数据里的索引。
- 复制、局部更新、定位行时使用。

它内部使用 ref 保存最新 `tableData`，避免回调拿到旧闭包。

### useCopyDataByIds

适用场景：

- 批量复制当前表格行。
- 新复制的数据先放在前端临时编辑，保存时再提交。

注意：

- 复制时会生成新的临时 id。
- 适合“前端临时行”场景；如果业务要求复制后立即落库，应调用后端复制接口，再刷新列表。

### useAddRowAtStart

适用场景：

- 在表格顶部插入一条或多条临时行。
- 新增行需要立即出现在第一屏。
- 类 Excel 的可编辑表格。

示例：

```tsx
const addRowAtStart = useAddRowAtStart(setTableData, "id", {
  name: "",
  status: "draft",
});

addRowAtStart(1);
```

### useAddRowAtEnd

`useAddRowAtEnd` 目前在 `useTableHooks.ts` 中。

适用场景：

- 新增行更适合追加到列表末尾。
- 表格顺序有明确的从上到下录入逻辑。

### useDeleteDataByIds

适用场景：

- 前端临时删除表格行。
- 批量删除前先做本地预览。
- mock 或纯前端示例。

注意：

- 它只改前端 `tableData`，不会调用接口。
- 真实业务删除应先调接口，成功后再 `reloadTable` 或本地移除。

## 8px / 16px 间距规范

本模板使用 8px 网格作为间距规范。

核心规则：

- 常规间距使用 `8px`。
- 模块间距、页面 padding 使用 `16px`。
- 大块顶部留白可使用 8 的倍数，例如 `32px`、`64px`、`96px`。
- 避免出现 `5px`、`10px`、`12px`、`15px`、`20px` 这类不在网格上的值。
- 宽度、高度、字号不强制套 8px 网格，但固定格式元素要保持稳定尺寸。

推荐：

```less
.page {
  padding: 16px;
}

.section {
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  gap: 8px;
}
```

不推荐：

```less
.page {
  padding: 15px;
}

.section {
  margin-bottom: 20px;
}
```

页面结构建议：

- 主内容区域 padding：`16px`。
- Card 与 Card 之间：`16px`。
- Card 内按钮组间距：`8px`。
- 表单项之间：`8px` 或由 antd 默认密度控制。
- 面包屑、工具栏等紧凑区域：`8px 16px`。

## 样式规范

样式统一使用 Less，不再引入远程 CSS 工具库。

推荐写法：

- 页面样式使用 `index.module.less`。
- 公共组件使用同名 `*.module.less`。
- 全局基础样式写在 `global.less`。
- 主题变量写在 `theme.less`。
- 需要覆盖 antd 局部样式时，优先在 CSS Module 内使用 `:global` 限定范围。

示例：

```tsx
import styles from "./index.module.less";

export default function Page() {
  return <div className={styles.page}>...</div>;
}
```

```less
.page {
  padding: 16px;
}

.optionsHeader {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
```

建议：

- 不要使用远程工具类样式。
- 不要在 JSX 里堆大量 class 字符串模拟工具类。
- 不要为了一个页面改全局样式。
- 不要把页面区块做成多层 Card 套 Card。
- 如果只是布局间距，优先写 Less 类名，不要散落大量 inline style。

## CRUD 页面推荐模式

以 `src/views/UserCurd` 为参考。

推荐状态拆分：

- `searchParams`：查询条件，由 `SearchTableForm` 提交。
- `tableData`：表格数据，由 `useBasePageTable` 管理。
- `userFormModalRef`：通过 `ref.current?.open(config)` 打开新增/编辑弹窗。
- `tableScrollY`：表格内容滚动高度，结合主区域可用空间计算。

推荐流程：

1. 查询：表单提交后清理空值，写入 `setSearchParams`。
2. 列表：`useBasePageTable` 监听查询参数、分页参数并请求数据。
3. 新增：调用 `userFormModalRef.current?.open({ mode: "add", onEvent })`，保存成功后 `reloadTable`。
4. 编辑：调用 `userFormModalRef.current?.open({ mode: "edit", initialValues: record, onEvent })`，保存成功后 `reloadTable`。
5. 删除：使用 `Modal.confirm` 二次确认，成功后 `reloadTable`。

清理查询参数示例：

```ts
const normalizeSearchParams = (values: FormValues) => {
  return Object.entries(values).reduce<Record<string, unknown>>((params, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      return { ...params, [key]: value };
    }
    return params;
  }, {});
};
```

### 弹窗推荐写法

业务弹窗优先按 `.agent/skills/react-modal-creator` 的模式实现。弹窗组件不接收 props，由组件内部维护可见状态、表单状态和提交 loading；页面只持有 ref，并通过 `open(config): void` 传入标题、初始值和事件回调。

用户管理页的 `src/views/UserCurd/components/UserFormModal/index.tsx` 是当前示例：

- 弹窗组件使用 `forwardRef<UserFormModalRef, {}>`，不声明业务 props。
- `UserFormModalRef` 必须包含带 JSDoc 的 `open(config): void` 方法。
- `open` 不返回 Promise，弹窗结果统一通过 `config.onEvent` 通知页面。
- 函数类配置存入 state 时使用 `Fn` 后缀，比如 `onEventFn`。
- 弹窗内点击确定、取消、关闭时分别发出 `success`、`cancel`、`closed` 事件。
- 页面负责接口副作用：新增、编辑成功后提示并调用 `reloadTable`。

页面调用示例：

```tsx
const userFormModalRef = useRef<UserFormModalRef | null>(null);

const openEditModal = (record: Student) => {
  userFormModalRef.current?.open({
    mode: "edit",
    title: "编辑用户",
    okText: "保存",
    initialValues: record,
    onEvent: handleUserFormEvent,
  });
};

const handleUserFormEvent = async (event: UserFormModalEvent) => {
  if (event.type !== "success") return;

  const res =
    event.mode === "add"
      ? await addStudentHttp(event.values)
      : await setStudentHttp({
          ...event.values,
          id: event.values.id as number,
        });

  if (res?.status) {
    message.success(event.mode === "add" ? "添加用户成功！" : "更新成功！");
    reloadTable();
  }
};

<UserFormModal ref={userFormModalRef} />;
```

这种写法适合新增/编辑共用表单、选择器弹窗、复杂配置弹窗和带中间操作的弹窗。页面不需要维护 `modalOpen`、`modalMode`、`editingRecord`、`saving` 这一组临时状态，弹窗也不会被页面 props 绑死，复用和迁移会更轻。

## 开发建议

- 新页面优先从 `UserCurd` 复制结构，再替换字段、接口和列配置。
- 表格页不要手写重复的分页 loading 状态，优先用 `useBasePageTable`。
- 搜索字段不要和接口参数强耦合，必要时在提交前做一次格式转换。
- mock 数据要返回过滤后的 `total`，否则分页显示会不准确。
- 路由、页面、组件、hooks 分层保持清晰。
- 新弹窗优先使用 `ref.open(config) + onEvent`，页面只处理接口、刷新和反馈。
- 页面内操作反馈使用 `message`，危险操作使用 `Modal.confirm`。
- 长列表或复杂表单优先保持密度克制，后台不是营销页。
- 构建前至少跑一次 `npx tsc --noEmit` 和 `npm run build`。

## 脚本说明

| 命令 | 说明 |
| --- | --- |
| `npm run start` | 启动 dev 环境开发服务器 |
| `npm run start:pro` | 使用 pro 环境启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run build:dev` | dev 环境构建 |
| `npm run preview` | 预览构建产物 |
| `npm run lint` | ESLint 检查 |

## License

见 [LICENSE](./LICENSE) 文件。
