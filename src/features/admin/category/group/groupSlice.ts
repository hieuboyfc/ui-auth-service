import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from './groupModel';
import { fetchGroup } from './groupService';

export interface GroupState {
  loading: boolean;
  error: string;
  groups: Group[];
}

const initialState: GroupState = {
  loading: false,
  error: '',
  groups: [],
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
      .addCase(fetchGroup.fulfilled, (state: any, action: PayloadAction<Group[]>) => {
        state.loading = false;
        state.groups = action.payload;
      })
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
