import { notification } from "antd";
import Axios from "axios";
const axios = Axios.create();
// axios.defaults.baseURL = "http://localhost:6900";
axios.interceptors.response.use(
  (res) => {
    return res?.data;
  },
  (err) => {
    if (!err?.response) {
      notification.error({
        message: "请求失败",
        description: `${err?.config?.url}`,
      });
    } else {
      try {
        notification.error({
          message: "请求失败",
          description: `${err?.config?.url} ${
            err?.response?.status
          } ${JSON.stringify(err?.response?.data)}`,
        });
      } catch (error) {
        notification.error({
          message: "请求失败",
          description: `${err?.config?.url} ${err?.response?.status}`,
        });
      }
    }
  }
);
export const request = axios;
