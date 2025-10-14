import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AUTH_STORAGE_KEY, LoginRequestBody, LoginResponse, SignupRequestBody, UserModel } from '../models/auth.model';
import { catchError, map, throwError } from 'rxjs';
import { IAuthService } from '../interfaces/IAuthService';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  https = inject(HttpClient);

  /**
   * Sends a login request and stores authentication data in localStorage.
   * @param loginRequestBody The login request payload.
   * @returns Observable emitting the login response.
   */
  login(loginRequestBody: LoginRequestBody) {
    return this.https.post<LoginResponse>('api/auth/login', loginRequestBody).pipe(
      map(response => {
        const authData = localStorage.getItem(AUTH_STORAGE_KEY);
        if (authData) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
        return response;
      }),
      catchError(error => {
        console.error('AuthService login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Sends a signup request and stores user data in localStorage.
   * @param signupRequestBody The signup request payload.
   * @returns Observable emitting the created user.
   */
  signup(signupRequestBody: SignupRequestBody) {
    return this.https.post<UserModel>('api/auth/signup', signupRequestBody).pipe(
      map(user => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return user;
      })
    );
  }

  /**
   * Removes authentication data from localStorage, logging out the user.
   */
  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  /**
   * Checks if the user is authenticated based on stored token.
   * @returns True if authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!authData) return false;
      const parsed = JSON.parse(authData);
      return !!parsed.token;
    } catch {
      return false;
    }
  }

  getUser(): UserModel | null {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!authData) return null;
      const parsed = JSON.parse(authData);
      return parsed.user ?? null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!authData) return null;
      const parsed = JSON.parse(authData);
      return parsed.token ?? null;
    } catch {
      return null;
    }
  }

  removeToken() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
