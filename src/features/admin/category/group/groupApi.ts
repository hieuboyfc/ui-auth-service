import { URL_API } from 'shared';
import axiosClient from 'shared/axiosClient';
import { GroupParams } from './groupModel';

const groupApi = {
  fetchGroup(params: GroupParams) {
    const url = URL_API.concat('/v1/group/search');
    return axiosClient.get(url, { params });
  },
};

export default groupApi;
