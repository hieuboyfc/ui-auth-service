import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListResponse } from 'models/common';
import { SIZE_OF_PAGE } from 'utils';
import { GroupModel } from './groupModel';
import {
  deleteGroup,
  fetchGroup,
  getGroup,
  insertGroup,
  updateGroup,
  updateGroupMenuAction,
} from './groupService';

export interface GroupState {
  loading?: boolean;
  error?: any;
  data?: GroupModel[];
  groups?: ListResponse<GroupModel>;
}

const initialState: GroupState = {
  loading: false,
  error: {},
  data: undefined,
  groups: {
    result: [],
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
      .addCase(fetchGroup.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(
        fetchGroup.fulfilled,
        (state: any, action: PayloadAction<ListResponse<GroupModel>>) => {
          state.loading = false;
          state.groups = action.payload;
          state.error.fetchGroup = '';
        },
      )
      .addCase(fetchGroup.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error.fetchGroup = action.payload;
      });
    builder
      .addCase(insertGroup.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(insertGroup.fulfilled, (state: any, action: PayloadAction<GroupModel>) => {
        state.loading = false;
        state.data = action.payload;
        state.error.insertGroup = '';
      })
      .addCase(insertGroup.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error.insertGroup = action.payload;
      });
    builder
      .addCase(updateGroup.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(updateGroup.fulfilled, (state: any, action: PayloadAction<GroupModel>) => {
        state.loading = false;
        state.data = action.payload;
        state.error.updateGroup = '';
      })
      .addCase(updateGroup.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.sprin = false;
        state.error.updateGroup = action.payload;
      });
    builder
      .addCase(deleteGroup.pending, (state: any) => {
        state.loading = true;
        state.sprin = true;
      })
      .addCase(deleteGroup.fulfilled, (state: any, action: PayloadAction<GroupModel>) => {
        state.loading = false;
        state.sprin = false;
        state.data = action.payload;
        state.error.deleteGroup = '';
      })
      .addCase(deleteGroup.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.sprin = false;
        state.error.deleteGroup = action.payload;
      });
    builder
      .addCase(getGroup.pending, (state: any) => {
        state.loading = false;
      })
      .addCase(getGroup.fulfilled, (state: any, action: PayloadAction<GroupModel>) => {
        state.loading = false;
        state.data = action.payload;
        state.error.getGroup = '';
      })
      .addCase(getGroup.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error.getGroup = action.payload;
      });
    builder
      .addCase(updateGroupMenuAction.pending, (state: any) => {
        state.loading = false;
      })
      .addCase(updateGroupMenuAction.fulfilled, (state: any, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.data = action.payload;
        state.error.updateGroupMenuAction = '';
      })
      .addCase(updateGroupMenuAction.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error.updateGroupMenuAction = action.payload;
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
