import { Login } from 'models/login';
import axiosClient from './axiosClient';

const authApi = {
  login(data: Login): Promise<Login> {
    const url = '/api/auth/signin?appCode=Auth-Service';
    return axiosClient.post(url, data);
  },
};

export default authApi;
