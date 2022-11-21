import { createAsyncThunk } from '@reduxjs/toolkit';
import groupApi from './groupApi';
import { GroupParams } from './groupModel';

// ACTION - SERVICE
export const fetchGroup = createAsyncThunk(
  'group/fetchGroup',
  async (params: GroupParams, thunkAPI) => {
    try {
      console.log('thunkAPI: ', thunkAPI);
      console.log('data: ', params);
      const response = await groupApi.fetchGroup(params);
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
