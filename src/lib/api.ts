import * as axios from "axios";
import apiFacade from "./apiFacade";

const api = {
  get: async <T>(url: string, config?: axios.AxiosRequestConfig) => {
    return await apiFacade.get<T>(url, config);
  },

  post: async <T>(
    url: string,
    data: object,
    config?: axios.AxiosRequestConfig,
  ) => {
    return await apiFacade.post<T>(url, data, config);
  },

  put: async <T>(
    url: string,
    data: object,
    config?: axios.AxiosRequestConfig,
  ) => {
    return await apiFacade.put<T>(url, data, config);
  },

  delete: async <T>(url: string, config?: axios.AxiosRequestConfig) => {
    return await apiFacade.delete<T>(url, config);
  },
};

export default api;
