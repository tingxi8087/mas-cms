# MAS-CMS

基于 React + Vite + Ant Design 的内容管理后台前端项目。

## 技术栈

- **框架**: React 18
- **构建**: Vite 5
- **语言**: TypeScript
- **UI**: Ant Design 5、Ant Design Pro Components、Pro Layout
- **路由**: React Router 6（Hash 模式）
- **样式**: Less
- **请求**: Axios
- **其他**: e-boxes、mas-encrypt、react-quill（富文本）

## 环境要求

- Node.js 18+
- 推荐使用 [Bun](https://bun.sh/) 或 npm/cnpm 安装依赖

## 快速开始

### 安装依赖

```bash
# 使用 bun
bun install

# 或使用 cnpm
cnpm install
```

### 开发

```bash
# 开发环境（.env.dev）
bun run start
# 或
npm run start

# 生产模式配置下的开发（.env.pro）
bun run start:pro
```

### 构建

```bash
# 生产构建
bun run build
# 或
npm run build

# 开发环境配置构建
bun run build:dev
```

### 预览构建产物

```bash
bun run preview
# 或
npm run preview
```

## 项目结构

```
src/
├── .utils/          # 路由渲染、权限包装等工具
├── assets/          # 静态资源
├── components/      # 公共组件（如富文本编辑器、面包屑）
├── http/            # 请求封装
├── layout/          # 布局（侧栏、顶栏、个人菜单等）
├── mock/            # 本地 mock
├── router/          # 路由配置与守卫
├── store/           # 状态管理
├── theme.less       # 主题变量
├── typings/         # 类型声明
├── utils/           # 通用工具
└── views/           # 页面视图
    ├── Login/       # 登录
    ├── index/       # 首页
    ├── UserCurd/    # 用户 CRUD 示例
    ├── EBoxUse/     # eBoxes 使用示例
    ├── AccessPage/  # 权限示例页
    ├── NoLayout/    # 无布局页
    ├── 403.tsx      # 无权限
    └── 404.tsx      # 未找到
```

## 功能概览

- **布局**: 可折叠侧栏 + 顶栏，基于 e-boxes 配置（`layoutConfig`）
- **路由**: Hash 路由，支持菜单配置（label、path、icon、hideMenu、access）
- **权限**: 通过 `access` 控制菜单与页面访问（如 `admin`）
- **示例**: 用户管理 CRUD、权限页、eBoxes 使用、无布局页、403/404

## 配置说明

- **开发环境**: 使用 `.env.dev`，运行 `start` 或 `build:dev`
- **生产环境**: 使用 `.env.pro`，运行 `start:pro` 或 `build`
- **路径别名**: `@` 指向 `src/`
- **构建输出**: `base: "./"`，适用于相对路径部署

## 脚本说明

| 命令           | 说明                     |
|----------------|--------------------------|
| `start`       | 开发服务器（dev 环境）   |
| `start:pro`   | 开发服务器（pro 环境）   |
| `build`       | 生产构建                 |
| `build:dev`   | 开发配置构建             |
| `preview`     | 预览构建结果             |
| `lint`        | ESLint 检查              |

## License

见 [LICENSE](./LICENSE) 文件。
