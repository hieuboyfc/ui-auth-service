import { createAsyncThunk } from '@reduxjs/toolkit';
import { GroupById } from '../group/groupModel';
import menuActionApi from './menuActionApi';
import { MenuActionById, MenuActionModel, MenuActionParams } from './menuActionModel';

// ACTION - SERVICE
export const fetchMenuAction = createAsyncThunk(
  'menuAction/fetchMenuAction',
  async (params: MenuActionParams, thunkAPI) => {
    try {
      const response = await menuActionApi.fetchMenuAction(params);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const insertMenuAction = createAsyncThunk(
  'menuAction/insertMenuAction',
  async (payload: MenuActionModel, thunkAPI) => {
    try {
      const response = await menuActionApi.insertMenuAction(payload);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateMenuAction = createAsyncThunk(
  'menuAction/updateMenuAction',
  async (payload: MenuActionModel, thunkAPI) => {
    try {
      const response = await menuActionApi.updateMenuAction(payload);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deleteMenuAction = createAsyncThunk(
  'menuAction/deleteMenuAction',
  async (params: MenuActionById, thunkAPI) => {
    try {
      const response = await menuActionApi.deleteMenuAction(params);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getMenuAction = createAsyncThunk(
  'menuAction/getMenuAction',
  async (params: MenuActionById, thunkAPI) => {
    try {
      const response = await menuActionApi.getMenuAction(params);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const getListMenuCheckedChildren = (children: any): any => {
  const itemsChildren: any = {
    checked: [],
    expanded: [],
  };
  if (children.length > 0) {
    children.forEach((item: any) => {
      itemsChildren.expanded.push(item.key);
      if (item.checked) {
        itemsChildren.checked.push(item.key);
      }
      const dataChildren =
        item.children.length > 0 ? getListMenuCheckedChildren(item.children) : undefined;
      if (dataChildren?.checked !== undefined && dataChildren?.checked !== '') {
        itemsChildren.checked.push(dataChildren.checked);
      }
      if (dataChildren?.expanded !== undefined && dataChildren?.expanded !== '') {
        itemsChildren.expanded.push(dataChildren.expanded);
      }
    });
  }
  if (itemsChildren?.checked.length === 0) {
    itemsChildren.checked = '';
  }
  if (itemsChildren?.expanded.length === 0) {
    itemsChildren.expanded = '';
  }
  return itemsChildren;
};

const getListMenuChecked = (data: any): any => {
  const menu: any = data;
  const items: any = {
    checked: [],
    expanded: [],
  };
  if (menu !== null) {
    menu.forEach((item: any) => {
      items.expanded.push(item.key);
      if (item.checked) {
        items.checked.push(item.key);
      }
      const dataChildren =
        item.children.length > 0 ? getListMenuCheckedChildren(item.children) : undefined;
      if (dataChildren?.checked !== undefined && dataChildren?.checked !== '') {
        items.checked.push(dataChildren.checked);
      }
      if (dataChildren?.expanded !== undefined && dataChildren?.expanded !== '') {
        items.expanded.push(dataChildren.expanded);
      }
    });
  }
  items.checked =
    items?.checked.length > 0 && items?.checked !== '' ? items.checked.toString().split(',') : '';
  items.expanded =
    items?.expanded.length > 0 && items?.expanded !== ''
      ? items.expanded.toString().split(',')
      : '';
  return items;
};

export const getMenuActionAllByGroup = createAsyncThunk(
  'menuAction/getMenuActionAllByGroup',
  async (params: GroupById, thunkAPI) => {
    try {
      const response = await menuActionApi.getMenuActionAllByGroup(params);
      const children: any = response?.children;
      const items = getListMenuChecked(children);
      const result = {
        children,
        items,
      };
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getMenuActionAllByParent = createAsyncThunk(
  'menuAction/getMenuActionAllByParent',
  async (params: MenuActionById, thunkAPI) => {
    try {
      const response = await menuActionApi.getMenuActionAllByParent(params);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
