import { Login } from 'models/login';
import axiosClient from '../shared/axiosClient';

export const baseURL = 'http://localhost:8088';

const authApi = {
  login(data: Login) {
    const url = baseURL.concat('/api/auth/signin?appCode=Auth-Service');
    return axiosClient.post(url, data);
    //return axiosClient('').post(url, data);
  },
};

export default authApi;
