import { AppstoreOutlined, HomeOutlined, CodeOutlined, BarChartOutlined, DatabaseOutlined, SafetyOutlined, LayoutOutlined } from "@ant-design/icons";
import { Navigate, createHashRouter } from "react-router-dom";
import { wrapRoutesWithAuth } from "@/.utils/access";
import { getReactRouter, useLayout } from "@/.utils/routerRender";
import Index from "@/views/index";
import UserCurd from "@/views/UserCurd";
import NoLayout from "@/views/NoLayout";
import ChartExamples from "@/views/ChartExamples";
import EBoxUse from "@/views/EBoxUse";
import AccessPage from "@/views/AccessPage";
import Login from "@/views/Login";
import Page403 from "@/views/403";
import Page404 from "@/views/404";

// import { HashRouter } from "react-router-dom";
const Router: MasRouter = [
  {
    hideMenu: true,
    path: "/",
    element: <Navigate to={"/index"} />,
  },

  {
    label: "首页",
    icon: <HomeOutlined aria-hidden />,
    path: "/index",
    element: <Index />,
    access: "admin",
  },
  {
    label: "组件示例",
    icon: <AppstoreOutlined aria-hidden />,
    path: "/curd",
    children: [
      {
        path: "/curd",
        element: <Navigate to={"/curd/users"} />,
        hideMenu: true,
      },
      {
        label: "用户管理",
        path: "/curd/users",
        icon: <AppstoreOutlined aria-hidden />,
        element: <UserCurd />,
      },
      { path: "/charts", label: "图表展示", icon: <BarChartOutlined aria-hidden />, element: <ChartExamples /> },
    ],
  },

  {
    path: "/development", label: "开发示例", icon: <CodeOutlined aria-hidden />,
    children: [
      { path: "/development", element: <Navigate to="/eBoxUse" replace />, hideMenu: true },
      { path: "/eBoxUse", label: "状态管理", icon: <DatabaseOutlined aria-hidden />, element: <EBoxUse /> },
      { path: "/accessPage", label: "权限控制", icon: <SafetyOutlined aria-hidden />, access: "admin", element: <AccessPage /> },
      { path: "/noLayout", label: "独立布局", icon: <LayoutOutlined aria-hidden />, element: <NoLayout /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    hideMenu: true,
  },
  {
    path: "/403",
    element: <Page403 />,
    hideMenu: true,
  },
  {
    path: "*",
    element: <Page404 />,
    hideMenu: true,
  },
];

const { reactRouter, accessArr } = getReactRouter(
  useLayout(wrapRoutesWithAuth(Router))
);
// eslint-disable-next-line react-refresh/only-export-components
export const router = createHashRouter(reactRouter);
// eslint-disable-next-line react-refresh/only-export-components
export const routerAccessData = accessArr;
export const RouterIndex = Router;
