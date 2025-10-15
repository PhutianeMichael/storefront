import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { authGuard } from './auth.guard';
import { AUTH_STORAGE_KEY } from '../state/auth.actions';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation if auth data exists', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: 'abc123' }));
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should block activation and redirect if no auth data', () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should block activation if auth data is malformed', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'not-json');
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should block activation if auth data is missing token', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: { id: 1 } }));
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow activation for admin user if token exists', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: 'admin-token', user: { role: 'ADMIN' } }));
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should block activation if localStorage returns null', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
