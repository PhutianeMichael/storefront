import { AuthState } from './feature/auth/models/auth.model';

export interface AppState {
  auth: AuthState;
}

export const selectAuthState = (state: AppState) => state.auth;
