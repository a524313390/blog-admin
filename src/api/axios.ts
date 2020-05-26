import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Message, Loading } from "element-ui";

import router from "../router/index";
// 请求拦截
let loading: any;

axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "/api" : "";
function startLoading() {
  //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: "加载中..."
  });
}

function endLoading() {
  //使用Element loading-close 方法
  loading.close();
}
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    startLoading();
    // 请求前的拦截 设置统一的headers
    if (localStorage.getItem("user_token")) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
    } else {
      if (window.location.pathname != "/login") {
        router.push("/login");
      }
    }

    return config;
  },
  (err: any) => {
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    endLoading();
    return response;
  },
  (error: any) => {
    //关闭加载
    endLoading();
    if (error.response) {
      console.log(error.response);
      //弹出错误信息

      Message.error(error.response.data);
      //如果是401和404的话就跳转登陆页面
      if (
        error.response.status == 401 ||
        error.response.status == 403 ||
        error.response.status == 404
      ) {
        //清除token信息
        localStorage.removeItem("user_token");
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
    return Promise.reject(error.response.data);
  }
);
// 相应拦截

export default axios;
