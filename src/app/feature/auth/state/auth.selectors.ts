
import { createSelector } from '@ngrx/store';
import { Role } from '../models/auth.model';
import { selectAuthState } from '../../../../app.state';

export const selectAuth = createSelector(
  selectAuthState,
  (state) => state
);

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (state) => state.isAuthenticated
);

export const selectAuthUser = createSelector(
  selectAuth,
  (state) => state.user
);

export const selectAuthToken = createSelector(
  selectAuth,
  (state) => state.token
);

export const selectAuthLoading = createSelector(
  selectAuth,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuth,
  (state) => state.error
);

export const selectIsAdmin = createSelector(
  selectAuthUser,
  (user) => user?.role === Role.ADMIN
);

export const selectUsername = createSelector(
  selectAuthUser,
  (user) => user?.firstname + ' ' + user?.lastname
);

export const selectAuthUserId = createSelector(
  selectAuthUser,
  (user) => user?.id
);


