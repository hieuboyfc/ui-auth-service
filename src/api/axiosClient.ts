import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// import { API_URL } from './constants';

const axiosClient = axios.create({
  // baseURL: 'http://js-post-api.herokuapp.com/api',
  baseURL: 'http://localhost:8088',
  headers: {
    'Content-Type': 'application/json',
    cookieApiKey: 18001000,
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config: AxiosRequestConfig) =>
    // Do something before request is sent
    config,
  (error) =>
    // Do something with request error
    Promise.reject(error),
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) =>
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    response,
  (error) =>
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    Promise.reject(error),
);

export default axiosClient;
