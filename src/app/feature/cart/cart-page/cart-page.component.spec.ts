import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import * as CartActions from '../state/cart.actions';
import { selectCartHasItems } from '../state/cart.selectors';
import { CartPageComponent } from './cart-page.component';
import { selectAuthUserId } from '../../auth/state/auth.selectors';

describe('CartPageComponent', () => {
  let component: CartPageComponent;
  let fixture: ComponentFixture<CartPageComponent>;
  let store: MockStore;
  let router: Router;

  const initialState = {
    cart: {
      itemCount: 0,
      items: [],
      total: 0,
      userId: null,
      error: null,
    },
    auth: {
      user: {
        id: 1757590735311,
        // add other required user properties based on your auth state
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: selectAuthUserId,
              value: 1757590735311,
            },
          ],
        }),
        {provide: ActivatedRoute, useValue: {params: of({}), data: of({})}},
        provideHttpClientTesting(),
        {provide: Router, useValue: {navigate: jasmine.createSpy('navigate')}},
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CartPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    // Mock the selectAuthUserId selector properly
    store.overrideSelector(selectAuthUserId, 1757590735311);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty cart message when cart is empty', async () => {
    store.overrideSelector(selectCartHasItems, false);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Your cart is empty');
    expect(compiled.textContent).toContain('Explore Products');
  });

  it('should render cart and clear cart button when cart has items', async () => {
    store.overrideSelector(selectCartHasItems, true);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Your Cart');
    expect(compiled.textContent).toContain('Clear Cart');
  });

  it('should dispatch clearCart action when onClearCart is called', () => {
    const userId = 1757590735311;
    spyOn(store, 'dispatch');

    component.onClearCart();
    expect(store.dispatch).toHaveBeenCalledWith(CartActions.clearCart({userId}));
  });

  it('should show Explore Products button when cart is empty', async () => {
    store.overrideSelector(selectCartHasItems, false);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button[routerLink="/products"]');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Explore Products');
  });

  it('should show Clear Cart button when cart has items', async () => {
    store.overrideSelector(selectCartHasItems, true);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.delete-cta');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Clear Cart');
  });

  it('should not dispatch clearCart when user is not logged in', () => {
    // Override to return undefined (no user)
    store.overrideSelector(selectAuthUserId, undefined);
    store.refreshState();

    spyOn(store, 'dispatch');
    component.onClearCart();

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
