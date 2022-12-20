import { createAsyncThunk } from '@reduxjs/toolkit';
import groupApi from './groupApi';
import { GroupById, GroupModel, GroupParams } from './groupModel';

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

export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (payload: GroupModel, thunkAPI) => {
    try {
      const response = await groupApi.createGroup(payload);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getGroup = createAsyncThunk('group/getGroup', async (params: GroupById, thunkAPI) => {
  try {
    const response = await groupApi.getGroup(params);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});