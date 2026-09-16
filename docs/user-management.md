# 用户管理示例

入口为 `/#/curd/users`，沿用现有布局和本地内存 Mock。刷新页面后恢复初始数据；此处角色、账号状态仅用于演示用户资料，不改变管理后台当前登录身份和权限。

## 查询和表格

查询复用 `SearchTableForm`：姓名、账号、状态、部门、角色多选、注册日期范围、年龄范围和用户 ID。默认收起，支持展开、字段显隐与排序，配置沿用 `user-curd-search-fields` 缓存。部门通过 `custom` 组合 Ant Design TreeSelect，日期和数字范围使用已有包装组件，不新增查询框架。

不同条件之间取交集，多个角色匹配任一所选角色，日期及年龄范围包含两端。清空或重置后恢复全量查询。表格复用 `useBasePageTable` 和 `useTableChecked`，选中态来自行上的 `_checked`，查询、翻页、刷新和批量操作后清空选择。

表格展示头像、姓名、账号、部门、角色、状态、年龄、联系方式、注册日期与描述。点击姓名打开详情抽屉；行内可编辑、切换状态或确认删除，工具栏可批量启用／停用。表头和分页保持可见，宽表通过横向滚动查看。

## 添加与编辑

继续通过 `UserFormModal` 的 ref 调用 `open(config)`，参数包括 `mode`、`initialValues`、标题、按钮文字和 `onEvent`。只有调用方保存成功才关闭弹窗；失败提示错误并保留输入。

表单以基础资料、组织与状态、个人偏好分组，展示 Input、InputNumber、Radio、TreeSelect、Select、DatePicker、Upload、Switch、Checkbox 和 TextArea。姓名、账号、年龄、手机号、邮箱、部门和角色必填；账号格式与唯一性、联系方式格式有校验。

头像使用 FileReader 做本地预览，仅支持 2 MB 以内的 PNG/JPG，不发送上传请求。生日、爱好、头像和描述可清空。日期转为字符串传给 Mock，列表返回数据副本，UI 选中字段不会写回 Mock。

## 代码入口与验证

- 页面：`src/views/UserCurd/index.tsx`
- 弹窗：`src/views/UserCurd/components/UserFormModal`
- 详情：`src/views/UserCurd/components/UserDetailDrawer`
- 类型、选项：`src/mock/userModel.ts`
- Mock：`src/mock/mock.ts`，保留原 CRUD 函数名，增加批量状态函数。
- 单测：`tests/users.test.ts`，覆盖组合过滤、数据隔离、唯一性、状态更新和页码校正。
- 浏览器：`tests/e2e/examples.spec.ts`，覆盖查询、编辑、新增校验、头像预览、详情、批量操作、删除、字段设置和屏幕适配。
