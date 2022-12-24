export interface GroupModel {
  key?: React.Key;
  id?: number;
  groupCodeOld?: string;
  groupCode: string;
  appCode: string;
  name: string;
  status: number;
}

export interface GroupById {
  groupCode?: string;
  appCode?: string;
}

export interface GroupParams {
  page: number;
  size: number;
  sort: string;
  groupCode: string | null;
  name: string | null;
  status: number;
}
