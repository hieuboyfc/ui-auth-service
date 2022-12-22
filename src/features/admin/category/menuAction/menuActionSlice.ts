import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListResponse } from 'models/common';
import { SIZE_OF_PAGE } from 'utils';
import { MenuActionModel } from './menuActionModel';
import { getMenuActionAllByGroup } from './menuActionService';

export interface MenuActionState {
  loading?: boolean;
  error?: string;
  data?: MenuActionModel[];
  menuActions?: ListResponse<MenuActionModel>;
}

const initialState: MenuActionState = {
  loading: false,
  error: '',
  data: undefined,
  menuActions: {
    data: [],
    last: false,
    page: 0,
    size: SIZE_OF_PAGE,
    totalElements: 0,
    totalPages: 0,
  },
};

const menuActionSlice = createSlice({
  name: 'menuAction',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMenuActionAllByGroup.pending, (state: any) => {
        state.loading = false;
      })
      .addCase(
        getMenuActionAllByGroup.fulfilled,
        (state: any, action: PayloadAction<MenuActionModel>) => {
          state.loading = false;
          state.data = action.payload;
        },
      )
      .addCase(getMenuActionAllByGroup.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Action
export const menuActions = menuActionSlice.actions;

// Selectors
export const menuActionSelector = (state: any) => state.menuAction;

// Reducer
export const menuActionReducer = menuActionSlice.reducer;
