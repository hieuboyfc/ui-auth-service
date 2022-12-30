import { ListResponse } from 'models/common';
import { URL_API } from 'utils';
import axiosClient from 'utils/axiosClient';
import { GroupById, GroupMenuActionUpdate, GroupModel, GroupParams } from './groupModel';

const groupApi = {
  fetchGroup(params: GroupParams): Promise<ListResponse<GroupModel>> {
    const url = URL_API.concat('/v1/group/search');
    return axiosClient.get(url, { params });
  },
  insertGroup(payload: GroupModel): Promise<GroupModel> {
    const url = URL_API.concat('/v1/group');
    return axiosClient.post(url, payload);
  },
  updateGroup(payload: GroupModel): Promise<GroupModel> {
    const url = URL_API.concat('/v1/group');
    return axiosClient.put(url, payload);
  },
  deleteGroup(params: GroupById): Promise<GroupModel> {
    const url = URL_API.concat('/v1/group');
    return axiosClient.delete(url, { params });
  },
  getGroup(params: GroupById): Promise<GroupModel> {
    // const url = URL_API.concat(`/v1/group/${id}`);
    const url = URL_API.concat('/v1/group');
    return axiosClient.get(url, { params });
  },
  updateGroupMenuAction(params: GroupMenuActionUpdate): Promise<GroupModel> {
    const url = URL_API.concat('/v1/group/update-group-menu-action');
    return axiosClient.put(url, { params });
  },
};

export default groupApi;
