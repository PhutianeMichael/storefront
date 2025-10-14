import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import * as AuthActions from '../state/auth.actions';
import { selectAuthError, selectAuthLoading } from '../state/auth.selectors';
import { AppState } from '../../../app.state';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterLink,

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);

  hidePassword = true;

  loading = this.store.selectSignal(selectAuthLoading);
  errorMessage = this.store.selectSignal(selectAuthError);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  /**
   * Returns the email form control.
   */
  get email() {
    return this.form.controls.email;
  }

  /**
   * Returns the password form control.
   */
  get password() {
    return this.form.controls.password;
  }

  /**
   * Handles the login form submission.
   * @param loading Indicates if a login request is in progress.
   */
  async onSubmit(loading: boolean | null) {
    this.form.markAllAsTouched();
    if (this.form.invalid || loading) return;

    this.store.dispatch(AuthActions.login({
      loginRequestBody: {
        email: this.email.value!,
        password: this.password.value!,
      },
    }));

  }

}
