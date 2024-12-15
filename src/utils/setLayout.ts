import { layoutStore } from "@/store/sys";
import { useEffect } from "react";
export const setSideNavHide = () =>
  useEffect(() => {
    layoutStore.sideNavHide = true;
    return () => {
      layoutStore.sideNavHide = false;
    };
  }, []);
export const setTopNavHide = () =>
  useEffect(() => {
    layoutStore.topNavHide = true;
    return () => {
      layoutStore.topNavHide = false;
    };
  }, []);
