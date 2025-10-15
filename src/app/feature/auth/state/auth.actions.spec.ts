import * as AuthActions from './auth.actions';
import { LoginRequestBody, LoginResponse, Role, SignupRequestBody, UserModel } from '../models/auth.model';

describe('Auth Actions', () => {
  it('should create login action', () => {
    const payload: LoginRequestBody = { email: 'test@example.com', password: 'password123' };
    const action = AuthActions.login({ loginRequestBody: payload });
    expect(action.type).toBe(AuthActions.AuthActionTypes.LOGIN);
    expect(action.loginRequestBody).toEqual(payload);
  });

  it('should create loginSuccess action', () => {
    const user: UserModel = { firstname: 'Test', lastname: 'User', email: 'test@example.com', id: 1, role: 'USER' as Role };
    const token = 'token123';
    const payload: LoginResponse = { user, token };
    const action = AuthActions.loginSuccess({ loginResponse: payload });
    expect(action.type).toBe(AuthActions.AuthActionTypes.LOGIN_SUCCESS);
    expect(action.loginResponse).toEqual(payload);
  });

  it('should create loginFailure action', () => {
    const error = 'Invalid credentials';
    const action = AuthActions.loginFailure({ error });
    expect(action.type).toBe(AuthActions.AuthActionTypes.LOGIN_FAILURE);
    expect(action.error).toBe(error);
  });

  it('should create signup action', () => {
    const payload: SignupRequestBody = { firstname: 'Test', lastname: 'User', email: 'test@example.com', password: 'password123', address: [] };
    const action = AuthActions.signup({ signupRequestBody: payload });
    expect(action.type).toBe(AuthActions.AuthActionTypes.SIGNUP);
    expect(action.signupRequestBody).toEqual(payload);
  });

  it('should create signupSuccess action', () => {
    const user: UserModel = { firstname: 'Test', lastname: 'User', email: 'test@example.com', id: 1, role: 'USER' as Role};
    const action = AuthActions.signupSuccess({ user });
    expect(action.type).toBe(AuthActions.AuthActionTypes.SIGNUP_SUCCESS);
    expect(action.user).toEqual(user);
  });

  it('should create signupFailure action', () => {
    const error = 'Signup failed';
    const action = AuthActions.signupFailure({ error });
    expect(action.type).toBe(AuthActions.AuthActionTypes.SIGNUP_FAILURE);
    expect(action.error).toBe(error);
  });

  it('should create logout action', () => {
    const action = AuthActions.logout();
    expect(action.type).toBe(AuthActions.AuthActionTypes.LOGOUT);
  });

  it('should create loadUser action', () => {
    const action = AuthActions.loadUser();
    expect(action.type).toBe(AuthActions.AuthActionTypes.LOAD_USER);
  });

  it('should create loadUserSuccess action', () => {
    const user: UserModel = { firstname: 'Test', lastname: 'User', email: 'test@example.com', id: 1, role: 'USER' as Role };
    const token = 'token123';
    const action = AuthActions.loadUserSuccess({ user, token });
    expect(action.type).toBe(AuthActions.AuthActionTypes.LOAD_USER_SUCCESS);
    expect(action.user).toEqual(user);
    expect(action.token).toBe(token);
  });

  it('should create loadUserFailure action', () => {
    const error = 'User not found';
    const action = AuthActions.loadUserFailure({ error });
    expect(action.type).toBe(AuthActions.AuthActionTypes.LOAD_USER_FAILURE);
    expect(action.error).toBe(error);
  });
});

