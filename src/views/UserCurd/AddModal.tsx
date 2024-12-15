import { Form, FormInstance, Input, Modal, message } from "antd";
import { addStudentHttp } from "../../mock/mock";

export default function AddModal({
  addShowModal,
  setAddShowModal,
  reloadTable,
  addformRef,
}: {
  addShowModal: boolean;
  setAddShowModal: (v: boolean) => void;
  reloadTable: () => void;
  addformRef: FormInstance<any>;
}) {
  const handleAddUsers = () => {
    addformRef.validateFields().then(async () => {
      const formValue = addformRef.getFieldsValue();
      const res = await addStudentHttp(formValue);
      if (res?.status) {
        message.success("添加学生成功！");
        setAddShowModal(false);
      }
      reloadTable();
    });
  };
  return (
    <Modal
      title="添加用户"
      open={addShowModal}
      onCancel={() => setAddShowModal(false)}
      onOk={handleAddUsers}
    >
      <Form
        className="mt-2"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        form={addformRef}
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
  );
}
