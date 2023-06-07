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
  orderNum?: string;
  type?: number;
  status?: number;
  children?: MenuActionModel[];
  totalRecord?: number;
}

export interface MenuActionTree {
  children?: MenuActionTree[] | undefined;
  key?: string;
  value?: string;
  title?: string;
}

export interface MenuActionById {
  menuCode?: string;
  appCode?: string;
}

export interface MenuActionParams {
  status?: number;
  appCode?: string;
}
