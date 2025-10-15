import { authReducer, initialState } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { Role, UserModel } from '../models/auth.model';

describe('Auth Reducer', () => {
  it('should return the initial state', () => {
    const state = authReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(initialState);
  });

  it('should set loading true and clear error on login', () => {
    const state = authReducer(initialState, AuthActions.login({
        loginRequestBody: {
            email: 'test@example.com',
            password: 'Password@1234'
        }}));
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should set user, token, isAuthenticated, loading false, error null on loginSuccess', () => {
    const user: UserModel = { firstname: 'Test', lastname: 'User', email: 'test@example.com', id: 1, role: 'USER' as Role };
    const token = 'token123';
    const state = authReducer(initialState, AuthActions.loginSuccess({ loginResponse: { user, token } }));
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBeTrue();
    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('should set error and loading false on loginFailure', () => {
    const error = 'Invalid credentials';
    const state = authReducer(initialState, AuthActions.loginFailure({ error }));
    expect(state.error).toBe(error);
    expect(state.loading).toBeFalse();
  });

  it('should set loading true and clear error on loadUser', () => {
    const state = authReducer(initialState, AuthActions.loadUser());
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should set user, token, isAuthenticated, loading false, error null on loadUserSuccess', () => {
    const user: UserModel = { firstname: 'Test', lastname: 'User', email: 'test@example.com', id: 1, role: 'USER' as Role };
    const token = 'token123';
    const state = authReducer(initialState, AuthActions.loadUserSuccess({ user, token }));
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBeTrue();
    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('should set error and loading false on loadUserFailure', () => {
    const error = 'User not found';
    const state = authReducer(initialState, AuthActions.loadUserFailure({ error }));
    expect(state.error).toBe(error);
    expect(state.loading).toBeFalse();
  });
});

