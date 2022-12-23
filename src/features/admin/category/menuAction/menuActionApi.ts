import { URL_API } from 'utils';
import axiosClient from 'utils/axiosClient';
import { GroupById } from '../group/groupModel';
import { MenuActionTree } from './menuActionModel';

const menuActionApi = {
  getMenuActionAllByGroup(params: GroupById): Promise<MenuActionTree> {
    const url = URL_API.concat('/v1/menu-action/menu-action-all-by-group');
    return axiosClient.get(url, { params });
  },
};

export default menuActionApi;
