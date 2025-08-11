import style from "./index.module.less";
import Nav from "./Nav";
import Side from "./Side";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { layoutStore } from "@/store/sys";
import { layoutConfig } from "./layoutConfig";
import { useEffect } from "react";
import PublicBreadcrumb from "@/components/PublicBreadcrumb";

export default function Layout() {
  const { sideNavHide, topNavHide } = layoutStore;
  const {
    NAV_NAME,
    sideNavWidth,
    navHeight,
    collapsed,
    boxMinWidth,
    bodyPadding,
  } = layoutConfig;
  // const location = useLocation();
  // const params = useParams();
  // const navigate = useNavigate();
  document.title = NAV_NAME;

  useEffect(() => {
    const collapsedEvent = () => {
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
  const isFreePage = sideNavHide && topNavHide;
  console.log(isFreePage, "isFreePage", sideNavHide, topNavHide);

  return (
    <div
      className={style.wrapper}
      style={{
        paddingTop: topNavHide ? 0 : navHeight,
        minWidth: boxMinWidth,
      }}
    >
      {!sideNavHide && <Side />}
      {!topNavHide && <Nav />}

      <div className={style.body}>
        {!sideNavHide && (
          <div
            className={style.sideWrapper}
            style={{ width: collapsed ? 45 : sideNavWidth }}
          ></div>
        )}
        <div className={style.bodyMain}>
          <div>{!topNavHide && <PublicBreadcrumb />}</div>
          <div
            style={{
              marginTop: isFreePage ? 0 : bodyPadding.top,
              marginLeft: isFreePage ? 0 : bodyPadding.left,
              marginRight: isFreePage ? 0 : bodyPadding.left,
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
