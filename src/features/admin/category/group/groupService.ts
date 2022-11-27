import { createAsyncThunk } from '@reduxjs/toolkit';
import groupApi from './groupApi';
import { GroupParams } from './groupModel';

// ACTION - SERVICE
export const fetchGroup = createAsyncThunk(
  'group/fetchGroup',
  async (params: GroupParams, thunkAPI) => {
    try {
      const response = await groupApi.fetchGroup(params);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
