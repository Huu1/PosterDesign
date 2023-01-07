/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import { getToken, removeToken } from './localStorage';

axios.defaults.baseURL = '';

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      removeToken();
      break;
    // 404请求不存在
    case 404:
      break;
    default:
  }
};

// 创建axios实例
const request = axios.create({ timeout: 1000 * 12 });
// 设置post请求头
request.defaults.headers.post['Content-Type'] = 'application/json';
// request.defaults.headers['Authorization'] =
//   'Client-ID WIvdiAkLuUIUydljVOzESjiUmIJgLQvESRpIQaoR76I';

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.token = token;
    }
    return config;
  },
  (error) => console.error(error)
);

// 响应拦截器
request.interceptors.response.use(
  // 请求成功
  (res) => {
    return [200, 201].includes(res.status)
      ? Promise.resolve(res.data)
      : Promise.reject(res);
  },
  // 请求失败
  // eslint-disable-next-line consistent-return
  (error) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在200, 201的范围
      errorHandle(response.status);
      return Promise.reject(response);
    }
    if (!window.navigator.onLine) {
      console.log('无连接');
    } else {
      return Promise.reject(error);
    }
  }
);

export default request;
