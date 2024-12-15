import { layoutConfig } from "@/layout/layoutConfig";
import { setSideNavHide, setTopNavHide } from "@/utils/setLayout";
import { useEffect } from "react";

export default function NoLayout() {
  setSideNavHide();
  setTopNavHide();

  return <div>没有布局的页面</div>;
}
