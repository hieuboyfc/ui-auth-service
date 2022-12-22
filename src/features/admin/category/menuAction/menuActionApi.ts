import { URL_API } from 'utils';
import axiosClient from 'utils/axiosClient';
import { MenuActionById, MenuActionModel } from './menuActionModel';

const menuActionApi = {
  getMenuActionAllByGroup(params: MenuActionById): Promise<MenuActionModel> {
    const url = URL_API.concat('/v1/menu-action/menu-action-all-by-group');
    return axiosClient.get(url, { params });
  },
};

export default menuActionApi;
