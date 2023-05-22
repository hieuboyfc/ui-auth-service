import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListResponse } from 'models/common';
import { SIZE_OF_PAGE } from 'utils';
import { MenuActionModel, MenuActionTree } from './menuActionModel';
import {
  deleteMenuAction,
  fetchMenuAction,
  getMenuAction,
  getMenuActionAllByGroup,
  insertMenuAction,
  updateMenuAction,
} from './menuActionService';

export interface MenuActionState {
  loading?: boolean;
  error?: any;
  data?: MenuActionModel[];
  dataTree?: MenuActionTree[];
  menuActions?: ListResponse<MenuActionModel>;
}

const initialState: MenuActionState = {
  loading: false,
  error: {},
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
      .addCase(fetchMenuAction.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(
        fetchMenuAction.fulfilled,
        (state: any, action: PayloadAction<ListResponse<MenuActionModel>>) => {
          state.loading = false;
          state.groups = action.payload;
          state.error.fetchMenuAction = '';
        },
      )
      .addCase(fetchMenuAction.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error.fetchMenuAction = action.payload;
      });
    builder
      .addCase(insertMenuAction.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(insertMenuAction.fulfilled, (state: any, action: PayloadAction<MenuActionModel>) => {
        state.loading = false;
        state.data = action.payload;
        state.error.insertMenuAction = '';
      })
      .addCase(insertMenuAction.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error.insertMenuAction = action.payload;
      });
    builder
      .addCase(updateMenuAction.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(updateMenuAction.fulfilled, (state: any, action: PayloadAction<MenuActionModel>) => {
        state.loading = false;
        state.data = action.payload;
        state.error.updateMenuAction = '';
      })
      .addCase(updateMenuAction.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.sprin = false;
        state.error.updateMenuAction = action.payload;
      });
    builder
      .addCase(deleteMenuAction.pending, (state: any) => {
        state.loading = true;
        state.sprin = true;
      })
      .addCase(deleteMenuAction.fulfilled, (state: any, action: PayloadAction<MenuActionModel>) => {
        state.loading = false;
        state.sprin = false;
        state.data = action.payload;
        state.error.deleteMenuAction = '';
      })
      .addCase(deleteMenuAction.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.sprin = false;
        state.error.deleteMenuAction = action.payload;
      });
    builder
      .addCase(getMenuAction.pending, (state: any) => {
        state.loading = false;
      })
      .addCase(getMenuAction.fulfilled, (state: any, action: PayloadAction<MenuActionModel>) => {
        state.loading = false;
        state.data = action.payload;
        state.error.getMenuAction = '';
      })
      .addCase(getMenuAction.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error.getMenuAction = action.payload;
      });
    builder
      .addCase(getMenuActionAllByGroup.pending, (state: any) => {
        state.loading = false;
      })
      .addCase(
        getMenuActionAllByGroup.fulfilled,
        (state: any, action: PayloadAction<MenuActionTree>) => {
          state.loading = false;
          state.dataTree = action.payload;
          state.error.getMenuActionAllByGroup = '';
        },
      )
      .addCase(getMenuActionAllByGroup.rejected, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        state.error.getMenuActionAllByGroup = action.payload;
      });
  },
});

// Action
export const menuActions = menuActionSlice.actions;

// Selectors
export const selectIsLoading = (state: any) => state.menuAction.loading;
export const selectIsError = (state: any) => state.menuAction.error;
export const menuActionSelector = (state: any) => state.menuAction;

// Reducer
export const menuActionReducer = menuActionSlice.reducer;
