import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { computed } from '@angular/core';

import { SignupComponent } from './signup.component';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.model';
import { Store } from '@ngrx/store';

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  routerState: {snapshot: {}, root: {}, events: of()},
  url: '',
  createUrlTree: jasmine.createSpy('createUrlTree'),
  serializeUrl: jasmine.createSpy('serializeUrl'),
  events: of(),
};

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;
  let store: jasmine.SpyObj<Store<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent, HttpClientTestingModule],
      providers: [
        {provide: Store, useValue: jasmine.createSpyObj('Store', ['select', 'dispatch', 'selectSignal'])},
        {provide: ActivatedRoute, useValue: {}},
        {provide: Router, useValue: mockRouter},
      ],
    })
      .compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;

    store.selectSignal.and.callFake((selector: any) => {
      if (selector.name === 'selectAuthLoading') return computed(() => false);
      if (selector.name === 'selectAuthError') return computed(() => '');
      return computed(() => undefined as any);
    });

    authService = TestBed.inject(AuthService);
    spyOn(authService, 'signup').and.returnValue(of({
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      id: 1,
      role: 'USER' as Role,
    }));

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    (component as any).auth = authService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render firstname, lastname, email, password, and confirmPassword fields', () => {
    const firstnameInput = fixture.nativeElement.querySelector('input[formControlName="firstname"]');
    const lastnameInput = fixture.nativeElement.querySelector('input[formControlName="lastname"]');
    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');
    const confirmPasswordInput = fixture.nativeElement.querySelector('input[formControlName="confirmPassword"]');
    expect(firstnameInput).toBeTruthy();
    expect(lastnameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();
  });

  it('should show required error for empty fields', () => {
    component.form.controls['firstname']?.setValue('');
    component.form.controls['firstname']?.markAsTouched();
    component.form.controls['lastname']?.setValue('');
    component.form.controls['lastname']?.markAsTouched();
    component.form.controls['email'].setValue('');
    component.form.controls['email'].markAsTouched();
    component.form.controls['password'].setValue('');
    component.form.controls['password'].markAsTouched();
    component.form.controls['confirmPassword']?.setValue('');
    component.form.controls['confirmPassword']?.markAsTouched();
    fixture.detectChanges();
    expect(component.form.controls['firstname']?.errors?.['required']).toBeTrue();
    expect(component.form.controls['lastname']?.errors?.['required']).toBeTrue();
    expect(component.form.controls['email'].errors?.['required']).toBeTrue();
    expect(component.form.controls['password'].errors?.['required']).toBeTrue();
    expect(component.form.controls['confirmPassword']?.errors?.['required']).toBeTrue();
  });

  it('should show email format error for invalid email', () => {
    component.form.controls['email'].setValue('invalid-email');
    component.form.controls['email'].markAsTouched();
    fixture.detectChanges();
    expect(component.form.controls['email'].errors?.['email']).toBeTrue();
  });

  it('should show password mismatch error', () => {
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword']?.setValue('password321');
    component.form.controls['confirmPassword']?.markAsTouched();
    const addressArray = component.form.get('address') as any;
    addressArray.push(component.fb.group({
      street: ['123 Main St'],
      city: ['Testville'],
      provinceOrState: ['TestState'],
      code: ['12345'],
      country: ['TestCountry'],
    }));
    component.form.controls['acceptTerms']?.setValue(true);
    component.form.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.form.hasError('passwordsMismatch')).toBeTrue();
  });

  it('should disable submit button when form is invalid', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.disabled).toBeTrue();
  });

  it('should call signup service on valid form submit', fakeAsync(() => {
    component.form.controls['firstname']?.setValue('Test User firstname');
    component.form.controls['lastname']?.setValue('Test User lastname');
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('Password@1234');
    component.form.controls['confirmPassword']?.setValue('Password@1234');
    component.form.controls['acceptTerms']?.setValue(true);

    const addressArray = component.form.get('address') as any;
    addressArray.clear();
    addressArray.push(component.fb.group({
      street: ['123 Main St'],
      city: ['Testville'],
      provinceOrState: ['TestState'],
      code: ['12345'],
      country: ['TestCountry'],
    }));
    component.form.markAsDirty();
    component.form.markAsTouched();
    component.form.updateValueAndValidity();
    fixture.detectChanges();
    const store = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
    component.onSubmit();
    tick();
    const signupRequestBody = {
      firstname: 'Test User firstname',
      lastname: 'Test User lastname',
      email: 'test@example.com',
      password: 'Password@1234',
      address: [{
        street: '123 Main St',
        city: 'Testville',
        provinceOrState: 'TestState',
        code: '12345',
        country: 'TestCountry',
      }],
    };
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Auth] Signup',
      signupRequestBody,
    }));
  }));

  it('should show error for password less than 8 characters', () => {
    component.form.controls['password'].setValue('Ab1!');
    component.form.controls['password'].markAsTouched();
    fixture.detectChanges();
    expect(component.form.controls['password'].errors?.['minlength']).toBeTruthy();
  });

  it('should show error for password without special character', () => {
    component.form.controls['password'].setValue('Abcdefg1');
    component.form.controls['password'].markAsTouched();
    fixture.detectChanges();
    expect(component.form.controls['password'].errors?.['pattern']).toBeTruthy();
  });

  it('should show error for password without lowercase character', () => {
    component.form.controls['password'].setValue('ABCDEFG1!');
    component.form.controls['password'].markAsTouched();
    fixture.detectChanges();
    expect(component.form.controls['password'].errors?.['pattern']).toBeTruthy();
  });

  it('should show error for password without uppercase character', () => {
    component.form.controls['password'].setValue('abcdefg1!');
    component.form.controls['password'].markAsTouched();
    fixture.detectChanges();
    expect(component.form.controls['password'].errors?.['pattern']).toBeTruthy();
  });

  it('should not show error for valid password', () => {
    component.form.controls['password'].setValue('Abcdef1!');
    component.form.controls['password'].markAsTouched();
    fixture.detectChanges();
    expect(component.form.controls['password'].valid).toBeTrue();
  });

  it('should allow signup with no address', () => {
    component.form.controls['firstname']?.setValue('Test');
    component.form.controls['lastname']?.setValue('User');
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('Abcdef1!');
    component.form.controls['confirmPassword']?.setValue('Abcdef1!');
    component.form.controls['acceptTerms']?.setValue(true);

    const addressArray = component.form.get('address') as any;
    addressArray.clear();
    component.form.markAsDirty();
    component.form.markAsTouched();
    component.form.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
  });

  it('should allow signup with a valid address in the address array', () => {
    component.form.controls['firstname']?.setValue('Test');
    component.form.controls['lastname']?.setValue('User');
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('Abcdef1!');
    component.form.controls['confirmPassword']?.setValue('Abcdef1!');
    component.form.controls['acceptTerms']?.setValue(true);
    const addressArray = component.form.get('address') as any;
    addressArray.clear();
    addressArray.push(component.fb.group({
      street: ['123 Main St'],
      city: ['Testville'],
      provinceOrState: ['TestState'],
      code: ['12345'],
      country: ['TestCountry'],
    }));
    component.form.markAsDirty();
    component.form.markAsTouched();
    component.form.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
  });
});
