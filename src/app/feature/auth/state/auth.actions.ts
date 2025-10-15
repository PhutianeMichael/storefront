import { createAction, props } from '@ngrx/store';
import { LoginRequestBody, LoginResponse, SignupRequestBody, UserModel } from '../models/auth.model';

export const enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  SIGNUP = '[Auth] Signup',
  SIGNUP_SUCCESS = '[Auth] Signup Success',
  SIGNUP_FAILURE = '[Auth] Signup Failure',
  LOGOUT = '[Auth] Logout',
  LOAD_USER = '[Auth] Load User',
  LOAD_USER_SUCCESS = '[Auth] Load User Success',
  LOAD_USER_FAILURE = '[Auth] Load User Failure',
  LOAD_USER_SKIPPED = '[Auth] Load User Skipped',
  APP_AUTH_INIT = '[Auth] App Auth Init',
}

export const AUTH_STORAGE_KEY = 'auth_data';

export const login = createAction(
  AuthActionTypes.LOGIN,
  props<{ loginRequestBody: LoginRequestBody }>(),
);

export const loginSuccess = createAction(
  AuthActionTypes.LOGIN_SUCCESS,
  props<{ loginResponse: LoginResponse }>(),
);

export const loginFailure = createAction(
  AuthActionTypes.LOGIN_FAILURE,
  props<{ error: string }>(),
);

export const signup = createAction(
  AuthActionTypes.SIGNUP,
  props<{ signupRequestBody: SignupRequestBody }>(),
);

export const signupSuccess = createAction(
  AuthActionTypes.SIGNUP_SUCCESS,
  props<{ user: UserModel }>(),
);

export const signupFailure = createAction(
  AuthActionTypes.SIGNUP_FAILURE,
  props<{ error: string }>(),
);

export const logout = createAction(
  AuthActionTypes.LOGOUT,
);

export const loadUser = createAction(
  AuthActionTypes.LOAD_USER,
);

export const loadUserSuccess = createAction(
  AuthActionTypes.LOAD_USER_SUCCESS,
  props<{ user: UserModel; token: string }>(),
);

export const loadUserFailure = createAction(
  AuthActionTypes.LOAD_USER_FAILURE,
  props<{ error: string }>(),
);

export const loadUserSkipped = createAction(
  AuthActionTypes.LOAD_USER_SKIPPED,
);

export const appAuthInit = createAction(
  AuthActionTypes.APP_AUTH_INIT,
);
