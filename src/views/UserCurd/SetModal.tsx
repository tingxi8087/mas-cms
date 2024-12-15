import { Modal, Input, Form, FormInstance, message } from "antd";
import { useEffect } from "react";
import { setStudentHttp } from "../../mock/mock";

export default function SetModal({
  editShowModal,
  setEditShowModal,
  reloadTable,
  editFormData,
  editformRef,
}: {
  editShowModal: boolean;
  setEditShowModal: (v: boolean) => void;
  reloadTable: () => void;
  editformRef: FormInstance<any>;
  editFormData: any;
}) {
  const handleSet = () => {
    editformRef.validateFields().then(async () => {
      const formValue = editformRef.getFieldsValue();
      const reqData = { ...editFormData, ...formValue };
      const res = await setStudentHttp(reqData);
      if (res?.status) {
        message.success("更新成功！");
        setEditShowModal(false);
      }
      reloadTable();
    });
  };
  useEffect(() => {
    if (editShowModal) {
      editformRef.setFieldsValue(editFormData);
    }
  }, [editShowModal]);
  return (
    <div>
      <Modal
        title="编辑用户"
        open={editShowModal}
        onCancel={() => setEditShowModal(false)}
        onOk={handleSet}
      >
        <Form
          className="mt-2"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          form={editformRef}
          name="control-hooks"
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="des" label="描述" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="like" label="爱好" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
