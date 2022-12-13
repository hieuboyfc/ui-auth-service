export interface GroupModel {
  key?: number;
  id?: number;
  groupCode: string;
  appCode: string;
  name: string;
  status: number;
}

export interface GroupParams {
  page: number;
  size: number;
  sort: string;
  groupCode: string | null;
  name: string | null;
  status: number;
}
