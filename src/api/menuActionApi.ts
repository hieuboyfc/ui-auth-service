
import { URL_API } from 'utils';
import axiosClient from '../utils/axiosClient';

const menuActionApi = {
  getMenuActionByCurrentUser() {
    const url = URL_API.concat('/v1/menu-action/menu-action-by-current-user');
    return axiosClient.get(url);
    //return axiosCustom.get<Menu>(url);
    //return axiosRequest('').get(url);
  },
};

export default menuActionApi;
