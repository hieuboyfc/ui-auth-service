import { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { call, delay, fork, put, take } from 'redux-saga/effects';
import { authActions, LoginPayload } from './authSlice';

function* handleLogin(payload: LoginPayload) {
  try {
    console.log('Login: ', payload);
    yield delay(2000);
    yield put(
      authActions.loginSuccess({
        id: 1,
        name: 'HieuBoy',
      }),
    );
    localStorage.setItem('accessToken', 'hieuboyfc');
    yield put(push('/admin'));
  } catch (error) {
    yield put(authActions.loginFailed(''));
  }
}

function* handleLogout() {
  yield delay(500);
  localStorage.removeItem('accessToken');
  yield put(push('/admin/login'));
}

function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(localStorage.getItem('accessToken'));
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
}
