import { routerAccessData } from "../router/index";
import {
  Location,
  Navigate,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { accessStore } from "@/store/sys";
import { useEffect, useState } from "react";
import { beforePageChange } from "@/router/routerGuard";
import { Spin } from "antd";
export const aceessControll = (location: Location) => {
  const accessName = routerAccessData[location.pathname];
  if (!accessName) return true;
  if (accessName && accessStore.list.includes(accessName)) {
    return true;
  } else {
    return false;
  }
};
export const aceessValid = (location: Location, navigate: NavigateFunction) => {
  if (!aceessControll(location) && location.pathname != "/403") {
    navigate("/403");
    return false;
  }
  return true;
};
export const wrapRoutesWithAuth = (routes: any) => {
  return routes.map((route: any) => {
    if (route.element) {
      const WithAuth = (props: any) => {
        const navigate = useNavigate();
        const location = useLocation();
        const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
          null
        );
        const [toPath, setToPath] = useState("/login");
        const verifyAuth = async () => {
          const auth = await beforePageChange(navigate, location);
          if (typeof auth == "string") {
            setToPath(auth);
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(auth);
          }
        };
        useEffect(() => {
          verifyAuth();
        }, []);
        if (isAuthenticated === null) {
          return (
            <div className="rel" style={{ height: "calc(100vh - 85px)" }}>
              <div className="h-3 abs flex left-50-pct top-50-pct translate--50-pct flex flex-col flex-x-c flex-y-c">
                <Spin size="large" />
              </div>
            </div>
          );
        }
        if (!isAuthenticated && toPath != location.pathname) {
          return <Navigate to={toPath} />;
        }
        return <>{props.children}</>;
      };
      route.element = <WithAuth>{route.element}</WithAuth>;
    }
    if (route.children) {
      route.children = wrapRoutesWithAuth(route.children);
    }
    return route;
  });
};
