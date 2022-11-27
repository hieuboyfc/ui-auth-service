import { ListResponse } from 'models/common';
import { URL_API } from 'utils';
import axiosClient from 'utils/axiosClient';
import { GroupModel, GroupParams } from './groupModel';

const groupApi = {
  fetchGroup(params: GroupParams): Promise<ListResponse<GroupModel>> {
    const url = URL_API.concat('/v1/group/search');
    return axiosClient.get(url, { params });
  },
};

export default groupApi;
