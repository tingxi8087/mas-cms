import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Form, message } from "antd";
import { useRef, useState } from "react";
import AddModal from "./AddModal";
import SetModal from "./SetModal";
import { delStudentHttp, getStudentHttp } from "../../mock/mock";

const UserCurd = () => {
  const [editShowModal, setEditShowModal] = useState(false);
  const [addShowModal, setAddShowModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [editformRef] = Form.useForm();
  const [addformRef] = Form.useForm();

  // 表格节点
  const actionRef = useRef();
  //刷新表格
  const reloadTable = () => (actionRef?.current as any)?.reload();
  // 表格请求事件
  const tableRequest = async (params: {
    pageSize?: number;
    current?: number;
    [key: string]: any;
  }) => {
    const reqParams = { pageNum: params.current, ...params };
    const res = await getStudentHttp(reqParams);
    return {
      data: res.data.list,
      success: res.status,
      total: res.data.total,
    };
  };
  //编辑按钮
  const handleEdit = (item: any) => {
    setEditFormData(item);
    setEditShowModal(true);
  };
  //删除按钮
  const handleDelete = async (item: any) => {
    const res = await delStudentHttp(item.id);
    if (res?.status) {
      message.success("删除成功！");
    }
    reloadTable();
  };
  // 添加按钮
  const handleAdd = () => {
    setAddShowModal(true);
  };
  const columns: ProColumns<any>[] = [
    {
      title: "用户id",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "姓名",
      dataIndex: "name",
      align: "center",
    },
    {
      search: false,
      title: "年龄",
      dataIndex: "age",
      align: "center",
    },
    {
      title: "描述",
      dataIndex: "des",
      align: "center",
    },
    {
      search: false,
      title: "爱好",
      dataIndex: "like",
      align: "center",
    },
    {
      search: false,
      title: "操作",
      align: "center",
      dataIndex: "options",
      width: 180,
      render: (_, item) => (
        <>
          <Button type="link" onClick={() => handleEdit(item)}>
            编辑
          </Button>
          <Button danger type="link" onClick={() => handleDelete(item)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <AddModal
        addShowModal={addShowModal}
        setAddShowModal={setAddShowModal}
        reloadTable={reloadTable}
        addformRef={addformRef}
      />
      <SetModal
        editformRef={editformRef}
        editShowModal={editShowModal}
        setEditShowModal={setEditShowModal}
        reloadTable={reloadTable}
        editFormData={editFormData}
      />
      <ProTable
        className="mb-1"
        columns={columns}
        actionRef={actionRef}
        request={tableRequest as any}
        rowKey="id"
        pagination={{
          pageSizeOptions: [5, 10, 20],
          showSizeChanger: true,
          defaultPageSize: 5,
        }}
        toolBarRender={() => [
          <Button onClick={handleAdd} type="primary">
            添加用户
          </Button>,
        ]}
        dateFormatter="string"
        headerTitle="用户管理"
      />
    </>
  );
};
export default UserCurd;
