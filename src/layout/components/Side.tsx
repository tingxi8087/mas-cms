import style from "../index.module.less";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Button, Menu, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuRouter } from "@/.utils/routerRender";
import { RouterIndex } from "@/router";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { layoutConfig } from "../layoutConfig";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
// 要自定义菜单改这个就好
const navList: ItemType<MenuItemType>[] | undefined = undefined;
const Side: React.FC = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const location = useLocation();
  const list = navList || getMenuRouter(RouterIndex);
  const navigate = useNavigate();
  const { sideNavWidth, collapsed } = layoutConfig;
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
    <div className={style.side}>
      <Menu
        className={style.sideMenu}
        onClick={onClick}
        onOpenChange={onOpenChange}
        style={{
          width: collapsed ? 45 : sideNavWidth,
          flex: 1,
          minHeight: 0,
          overflow: "auto",
        }}
        openKeys={openKeys}
        selectedKeys={selected}
        mode="inline"
        items={list}
        inlineCollapsed={collapsed}
      />
      <div
        className={style.sideFooter}
        style={{
          width: collapsed ? 45 : sideNavWidth,
        }}
      >
        <Tooltip title={collapsed ? "展开菜单" : "收起菜单"}>
          <Button
            type="text"
            className={style.collapseButton}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => (layoutConfig.collapsed = !collapsed)}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Side;
