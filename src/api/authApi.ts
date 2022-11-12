import { Login } from 'models/login';
import axiosClient from './axiosClient';

export const baseURL = 'http://localhost:8088';

const authApi = {
  login(data: Login) {
    const url = baseURL.concat('/api/auth/signin?appCode=Auth-Service');
    return axiosClient.post(url, data);
    //return axiosClient('').post(url, data);
  },

  getMenuActionByCurrentUser() {
    const url = baseURL.concat('/v1/menu-action/menu-action-by-current-user');
    return axiosClient.get(url);
    //return axiosCustom.get<Menu>(url);
    //return axiosRequest('').get(url);
  },
};

export default authApi;
