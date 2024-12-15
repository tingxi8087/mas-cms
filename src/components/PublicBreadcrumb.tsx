import React, { useEffect, useState } from "react";
import { Breadcrumb, Card } from "antd";
import { getMenuRouter } from "@/.utils/routerRender";
import { RouterIndex } from "@/router";
import { useLocation, useNavigate } from "react-router-dom";
function findLabels(data: any, path: any) {
  const labels: any[] = [];
  function traverse(nodes: any, path: string | any[]) {
    for (const node of nodes) {
      if (node.key.split("/").pop() === path[0]) {
        labels.push({ title: node.label, key: path[0] });
        if (node.children && path.length > 1) {
          traverse(node.children, path.slice(1));
        }
        break;
      }
    }
  }
  traverse(data, path);
  return labels;
}
function flattenMenu(menu: any[]): any[] {
  let result: any[] = [];

  menu.forEach((item) => {
    result.push({ key: item.key, label: item.label });
    if (item.children) {
      result = result.concat(flattenMenu(item.children));
    }
  });

  return result;
}
const PublicBreadcrumb: React.FC = () => {
  const [breadcrumbList, setBreadcrumbList] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const list = getMenuRouter(RouterIndex, true);
    const fList = flattenMenu(list);
    const labelObj = fList.find((item) => item.key === location.pathname);
    const routePath = location.pathname.split("/").filter(Boolean);
    let nBreadcrumbList = [];
    if (labelObj) {
      const labelArr: any[] = [];
      let pathCount = "";
      routePath.forEach((item) => {
        pathCount += `/${item}`;
        const s = fList.find((jtem) => jtem.key === pathCount);
        s && labelArr.push({ key: item, title: s.label });
      });

      nBreadcrumbList = labelArr;
    } else {
      nBreadcrumbList = findLabels(list, routePath);
    }
    setBreadcrumbList(
      nBreadcrumbList?.map((item, index) => ({
        key: item.key,
        title: (
          <a
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/${nBreadcrumbList
                  ?.map((item) => item.key)
                  .slice(0, index + 1)
                  .join("/")}`
              );
            }}
            style={{
              color: index == nBreadcrumbList.length - 1 ? "#000" : undefined,
            }}
          >
            {item.title}
          </a>
        ),
      }))
    );
  }, [location]);

  return (
    <div className="bg-fff">
      <Breadcrumb className={`pt-2m px-1 pb-1m`} items={breadcrumbList} />
    </div>
  );
};

export default PublicBreadcrumb;
