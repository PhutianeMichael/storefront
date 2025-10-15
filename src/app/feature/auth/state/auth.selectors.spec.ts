import * as AuthSelectors from './auth.selectors';
import { AuthState, Role, UserModel } from '../models/auth.model';

describe('Auth Selectors', () => {
  const user: UserModel = {
    firstname: 'Test',
    lastname: 'User',
    email: 'test@example.com',
    id: 1,
    role: Role.ADMIN
  };
  const state: AuthState = {
    user,
    token: 'token123',
    isAuthenticated: true,
    loading: false,
    error: null
  };

  it('should select isAuthenticated', () => {
    expect(AuthSelectors.selectIsAuthenticated.projector(state)).toBeTrue();
  });

  it('should select user', () => {
    expect(AuthSelectors.selectAuthUser.projector(state)).toEqual(user);
  });

  it('should select token', () => {
    expect(AuthSelectors.selectAuthToken.projector(state)).toBe('token123');
  });

  it('should select loading', () => {
    expect(AuthSelectors.selectAuthLoading.projector(state)).toBeFalse();
  });

  it('should select error', () => {
    expect(AuthSelectors.selectAuthError.projector(state)).toBeNull();
  });

  it('should select isAdmin', () => {
    expect(AuthSelectors.selectIsAdmin.projector(user)).toBeTrue();
  });

  it('should select username', () => {
    expect(AuthSelectors.selectUsername.projector(user)).toBe('Test User');
  });

  it('should select userId', () => {
    expect(AuthSelectors.selectAuthUserId.projector(user)).toBe(1);
  });
});

