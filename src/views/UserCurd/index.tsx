import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useMemo, useState } from "react";
import styles from "./index.module.less";
import SearchTableForm, {
  FormFieldConfig,
  FormValues,
} from "@/components/SearchTableForm";
import { useBasePageTable } from "@/hooks/openDobuleTableHooks";
import {
  addStudentHttp,
  delStudentHttp,
  getStudentHttp,
  setStudentHttp,
} from "@/mock/mock";

type Student = {
  id: number;
  name: string;
  age: number;
  des: string;
  like: string;
};

type StudentSearchParams = Partial<
  Pick<Student, "id" | "name" | "age" | "des" | "like">
>;

type ModalMode = "add" | "edit";

const normalizeSearchParams = (values: FormValues): StudentSearchParams => {
  return Object.entries(values).reduce<StudentSearchParams>(
    (params, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        return { ...params, [key]: value };
      }
      return params;
    },
    {},
  );
};

const UserCurd = () => {
  const [form] = Form.useForm<Student>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editingRecord, setEditingRecord] = useState<Student>();
  const [saving, setSaving] = useState(false);

  const searchFields = useMemo<FormFieldConfig[]>(
    () => [
      {
        name: "id",
        label: "用户id",
        type: "inputNumber",
        placeholder: "请输入用户id",
      },
      {
        name: "name",
        label: "姓名",
        type: "input",
        placeholder: "请输入姓名",
      },
      {
        name: "age",
        label: "年龄",
        type: "inputNumber",
        placeholder: "请输入年龄",
      },
      {
        name: "des",
        label: "描述",
        type: "input",
        placeholder: "请输入描述",
      },
      {
        name: "like",
        label: "爱好",
        type: "input",
        placeholder: "请输入爱好",
      },
    ],
    [],
  );

  const {
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    searchParams,
    setSearchParams,
    tableData,
    loading,
    reloadTable,
  } = useBasePageTable<Student, StudentSearchParams>({
    defaultPageSize: 5,
    cachePageSizeKey: "user-curd-page-size",
    getTableData: async ({ pageNum, pageSize, searchParams }) => {
      const res = await getStudentHttp({
        pageNum,
        pageSize,
        ...searchParams,
      });

      return {
        data: res.data.list,
        total: res.data.total,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
      };
    },
  });

  const openAddModal = () => {
    setModalMode("add");
    setEditingRecord(undefined);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: Student) => {
    setModalMode("edit");
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(undefined);
    form.resetFields();
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const res =
        modalMode === "add"
          ? await addStudentHttp(values)
          : await setStudentHttp({
              ...editingRecord,
              ...values,
              id: editingRecord?.id || values.id,
            });

      if (res?.status) {
        message.success(modalMode === "add" ? "添加学生成功！" : "更新成功！");
        closeModal();
        reloadTable();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (record: Student) => {
    Modal.confirm({
      title: "确认删除该用户？",
      content: `用户：${record.name}`,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        const res = await delStudentHttp(record.id);
        if (res?.status) {
          message.success("删除成功！");
          reloadTable();
        }
      },
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setPageNum(pagination.current);
    }
    if (pagination.pageSize) {
      setPageSize(pagination.pageSize);
    }
  };

  const columns: ColumnsType<Student> = [
    {
      title: "用户id",
      dataIndex: "id",
      align: "center",
      width: 100,
    },
    {
      title: "姓名",
      dataIndex: "name",
      align: "center",
      width: 120,
    },
    {
      title: "年龄",
      dataIndex: "age",
      align: "center",
      width: 100,
    },
    {
      title: "描述",
      dataIndex: "des",
      align: "center",
    },
    {
      title: "爱好",
      dataIndex: "like",
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "options",
      align: "center",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card size="small" style={{ marginBottom: 12 }}>
        <SearchTableForm
          fields={searchFields}
          value={searchParams}
          onFinish={(values) => setSearchParams(normalizeSearchParams(values))}
          onReset={() => setSearchParams({})}
          enableFieldSetting
          fieldSettingCacheKey="user-curd-search-fields"
        />
      </Card>

      <Card size="small">
        <div className={styles.optionsHeader}>
          <Button type="primary" onClick={openAddModal}>
            添加用户
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tableData}
          loading={loading}
          size="small"
          pagination={{
            current: pageNum,
            pageSize,
            total,
            pageSizeOptions: [5, 10, 20],
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={modalMode === "add" ? "添加用户" : "编辑用户"}
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleSave}
        confirmLoading={saving}
        destroyOnClose
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
    </div>
  );
};

export default UserCurd;
