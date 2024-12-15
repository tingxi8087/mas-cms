import style from "./index.module.less";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuRouter } from "@/.utils/routerRender";
import { RouterIndex } from "@/router";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { layoutConfig } from "./layoutConfig";
import { MenuUnfoldOutlined } from "@ant-design/icons";
// 要自定义菜单改这个就好
const navList: ItemType<MenuItemType>[] | undefined = undefined;
const Side: React.FC = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const location = useLocation();
  const list = navList || getMenuRouter(RouterIndex);
  const navigate = useNavigate();
  const { sideNavWidth, navHeight,collapsed } = layoutConfig;
  const onClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
    setSelected([e.key]);
  };
  const onOpenChange: MenuProps["onOpenChange"] = (e) => {
    setOpenKeys(e);
  };
  useEffect(() => {
    setSelected([location.pathname]);
    // 默认展开
    const OpenKeys = location.pathname.split("/").filter(Boolean);
    OpenKeys.pop();
    const formatOpenKeys = OpenKeys.reduce<string[]>((sum, _, index, arr) => {
      sum.push("/" + arr.slice(0, index + 1).join("/"));
      return sum;
    }, []);
    setOpenKeys([...new Set([...openKeys, ...formatOpenKeys])]);
  }, [location]);

  return (
    <div
      className={style.side}
      style={{ height: `calc(100vh - ${navHeight}px)` }}
    >
      <Menu
        onClick={onClick}
        onOpenChange={onOpenChange}
        style={{
          width: collapsed ? 45 : sideNavWidth,
          minHeight: "calc(100% - 32px)",
        }}
        openKeys={openKeys}
        selectedKeys={selected}
        mode="inline"
        items={list}
        inlineCollapsed={collapsed}
      />
      <div style={{ width: "100%", height: 32 }}></div>
      <div
        className="fixed bottom-0 left-0 right-0 h-32 color-888 font-16px pointer py-1m px-1"
        style={{
          width: collapsed ? 45 : sideNavWidth,
          boxSizing: "border-box",
        }}
      >
        <MenuUnfoldOutlined onClick={() => layoutConfig.collapsed = !collapsed} />
      </div>
    </div>
  );
};

export default Side;
