export interface Address {
  street: string;
  city: string;
  provinceOrState: string;
  code: string;
  country: string;
}

export const enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role: Role | Role.USER;
  address: Address[];
}

export interface Auth {
  user: User;
  token: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface SignupRequestBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address: Address[];
}

export interface AuthState {
  user: UserModel | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  user: UserModel;
  token: string;
}

export interface ApiErrorResponse {
  body: { message: string };
  status: number;
  headers: any;
  url: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash' | 'address'>;
}

export type UserModel = Omit<User, 'passwordHash' | 'address'>;
export const AUTH_STORAGE_KEY = 'auth_data';
