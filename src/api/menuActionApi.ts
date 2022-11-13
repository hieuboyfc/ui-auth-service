import axiosClient from '../shared/axiosClient';

export const baseURL = 'http://localhost:8088';

const menuActionApi = {
  getMenuActionByCurrentUser() {
    const url = baseURL.concat('/v1/menu-action/menu-action-by-current-user');
    return axiosClient.get(url);
    //return axiosCustom.get<Menu>(url);
    //return axiosRequest('').get(url);
  },
};

export default menuActionApi;
