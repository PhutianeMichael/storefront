import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';
import { LoginResponse, Role, UserModel } from '../models/auth.model';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

describe('AuthEffects', () => {
    let actions$: Observable<any>;
    let effects: AuthEffects;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'signup']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
        TestBed.configureTestingModule({
            providers: [
                AuthEffects,
                provideMockActions(() => actions$),
                {provide: AuthService, useValue: authServiceSpy},
                {provide: Router, useValue: routerSpy},
                provideMockStore({}),
            ],
        });
        effects = TestBed.inject(AuthEffects);
    });

    it('should dispatch loginSuccess and navigate on successful login', (done) => {
        const user: UserModel = {
            firstname: 'Test',
            lastname: 'User',
            email: 'test@example.com',
            id: 1,
            role: 'USER' as Role,
        };
        const token = 'token123';
        const loginResponse: LoginResponse = {user, token};
        authServiceSpy.login.and.returnValue(of(loginResponse));
        actions$ = of(AuthActions.login({loginRequestBody: {email: 'test@example.com', password: 'password123'}}));
        effects.login$.subscribe(action => {
            expect(action).toEqual(AuthActions.loginSuccess({loginResponse}));
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/products');
            done();
        });
    });

    it('should dispatch loginFailure on failed login', (done) => {
        authServiceSpy.login.and.returnValue(throwError({body: {message: 'Invalid email or password', status: 401}}));
        actions$ = of(AuthActions.login({loginRequestBody: {email: 'test@example.com', password: 'wrong'}}));
        effects.login$.subscribe(action => {
            expect(action).toEqual(AuthActions.loginFailure({error: 'Invalid email or password'}));
            done();
        });
    });

    it('should dispatch signupSuccess and navigate on successful signup', (done) => {
        const user: UserModel = {
            firstname: 'Test',
            lastname: 'User',
            email: 'test@example.com',
            id: 1,
            role: 'USER' as Role,
        };
        authServiceSpy.signup.and.returnValue(of(user));
        actions$ = of(AuthActions.signup({
            signupRequestBody: {
                firstname: 'Test',
                lastname: 'User',
                email: 'test@example.com',
                password: 'Password@123',
                address: [],
            },
        }));
        effects.signup$.subscribe(action => {
            expect(action).toEqual(AuthActions.signupSuccess({user}));
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
            done();
        });
    });

    it('should dispatch signupFailure on failed signup', (done) => {
        authServiceSpy.signup.and.returnValue(throwError({body: {message: 'Signup failed'}, status: 400}));
        actions$ = of(AuthActions.signup({
            signupRequestBody: {
                firstname: 'Test',
                lastname: 'User',
                email: 'test@example.com',
                password: 'Password@123',
                address: [],
            },
        }));
        effects.signup$.subscribe(action => {
            expect(action).toEqual(AuthActions.signupFailure({error: 'Please check your information and try again'}));
            done();
        });
    });
});
