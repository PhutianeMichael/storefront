import { LoginRequestBody, SignupRequestBody, UserModel } from '../models/auth.model';

export interface IAuthService {
  login(loginRequestBody: LoginRequestBody): void;
  signup(signupRequestBody: SignupRequestBody): void;
  logout(): void;
  isAuthenticated(): boolean;
  getUser(): UserModel | null;
  getToken(): string | null;
  removeToken(): void;
}
