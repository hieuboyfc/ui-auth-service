export interface MenuActionModel {
  key?: number;
  id?: number;
  menuCode?: string;
  appCode?: string;
  name?: string;
  url?: string;
  parentCode?: string;
  description?: string;
  orderNo?: number;
  type?: number;
  status?: number;
}

export interface MenuActionById {
  menuCode?: string;
  appCode?: string;
}

export interface MenuActionParams {
  page: number;
  size: number;
  sort: string;
  menuCode?: string | null;
  name?: string | null;
  status?: number;
}
