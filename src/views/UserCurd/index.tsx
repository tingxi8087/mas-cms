import {
  Button,
  Card,
  Modal,
  Space,
  Table,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.less";
import SearchTableForm, {
  FormFieldConfig,
  FormValues,
} from "@/components/SearchTableForm";
import { useElementBottomDistance } from "@/hooks/useElementBottomDistance";
import { useBasePageTable } from "@/hooks/openDobuleTableHooks";
import {
  addStudentHttp,
  delStudentHttp,
  getStudentHttp,
  setStudentHttp,
} from "@/mock/mock";
import UserFormModal, {
  UserFormModalEvent,
  UserFormModalRef,
} from "./components/UserFormModal";

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

const MIN_TABLE_SCROLL_Y = 80;
const TABLE_SCROLL_OFFSET = 169;

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
  const searchCardRef = useRef<HTMLDivElement>(null);
  const userFormModalRef = useRef<UserFormModalRef | null>(null);
  const [tableScrollY, setTableScrollY] = useState(MIN_TABLE_SCROLL_Y);
  const {
    distance: searchCardBottomDistance,
    version: layoutVersion,
  } = useElementBottomDistance(searchCardRef);

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
    userFormModalRef.current?.open({
      mode: "add",
      title: "添加用户",
      okText: "添加",
      onEvent: handleUserFormEvent,
    });
  };

  const openEditModal = (record: Student) => {
    userFormModalRef.current?.open({
      mode: "edit",
      title: "编辑用户",
      okText: "保存",
      initialValues: record,
      onEvent: handleUserFormEvent,
    });
  };

  const handleUserFormEvent = async (event: UserFormModalEvent) => {
    if (event.type !== "success") {
      return;
    }

    const res =
      event.mode === "add"
        ? await addStudentHttp(event.values)
        : await setStudentHttp({
            ...event.values,
            id: event.values.id as number,
          });

    if (res?.status) {
      message.success(event.mode === "add" ? "添加用户成功！" : "更新成功！");
      reloadTable();
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

  useEffect(() => {
    const nextTableScrollY = searchCardBottomDistance - TABLE_SCROLL_OFFSET;
    setTableScrollY(Math.max(MIN_TABLE_SCROLL_Y, Math.floor(nextTableScrollY)));
  }, [layoutVersion, searchCardBottomDistance]);

  return (
    <div className={styles.page}>
      <div ref={searchCardRef} className={styles.searchCard}>
        <Card size="small">
          <SearchTableForm
            fields={searchFields}
            value={searchParams}
            onFinish={(values) => setSearchParams(normalizeSearchParams(values))}
            onReset={() => setSearchParams({})}
            enableFieldSetting
            fieldSettingCacheKey="user-curd-search-fields"
          />
        </Card>
      </div>

      <Card size="small" className={styles.tableCard}>
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
          scroll={{ y: tableScrollY }}
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

      <UserFormModal ref={userFormModalRef} />
    </div>
  );
};

export default UserCurd;
