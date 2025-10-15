import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { AUTH_STORAGE_KEY } from '../state/auth.actions';
import { LoginRequestBody, LoginResponse, Role, SignupRequestBody, UserModel } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store auth data in localStorage', () => {
    const loginRequest: LoginRequestBody = { email: 'test@test.com', password: '123456' };
    const loginResponse: LoginResponse = {
      token: 'abc123',
      user: {
        id: 1,
        email: 'test@test.com',
        firstname: 'Test',
        lastname: 'User',
        role: 'USER' as Role,
      }
    };

    service.login(loginRequest).subscribe(response => {
      expect(response).toEqual(loginResponse);
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(loginResponse);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(loginResponse);
  });

  it('should handle login error', () => {
    const loginRequest: LoginRequestBody = { email: 'fail@test.com', password: 'wrong' };
    const errorMsg = 'Invalid credentials';

    service.login(loginRequest).subscribe({
      next: () => fail('should have errored'),
      error: error => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('api/auth/login');
    req.flush({ message: errorMsg }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should signup and store user in localStorage', () => {
    const signupRequest: SignupRequestBody = {
      firstname: 'Test', lastname: 'User', email: 'test@test.com', password: '123456', address: []
    };
    const user: UserModel = {
      id: 1,
      email: 'test@test.com',
      firstname: 'Test',
      lastname: 'User',
      role: 'USER' as Role,
    };
    service.signup(signupRequest).subscribe(response => {
      expect(response).toEqual(user);
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(user);
    });
    const req = httpMock.expectOne('api/auth/signup');
    expect(req.request.method).toBe('POST');
    req.flush(user);
  });

  it('should handle signup error', () => {
    const signupRequest: SignupRequestBody = {
      firstname: 'Test', lastname: 'User', email: 'test@test.com', password: '123456', address: []
    };
    let errorResponse: any;
    service.signup(signupRequest).subscribe({
      error: err => {
        errorResponse = err;
        expect(errorResponse).toBeTruthy();
      }
    });
    const req = httpMock.expectOne('api/auth/signup');
    req.flush('Signup failed', { status: 400, statusText: 'Bad Request' });
  });

  it('should logout and remove auth data from localStorage', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: 'abc123' }));
    service.logout();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it('should return true for isAuthenticated if token exists', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: 'abc123' }));
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false for isAuthenticated if no token', () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should get user from localStorage', () => {
    const user: UserModel = {
      id: 1,
      email: 'test@test.com',
      firstname: 'Test',
      lastname: 'User',
      role: 'USER' as Role,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token: 'abc123' }));
    expect(service.getUser()).toEqual(user);
  });

  it('should get token from localStorage', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: 'abc123' }));
    expect(service.getToken()).toBe('abc123');
  });

  it('should remove token from localStorage', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: 'abc123' }));
    service.removeToken();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'not-json');
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getUser()).toBeNull();
    expect(service.getToken()).toBeNull();
  });
});
