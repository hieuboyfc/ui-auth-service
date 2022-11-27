import { LoginPayload } from 'features/admin/auth/authModel';
import { URL_API } from 'utils';
import axiosClient from '../utils/axiosClient';

const authApi = {
  login(data: LoginPayload) {
    const url = URL_API.concat('/api/auth/signin?appCode=Auth-Service');
    return axiosClient.post(url, data);
    //return axiosClient('').post(url, data);
  },
};

export default authApi;
