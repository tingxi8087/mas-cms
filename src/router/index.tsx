import { AppstoreOutlined } from "@ant-design/icons";
import { Navigate, createHashRouter } from "react-router-dom";
import { wrapRoutesWithAuth } from "@/.utils/access";
import { getReactRouter, useLayout } from "@/.utils/routerRender";
import Index from "@/views/index";
import UserCurd from "@/views/UserCurd/UserCurd";
import NoLayout from "@/views/NoLayout/NoLayout";
import EBoxUse from "@/views/EBoxUse/EBoxUse";
import AccessPage from "@/views/AccessPage/AccessPage";
import Login from "@/views/Login/Login";
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
    path: "/index",
    element: <Index />,
    access: "admin",
  },
  {
    label: "简单curd",
    path: "/curd",
    children: [
      {
        path: "/curd",
        element: <Navigate to={"/curd/users"} />,
        hideMenu: true,
      },
      {
        label: "用户管理(示例)",
        path: "/curd/users",
        icon: <AppstoreOutlined />,
        element: <UserCurd />,
      },
    ],
  },

  {
    path: "/eBoxUse",
    label: "eBoxes的使用",
    element: <EBoxUse />,
  },
  {
    path: "/accessPage",
    label: "权限页面",
    access: "admin",
    element: <AccessPage />,
  },
  {
    path: "/login",
    element: <Login />,
    hideMenu: true,
  },
  {
    label: "没有导航栏的页面",
    // hideMenu: true,
    path: "/noLayout",
    element: <NoLayout />,
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
