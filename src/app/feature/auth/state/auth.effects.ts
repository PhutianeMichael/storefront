import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { exhaustMap, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, tap } from 'rxjs/operators';
import { ApiErrorResponse, LoginResponse } from '../models/auth.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartActions from '../state/auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  router = inject(Router);
  private authService = inject(AuthService);
  readonly store = inject(Store<AppState>);


  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action => {
        return this.authService.login(action.loginRequestBody).pipe(
          map(response => {
              return AuthActions.loginSuccess({ loginResponse: response });
          }),
          catchError(error => {
            return of(AuthActions.loginFailure({
              error: this.getUserFriendlyErrorMessage(error, 'login') || 'Login failed'
            }));
          })
        );
      })
    )
  );

  signup$  = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      exhaustMap(action =>
        this.authService.signup(action.signupRequestBody).pipe(
          map((userResponse) => {
            this.router.navigateByUrl('/login');
            return AuthActions.signupSuccess({user: userResponse})
          }),
          catchError(error => of(AuthActions.signupFailure({ error: this.getUserFriendlyErrorMessage(error, 'Signup') || 'Signup failed' })))
        )
      ))
  );

  loadUserDataFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.appAuthInit),
      map(() => {
        const storedData = localStorage.getItem(AuthActions.AUTH_STORAGE_KEY);
        if (storedData) {
          try {
            const authData = JSON.parse(storedData);
            if (authData.user && authData.token) {
              return AuthActions.loadUserSuccess({
                user: authData.user,
                token: authData.token
              });
            }
          } catch (error) {
            return AuthActions.loadUserFailure({ error: 'Invalid auth data' });
          }
        }
        return AuthActions.loadUserSkipped();
      })
    )
  );

  saveAuthDataToLocalStorage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.signupSuccess, AuthActions.logout),
        tap(action => {
          if (action.type === AuthActions.logout.type) {
            localStorage.removeItem(AuthActions.AUTH_STORAGE_KEY);
          }
          else if (action.type === AuthActions.loginSuccess.type) {
            const loginResponse = (action as any).loginResponse as LoginResponse;
            localStorage.setItem(
              AuthActions.AUTH_STORAGE_KEY,
              JSON.stringify({
                user: loginResponse.user,
                token: loginResponse.token
              })
            );
          }
        })
      ),
    { dispatch: false }
  );

    private getUserFriendlyErrorMessage(error: ApiErrorResponse, context: string): string {
        if (error.status === 401) {
            return 'Invalid email or password';
        }

        if (error.status === 409) {
            return 'An account with this email already exists';
        }

        if (error.status === 400) {
            return 'Please check your information and try again';
        }

        if (error.status === 0 || error.status >= 500) {
            return 'Server is temporarily unavailable. Please try again later';
        }

        if (error.body && error.body.message) {
            return error.body.message;
        }
        return 'An unknown error occurred';
    }
}
