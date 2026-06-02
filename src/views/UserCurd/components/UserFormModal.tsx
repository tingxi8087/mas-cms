import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Form, Input, InputNumber, Modal } from "antd";

import styles from "./UserFormModal.module.less";

export type UserFormModalMode = "add" | "edit";

export type UserFormValues = {
  id?: number;
  name: string;
  age: number;
  des: string;
  like: string;
};

export type UserFormModalEvent =
  | {
      type: "success";
      mode: UserFormModalMode;
      values: UserFormValues;
      initialValues?: Partial<UserFormValues>;
    }
  | { type: "cancel"; mode: UserFormModalMode }
  | { type: "closed"; mode: UserFormModalMode };

export interface UserFormModalConfig {
  mode: UserFormModalMode;
  title?: string;
  okText?: string;
  cancelText?: string;
  initialValues?: Partial<UserFormValues>;
  /** 弹窗事件回调；state 存为 onEventFn */
  onEvent?: (event: UserFormModalEvent) => void | Promise<void>;
}

/**
 * 用户表单弹窗 Ref，通过 open 传入配置；弹窗事件经 onEvent 回调传出
 */
export interface UserFormModalRef {
  /**
   * 打开用户表单弹窗
   * @param config - 弹窗模式、标题、初始值和事件回调
   */
  open(config: UserFormModalConfig): void;
}

const noop = () => {};

const UserFormModal = forwardRef<UserFormModalRef, {}>(
  function UserFormModal(_, ref) {
    const [form] = Form.useForm<UserFormValues>();
    const [visible, setVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<UserFormModalMode>("add");
    const [title, setTitle] = useState("添加用户");
    const [okText, setOkText] = useState("确定");
    const [cancelText, setCancelText] = useState("取消");
    const [initialValues, setInitialValues] =
      useState<Partial<UserFormValues>>();
    const [onEventFn, setOnEventFn] = useState<
      (event: UserFormModalEvent) => void | Promise<void>
    >(() => noop);

    const open: UserFormModalRef["open"] = (config) => {
      const nextInitialValues = config.initialValues || {};

      setMode(config.mode);
      setTitle(
        config.title || (config.mode === "add" ? "添加用户" : "编辑用户"),
      );
      setOkText(config.okText || "确定");
      setCancelText(config.cancelText || "取消");
      setInitialValues(nextInitialValues);
      setOnEventFn(() => config.onEvent || noop);
      form.resetFields();
      form.setFieldsValue(nextInitialValues);
      setVisible(true);
    };

    useImperativeHandle(ref, () => ({ open }), []);

    const handleOk = async () => {
      const values = await form.validateFields();
      setSaving(true);
      try {
        await onEventFn({
          type: "success",
          mode,
          values: {
            ...initialValues,
            ...values,
          } as UserFormValues,
          initialValues,
        });
        setVisible(false);
      } finally {
        setSaving(false);
      }
    };

    const handleCancel = async () => {
      await onEventFn({ type: "cancel", mode });
      setVisible(false);
    };

    const handleClosed = async () => {
      await onEventFn({ type: "closed", mode });
      setVisible(false);
    };

    return (
      <Modal
        title={title}
        open={visible}
        onCancel={handleClosed}
        destroyOnClose
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {cancelText}
          </Button>,
          <Button key="ok" type="primary" loading={saving} onClick={handleOk}>
            {okText}
          </Button>,
        ]}
      >
        <Form
          form={form}
          className={styles.modalForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: "请输入年龄" }]}
          >
            <InputNumber controls={false} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="des"
            label="描述"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="like"
            label="爱好"
            rules={[{ required: true, message: "请输入爱好" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);

export default UserFormModal;
