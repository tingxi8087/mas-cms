import { layoutConfig } from "@/layout/layoutConfig";
import { setSideNavHide, setTopNavHide } from "@/utils/setLayout";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function Login() {
  const { NAV_NAME } = layoutConfig;
  const [loading, setLoading] = useState(false);
  setSideNavHide();
  setTopNavHide();

  const onFinish = (values: any) => {
    console.log("登录信息:", values);
    // 这里处理登录逻辑
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <div className="flex flex-col flex-y-c mt-1x">
        <h1 className="mb-2"> {NAV_NAME}</h1>
        <Card className="w-4x">
          <Form name="login" onFinish={onFinish} autoComplete="off">
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
