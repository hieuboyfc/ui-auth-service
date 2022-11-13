import type { PayloadAction } from '@reduxjs/toolkit';
import authApi from 'api/authApi';
import menuActionApi from 'api/menuActionApi';
import { push } from 'connected-react-router';
import Cookies from 'js-cookie';
import JwtDecode from 'jwt-decode';
import { Menu } from 'models/menu';
import { Token } from 'models/token';
import { call, delay, fork, put, take } from 'redux-saga/effects';
import { authActions, LoginPayload } from './authSlice';

function* handleLogin(payload: LoginPayload) {
  try {
    const response = yield call(authApi.login, payload);
    yield delay(2000);
    const data = { ...response };
    if (data !== null) {
      const user: Token = JwtDecode(data.accessToken);
      Cookies.set('accessToken', data.accessToken, {
        expires: new Date(user.exp * 1000),
      });
      const resp = yield call(menuActionApi.getMenuActionByCurrentUser);
      if (resp !== null) {
        const menu: Menu = resp;
        yield put(authActions.getMenuAccessSuccess(menu));
      }
      yield put(authActions.loginSuccess(data));
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
    const data = { ...response };
    if (response !== null) {
      const menu: Menu = data;
      yield put(authActions.getMenuAccessSuccess(menu));
    }
  } catch (error) {
    if (error instanceof Error) {
      yield put(authActions.getMenuAccessFailed(error.message));
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
  }
}
