import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY, COOKIE_API_KEY, URL_API } from './constants';

// https://stackoverflow.com/questions/69417883/axios-post-request-with-typescript-issue

const headers: Readonly<Record<string, string | number | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  cookieApiKey: COOKIE_API_KEY,
  Authorization: `${String(Cookies.get(ACCESS_TOKEN_KEY))}` || '',
};

// We can use the following function to inject the JWT token through an interceptor
// We get the `accessToken` from the localStorage that we set when we authenticate
const injectToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
  try {
    const token = `${String(Cookies.get(ACCESS_TOKEN_KEY))}`;
    if (token != null) {
      // https://stackoverflow.com/questions/70085215/how-to-fix-config-headers-authorization-object-is-possibly-undefined-when-usin
      config.headers = config.headers ?? {};
      // Now config.headers can be safely used
      config.headers.Authorization = `${token}` || '';
    }
    return config;
  } catch (error: any) {
    throw new Error(error);
  }
};

class AxiosCustom {
  private instance: AxiosInstance | null = null;

  private get axiosCustom(): AxiosInstance {
    return this.instance != null ? this.instance : this.initAxiosCustom();
  }

  initAxiosCustom() {
    const axiosCustom = axios.create({
      baseURL: URL_API,
      headers: { ...headers },
    });

    axiosCustom.interceptors.request.use(injectToken, (error) => Promise.reject(error));

    axiosCustom.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    );

    this.instance = axiosCustom;
    return axiosCustom;
  }

  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.axiosCustom.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.axiosCustom.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.axiosCustom.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.axiosCustom.put<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.axiosCustom.delete<T, R>(url, config);
  }
}

export const axiosCustom = new AxiosCustom();

//------------------------------------------------------------------------------------------------

// https://stackoverflow.com/questions/43051291/attach-authorization-header-for-all-axios-requests
export const axiosRequest = (token: any) => {
  const defaultOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      cookieApiKey: COOKIE_API_KEY,
      Authorization: `${String(Cookies.get(ACCESS_TOKEN_KEY))}` || token,
    },
  };

  return {
    get: (url: string, options = {}) => axios.get(url, { ...defaultOptions, ...options }),
    post: (url: string, data: any, options = {}) =>
      axios.post(url, data, { ...defaultOptions, ...options }),
    put: (url: string, data: any, options = {}) =>
      axios.put(url, data, { ...defaultOptions, ...options }),
    delete: (url: string, options = {}) => axios.delete(url, { ...defaultOptions, ...options }),
  };
};

//------------------------------------------------------------------------------------------------

// Default config options
const defaultOptions = {
  baseURL: URL_API,
  headers: {
    ...headers,
  },
};

// Create instance
const axiosClient = axios.create(defaultOptions);

axiosClient.defaults.headers.common.Authorization = `${String(Cookies.get(ACCESS_TOKEN_KEY))}`;
axiosClient.defaults.headers.Authorization = `${String(Cookies.get(ACCESS_TOKEN_KEY))}`;

// Add a request interceptor
axiosClient.interceptors.request.use(injectToken, (error) =>
  // Do something with request error
  Promise.reject(error),
);

// Add a request interceptor
// axiosClient.interceptors.request.use(
//   (config: AxiosRequestConfig) =>
//     // Do something before request is sent
//     config,
//   (error) =>
//     // Do something with request error
//     Promise.reject(error),
// );

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) =>
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    response.data,
  (error) =>
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    Promise.reject(error),
);

export default axiosClient;
