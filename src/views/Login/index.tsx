import { layoutConfig } from "@/layout/layoutConfig";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import styles from "./index.module.less";

export default function Login() {
  const { NAV_NAME } = layoutConfig;
  const [loading, setLoading] = useState(false);
  const onFinish = (values: any) => {
    console.log("登录信息:", values);
    // 这里处理登录逻辑
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.brandPanel}>
          <div className={styles.brandMark}>{NAV_NAME.slice(0, 1).toUpperCase()}</div>
          <div>
            <div className={styles.brandName}>{NAV_NAME}</div>
            <div className={styles.brandLine}>Content Management Console</div>
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>登录工作台</h1>
            <p className={styles.subTitle}>使用你的账号进入管理后台</p>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            className={styles.form}
          >
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
        </section>
      </div>
    </div>
  );
}
