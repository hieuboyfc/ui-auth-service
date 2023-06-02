import { URL_API } from 'utils';
import axiosClient from 'utils/axiosClient';
import { GroupById } from '../group/groupModel';
import {
  MenuActionById,
  MenuActionModel,
  MenuActionParams,
  MenuActionTree,
} from './menuActionModel';

const menuActionApi = {
  getMenuActionByCurrentUser() {
    const url = URL_API.concat('/v1/menu-action/menu-action-by-current-user');
    return axiosClient.get(url);
  },
  getMenuActionAllByCurrentUser() {
    const url = URL_API.concat('/v1/menu-action/menu-action-all-by-current-user');
    return axiosClient.get(url);
  },
  fetchMenuAction(params: MenuActionParams): Promise<MenuActionModel[]> {
    const url = URL_API.concat('/v1/menu-action/load-data');
    return axiosClient.get(url, { params });
  },
  insertMenuAction(payload: MenuActionModel): Promise<MenuActionModel> {
    const url = URL_API.concat('/v1/menu-action');
    return axiosClient.post(url, payload);
  },
  updateMenuAction(payload: MenuActionModel): Promise<MenuActionModel> {
    const url = URL_API.concat('/v1/menu-action');
    return axiosClient.put(url, payload);
  },
  deleteMenuAction(params: MenuActionById): Promise<MenuActionModel> {
    const url = URL_API.concat('/v1/menu-action');
    return axiosClient.delete(url, { params });
  },
  getMenuAction(params: MenuActionById): Promise<MenuActionModel> {
    const url = URL_API.concat('/v1/menu-action');
    return axiosClient.get(url, { params });
  },
  getMenuActionAllByGroup(params: GroupById): Promise<MenuActionTree> {
    const url = URL_API.concat('/v1/menu-action/menu-action-all-by-group');
    return axiosClient.get(url, { params });
  },
};

export default menuActionApi;
