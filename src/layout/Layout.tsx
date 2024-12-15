import style from "./index.module.less";
import Nav from "./Nav";
import Side from "./Side";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { layoutStore } from "@/store/sys";
import { layoutConfig } from "./layoutConfig";
import { useEffect } from "react";
import PublicBreadcrumb from "@/components/PublicBreadcrumb";

export default function Layout() {
  // const location = useLocation();
  // const params = useParams();
  // const navigate = useNavigate();
  document.title = layoutConfig.NAV_NAME;
  const navHeight = layoutConfig.navHeight;
  const sideNavWidth = layoutConfig.sideNavWidth;
  const collapsed = layoutConfig.collapsed;
  useEffect(() => {
    const collapsedEvent = () => {
      // layoutConfig.collapsed = window.innerWidth < layoutConfig.boxMinWidth;
      if (document.documentElement.offsetWidth < 1100) {
        layoutConfig.collapsed = true;
      } else {
        layoutConfig.collapsed = false;
      }
    };
    collapsedEvent();
    window.addEventListener("resize", collapsedEvent);
    return () => {
      window.removeEventListener("resize", collapsedEvent);
    };
  }, []);

  return (
    <div
      className={style.wrapper}
      style={{
        paddingTop: layoutStore.topNavHide ? 0 : navHeight,
        minWidth: layoutConfig.boxMinWidth,
      }}
    >
      {!layoutStore.sideNavHide && <Side />}
      {!layoutStore.topNavHide && <Nav />}

      <div className={style.body}>
        {!layoutStore.sideNavHide && (
          <div
            className={style.sideWrapper}
            style={{ width: collapsed ? 45 : sideNavWidth }}
          ></div>
        )}
        <div className={style.bodyMain}>
          <div>
            {!layoutStore.topNavHide && <PublicBreadcrumb />}
          </div>
          <div
            style={{
              marginTop: layoutConfig.bodyPadding.top,
              marginLeft: layoutConfig.bodyPadding.left,
              marginRight: layoutConfig.bodyPadding.left,
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
