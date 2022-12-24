import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListResponse } from 'models/common';
import { SIZE_OF_PAGE } from 'utils';
import { MenuActionModel, MenuActionTree } from './menuActionModel';
import { getMenuActionAllByGroup } from './menuActionService';

export interface MenuActionState {
  loading?: boolean;
  error?: string;
  data?: MenuActionModel[];
  dataTree?: MenuActionTree[];
  menuActions?: ListResponse<MenuActionModel>;
}

const initialState: MenuActionState = {
  loading: false,
  error: '',
  data: undefined,
  dataTree: undefined,
  menuActions: {
    result: [],
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
        (state: any, action: PayloadAction<MenuActionTree>) => {
          state.loading = false;
          state.dataTree = action.payload;
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
