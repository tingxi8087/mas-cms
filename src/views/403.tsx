import { Result } from "antd";

const Page403 = () => {
  return (
    <div className="flex flex-x-c flex-y-c w-100-pct">
      <Result
        status="403"
        title="403"
        subTitle="对不起，您没有权限访问该页面"
      />
    </div>
  );
};
export default Page403;
