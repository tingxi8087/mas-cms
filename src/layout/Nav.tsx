import style from "./index.module.less";
import { layoutConfig } from "./layoutConfig";
import PersonMenu from "./PersonMenu";

export default function Nav() {
  return (
    <div className={style.nav} style={{ height: layoutConfig.navHeight }}>
      {layoutConfig.NAV_NAME}
      <div>
        <PersonMenu />
      </div>
    </div>
  );
}
