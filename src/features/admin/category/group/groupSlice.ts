import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListResponse } from 'models/common';
import { SIZE_OF_PAGE } from 'utils';
import { GroupModel } from './groupModel';
import { fetchGroup } from './groupService';

export interface GroupState {
  loading: boolean;
  error: string;
  groups: ListResponse<GroupModel>;
}

const initialState: GroupState = {
  loading: false,
  error: '',
  groups: {
    data: [],
    last: false,
    page: 0,
    size: SIZE_OF_PAGE,
    totalElements: 0,
    totalPages: 0,
  },
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchGroup.pending, (state: any, action: any) => {
        state.loading = true;
      })
      .addCase(
        fetchGroup.fulfilled,
        (state: any, action: PayloadAction<ListResponse<GroupModel>>) => {
          state.loading = false;
          state.groups = action.payload;
        },
      )
      .addCase(fetchGroup.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Action
export const groupActions = groupSlice.actions;

// Selectors
export const selectIsLoading = (state: any) => state.group.loading;
export const selectIsError = (state: any) => state.group.error;
export const groupSelector = (state: any) => state.group;

// Reducer
export const groupReducer = groupSlice.reducer;
