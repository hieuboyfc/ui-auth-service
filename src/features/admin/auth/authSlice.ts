import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'redux/store';
import { Menu } from 'models/menu';
import { User } from 'models/user';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  logging?: boolean;
  username?: string;
  currentUser?: User;
  currentMenuAction?: Menu;
  currentMenuActionAll?: Menu;
  message: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  logging: false,
  username: '',
  currentUser: undefined,
  currentMenuAction: undefined,
  currentMenuActionAll: undefined,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state: any, action: PayloadAction<LoginPayload>) {
      state.logging = true;
      state.username = action.payload.username;
    },
    loginSuccess(state: any, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.logging = false;
      state.currentUser = action.payload;
      state.message = '';
    },
    loginFailed(state: any, action: PayloadAction<string>) {
      state.logging = false;
      state.message = action.payload;
    },
    logout(state: any) {
      state.isLoggedIn = false;
      state.currentUser = undefined;
      state.message = '';
    },
    getMenuAccessSuccess(state: any, action: PayloadAction<Menu>) {
      state.isLoggedIn = true;
      state.currentMenuAction = action.payload;
    },
    getMenuAccessFailed(state: any, action: PayloadAction<string>) {
      state.isLoggedIn = false;
      state.currentMenuAction = undefined;
      state.message = action.payload;
    },
    getAllMenuAccessSuccess(state: any, action: PayloadAction<Menu>) {
      state.isLoggedIn = true;
      state.currentMenuActionAll = action.payload;
    },
    getAllMenuAccessFailed(state: any, action: PayloadAction<string>) {
      state.isLoggedIn = false;
      state.currentMenuActionAll = undefined;
      state.message = action.payload;
    },
  },
});

// Action
export const authActions = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state: any) => state.auth.isLoggedIn;
export const selectIsLogging = (state: any) => state.auth.logging;
export const selectCurrentMenuAction = (state: RootState) => state.auth.currentMenuAction;
export const selectCurrentMenuActionAll = (state: RootState) => state.auth.currentMenuActionAll;

// Reducer
export const authReducer = authSlice.reducer;
