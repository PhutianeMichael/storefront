import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { Address, SignupRequestBody } from '../models/auth.model';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthLoading } from '../state/auth.selectors';
import { AppState } from '../../../app.state';
import * as AuthActions from '../../auth/state/auth.actions';

@Component({
  selector: 'app-signup-page',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public fb = inject(FormBuilder);
  readonly store = inject(Store<AppState>);

  hidePassword = true;
  hideConfirmPassword = true;

  loading = this.store.selectSignal(selectAuthLoading);
  errorMessage = this.store.selectSignal(selectAuthError);
  displayError = false;

  form = this.fb.group(
    {
      firstname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]],
      lastname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      address: this.fb.array([this.createAddressGroup()], {
        validators: [this.minAddressLengthValidator(0)],
      }),
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    {validators: this.passwordsMatchValidator()},
  );

  /**
   * Returns the firstname form control.
   */
  get firstname(): FormControl<string | null> {
    return this.form.controls.firstname as FormControl<string | null>;
  }

  /**
   * Returns the lastname form control.
   */
  get lastname(): FormControl<string | null> {
    return this.form.controls.lastname as FormControl<string | null>;
  }

  /**
   * Returns the email form control.
   */
  get email(): FormControl<string | null> {
    return this.form.controls.email as FormControl<string | null>;
  }

  /**
   * Returns the password form control.
   */
  get password(): FormControl<string | null> {
    return this.form.controls.password as FormControl<string | null>;
  }

  /**
   * Returns the confirmPassword form control.
   */
  get confirmPassword(): FormControl<string | null> {
    return this.form.controls.confirmPassword as FormControl<string | null>;
  }

  /**
   * Returns the acceptTerms form control.
   */
  get acceptTerms(): FormControl<boolean | null> {
    return this.form.controls.acceptTerms as FormControl<boolean | null>;
  }

  /**
   * Checks if a form control has a specific error and has been touched.
   * @param control The form control to check.
   * @param errorCode The error code to check for.
   * @returns True if the error exists and the control is touched.
   */
  hasError(control: AbstractControl | null, errorCode: string): boolean {
    return !!(control?.touched && control.hasError(errorCode));
  }

  /**
   * Returns the address form array.
   */
  get address(): FormArray {
    return this.form.get('address') as FormArray;
  }

  /**
   * Returns the address form group at the specified index.
   * @param index The index of the address group.
   * @returns The FormGroup for the address.
   */
  addressAt(index: number): FormGroup {
    return this.address.at(index) as FormGroup;
  }

  /**
   * Adds a new address group to the address form array.
   */
  addAddress(): void {
    this.address.push(this.createAddressGroup());
  }

  /**
   * Removes the address group at the specified index if more than one exists.
   * @param index The index of the address group to remove.
   */
  removeAddress(index: number): void {
    if (this.address.length > 1) {
      this.address.removeAt(index);
      this.address.markAsTouched();
    }
  }

  /**
   * Creates a new address form group.
   * @returns The new address FormGroup.
   */
  private createAddressGroup(): FormGroup {
    return this.fb.group({
      street: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      provinceOrState: ['', [Validators.required, Validators.maxLength(50)]],
      code: ['', [Validators.required, Validators.maxLength(20)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  /**
   * Handles the signup form submission.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {firstname, lastname, email, password, address} = this.form.getRawValue();

    const signupRequestBody: SignupRequestBody = {
      firstname: firstname as string,
      lastname: lastname as string,
      email: email as string,
      password: password as string,
      address: address as Address[],
    };

    this.store.dispatch(AuthActions.signup({signupRequestBody}));
  }

  /**
   * Validator to check if password and confirmPassword fields match.
   * Adds a 'passwordsMismatch' error to confirmPassword if they do not match.
   * @returns ValidatorFn for password matching.
   */
  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');

      if (!password || !confirmPassword) return null;

      const passwordValue = password.value;
      const confirmPasswordValue = confirmPassword.value;

      if (passwordValue !== confirmPasswordValue) {
        confirmPassword.setErrors({...confirmPassword.errors, passwordsMismatch: true});
        return {passwordsMismatch: true};
      } else {
        if (confirmPassword.errors && confirmPassword.errors['passwordsMismatch']) {
          const {passwordsMismatch, ...otherErrors} = confirmPassword.errors;
          confirmPassword.setErrors(Object.keys(otherErrors).length > 0 ? otherErrors : null);
        }
        return null;
      }
    };
  }

  /**
   * Validator to check if the address array has at least the specified minimum length.
   * Adds a 'minAddressLength' error if the array is too short.
   * @param minLength Minimum number of addresses required.
   * @returns ValidatorFn for address array length.
   */
  private minAddressLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const addressArray = control as FormArray;
      return addressArray.length >= minLength ? null : {minAddressLength: true};
    };
  }
}
