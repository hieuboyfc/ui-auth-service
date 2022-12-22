import { createAsyncThunk } from '@reduxjs/toolkit';
import menuActionApi from './menuActionApi';
import { MenuActionById } from './menuActionModel';

export const getMenuActionAllByGroup = createAsyncThunk(
  'menuAction/getMenuActionAllByGroup',
  async (params: MenuActionById, thunkAPI) => {
    try {
      const response = await menuActionApi.getMenuActionAllByGroup(params);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
