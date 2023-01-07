import React from 'react';

export interface GroupModel {
  key?: React.Key;
  id?: number;
  groupCode: string;
  appCode: string;
  name: string;
  status: number;
}

export interface GroupById {
  groupCode?: string;
  appCode?: string;
  name?: string;
}

export interface GroupMenuActionUpdate {
  appCode?: string;
  groupCode?: string;
  listMenuCode?: string[];
}

export interface GroupParams {
  page: number;
  size: number;
  sort: string;
  groupCode: string | null;
  name: string | null;
  status: number;
}
