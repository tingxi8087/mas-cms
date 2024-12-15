import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router-dom";

const PersonMenu: React.FC = () => {
  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "退出登录",
      onClick: () => {
        navigate("/login", { replace: true });
      },
    },
  ];
  return (
    <div className="mr-1 pointer h-1mx flex flex-y-c">
      <Dropdown menu={{ items }} placement="bottom">
        <Space>
          <Avatar
            style={{ backgroundColor: "#1677ff" }}
            icon={<UserOutlined />}
          />
          admin
        </Space>
      </Dropdown>
    </div>
  );
};

export default PersonMenu;
