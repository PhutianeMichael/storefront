import { AuthState } from '../models/auth.model';
import * as AuthActions from './auth.actions';
import { createReducer, on } from '@ngrx/store';

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};
export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { loginResponse }) => ({
    ...state,
    user: loginResponse.user,
    token: loginResponse.token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loadUserSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  on(AuthActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),

    on(AuthActions.loadUserSkipped, (state) => ({
      ...state,
      loading: false,
      error: null,
      isAuthenticated: false
    })),

  on(AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.signupSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.appAuthInit, (state) => ({
    ...state,
    loading: true
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }))
);
export const authFeatureKey = 'auth';
