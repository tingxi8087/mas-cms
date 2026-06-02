import style from "./index.module.less";
import { layoutConfig } from "./layoutConfig";
import PersonMenu from "./PersonMenu";

export default function Nav() {
  return (
    <div className={style.nav} style={{ height: layoutConfig.navHeight }}>
      <div className={style.brand}>
        <span className={style.brandMark}>
          {layoutConfig.NAV_NAME.slice(0, 1).toUpperCase()}
        </span>
        <span className={style.brandText}>{layoutConfig.NAV_NAME}</span>
      </div>
      <div>
        <PersonMenu />
      </div>
    </div>
  );
}
