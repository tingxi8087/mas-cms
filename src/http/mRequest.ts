import { message, notification } from "antd";
import Axios from "axios";
import { isString } from "lodash";
const axios = Axios.create();

// axios.defaults.baseURL = "http://localhost:6900";
axios.interceptors.response.use(
  (res) => {
    if (res?.data?.status === 0) {
      isString(res?.data?.data) && message.error(res?.data?.data);
    }
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
export const mRequest = axios;
