import { Result } from "antd";

const Page404 = () => {
  return (
    <div className="flex flex-x-c flex-y-c w-100-pct">
      <Result status="404" title="404" subTitle="对不起，您访问的页面不存在" />
    </div>
  );
};
export default Page404;
