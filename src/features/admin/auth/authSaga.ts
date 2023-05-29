import type { PayloadAction } from '@reduxjs/toolkit';
import authApi from 'features/admin/auth/authApi';
import { push } from 'connected-react-router';
import Cookies from 'js-cookie';
import JwtDecode from 'jwt-decode';
import { Menu } from 'models/menu';
import { Token } from 'models/token';
import { call, delay, fork, put, take } from 'redux-saga/effects';
import { LoginPayload } from './authModel';
import { authActions } from './authSlice';
import menuActionApi from '../category/menuAction/menuActionApi';

function* handleLogin(payload: LoginPayload) {
  try {
    const response = yield call(authApi.login, payload);
    yield delay(2000);
    const result = { ...response };
    if (result !== null) {
      const user: Token = JwtDecode(result.accessToken);
      Cookies.set('accessToken', result.accessToken, {
        expires: new Date(user.exp * 1000),
      });
      const resp = yield call(menuActionApi.getMenuActionByCurrentUser);
      if (resp !== null) {
        const menu: Menu = resp;
        yield put(authActions.getMenuAccessSuccess(menu));
      }
      yield put(authActions.loginSuccess(result));
      yield put(push('/admin'));
    }
  } catch (error) {
    if (error instanceof Error) {
      yield put(authActions.loginFailed(error.message));
    }
  }
}

function* handleLogout() {
  yield delay(500);
  Cookies.remove('accessToken');
  yield put(push('/admin/login'));
}

function* fetchMenuByCurrentUser() {
  try {
    // const response = authApi.getMenuActionByCurrentUser().then((data) => {
    //   console.log(data);
    // });
    const response = yield call(menuActionApi.getMenuActionByCurrentUser);
    if (response !== null) {
      const menu: Menu = response;
      yield put(authActions.getMenuAccessSuccess(menu));
    }
  } catch (error) {
    if (error instanceof Error) {
      yield put(authActions.getMenuAccessFailed(error.message));
    }
  }
}

function* fetchMenuAllByCurrentUser() {
  try {
    const response = yield call(menuActionApi.getMenuActionAllByCurrentUser);
    if (response !== null) {
      const menu: Menu = response;
      yield put(authActions.getAllMenuAccessSuccess(menu));
    }
  } catch (error) {
    if (error instanceof Error) {
      yield put(authActions.getAllMenuAccessFailed(error.message));
    }
  }
}

function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(Cookies.get('accessToken'));
    if (!isLoggedIn) {
      const action: PayloadAction<LoginPayload> = yield take(authActions.login.type);
      yield fork(handleLogin, action.payload);
    }
    yield take(authActions.logout.type);
    yield call(handleLogout);
  }
}

export default function* authSaga() {
  yield fork(watchLoginFlow);
  const isLoggedIn = Boolean(Cookies.get('accessToken'));
  if (isLoggedIn) {
    yield fork(fetchMenuByCurrentUser);
    yield fork(fetchMenuAllByCurrentUser);
  }
}
