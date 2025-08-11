import { accessStore } from "@/store/sys";
import { NavigateFunction, Location } from "react-router-dom";
import { hideSideNav, hideTopNav } from "./routerUtils";
export async function befroeCreated() {
  // await sleep(1000);
  accessStore.list = ["admin"];
}
/**
 * 页面跳转前
 * @param navigate 跳转函数
 * @param location 跳转路径
 * @returns 为string时，跳转路径，为boolean时，是否跳转，默认跳转/login
 */
export const beforePageChange: (
  navigate: NavigateFunction,
  location: Location<any>
) => Promise<string | boolean> = async (navigate, location) => {
  hideSideNav(["/noLayout", "/login"], location);
  hideTopNav(["/noLayout", "/login"], location);
  const { aceessValid } = await import("@/.utils/access");
  aceessValid(location, navigate);
  // await sleep(1000);
  return true;
};
