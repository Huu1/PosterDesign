// import { TOKEN } from '@/config/app';
const TOKEN='APP'

export const setItem = (key: string, value: any) => {
  localStorage.setItem(key, value);
};
export const getItem = (key: string): any => {
  return localStorage.getItem(key);
};
export const delItem = (key: string): any => {
  return localStorage.removeItem(key);
};

export const getToken = () => {
  return getItem(TOKEN);
};
export const setToken = (token: string) => {
  return setItem(TOKEN, token);
};
export const removeToken = () => {
  return delItem(TOKEN);
};
