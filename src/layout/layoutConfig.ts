import eBox from "e-boxes";
export const NAV_NAME = "mas-cms";
// 导航左侧标题
export const layoutConfig = eBox({
  NAV_NAME,
  navHeight: 50,
  navPadding: 15,
  sideNavWidth: 200,
  boxMinWidth: 1200,
  collapsed: false,
  bodyPadding: {
    top: 15,
    left: 15,
  },
});
