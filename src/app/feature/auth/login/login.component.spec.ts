import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { computed } from '@angular/core';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: jasmine.SpyObj<Store<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {provide: Store, useValue: jasmine.createSpyObj('Store', ['select', 'dispatch', 'selectSignal'])},
        {provide: ActivatedRoute, useValue: {}},
      ],
    })
      .compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
    store.selectSignal.and.callFake((selector: any) => {
      if (selector.name === 'selectAuthLoading') return computed(() => false);
      if (selector.name === 'selectAuthError') return computed(() => '');
      return computed(() => undefined as any);
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render email, password, and rememberMe fields', () => {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    const rememberMeCheckbox = fixture.debugElement.query(By.css('mat-checkbox'));
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(rememberMeCheckbox).toBeTruthy();
  });

  it('should show required error for empty email and password', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['email'].markAsTouched();
    component.form.controls['password'].setValue('');
    component.form.controls['password'].markAsTouched();
    fixture.detectChanges();
    expect(component.email.errors?.['required']).toBeTrue();
    expect(component.password.errors?.['required']).toBeTrue();
  });

  it('should show email format error for invalid email', () => {
    component.form.controls['email'].setValue('invalid-email');
    component.form.controls['email'].markAsTouched();
    fixture.detectChanges();
    expect(component.email.errors?.['email']).toBeTrue();
  });

  it('should disable submit button when form is invalid', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.disabled).toBeTrue();
  });

  it('should dispatch login action on valid form submit', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password123');
    fixture.detectChanges();
    component.form.markAsDirty();
    component.form.markAsTouched();
    fixture.nativeElement.querySelector('button[type="submit"]').click();
    expect(store.dispatch).toHaveBeenCalled();
  });
});
