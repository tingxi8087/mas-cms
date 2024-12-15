import { Button, Card } from "antd";
import eBox from "e-boxes";

const state = eBox({
  count: 0,
});

export default function eBoxUse() {
  return (
    <Card>
      <div>用eBoxes进行局部状态管理</div>
      <div className="font-700">num:{state.count}</div>
      <Button
        onClick={() => {
          state.count++;
        }}
      >
        添加
      </Button>
    </Card>
  );
}
