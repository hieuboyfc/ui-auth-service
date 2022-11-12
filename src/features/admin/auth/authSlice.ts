import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'configs/store';
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
  message: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  logging: false,
  username: '',
  currentUser: undefined,
  currentMenuAction: undefined,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(initState, action: PayloadAction<LoginPayload>) {
      const state = { ...initState };
      state.logging = true;
      state.username = action.payload.username;
    },
    loginSuccess(initState, action: PayloadAction<User>) {
      const state = { ...initState };
      state.isLoggedIn = true;
      state.logging = false;
      state.currentUser = action.payload;
      state.message = '';
    },
    loginFailed(initState, action: PayloadAction<string>) {
      const state = { ...initState };
      state.logging = false;
      state.message = action.payload;
    },
    logout(initState) {
      const state = { ...initState };
      state.isLoggedIn = false;
      state.currentUser = undefined;
      state.message = '';
    },
    getMenuAccessSuccess(initState, action: PayloadAction<Menu>) {
      const state = { ...initState };
      state.currentMenuAction = action.payload;
    },
    getMenuAccessFailed(initState, action: PayloadAction<string>) {
      const state = { ...initState };
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

// Reducer
export const authReducer = authSlice.reducer;
