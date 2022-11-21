export interface Group {
  id: number;
  groupCode: string;
  appCode: string;
  name: string;
  status: number;
}

export interface GroupParams {
  page: number;
  size: number;
  sort: string;
  groupCode?: string;
  name?: string;
  status: number;
}
