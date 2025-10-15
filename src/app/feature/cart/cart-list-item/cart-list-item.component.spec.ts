import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CartListItemComponent } from './cart-list-item.component';
import { CartItem } from '../models/cart.model';
import * as CartActions from '../state/cart.actions';
import { selectAuthUserId } from '../../auth/state/auth.selectors';
import { of } from 'rxjs';

describe('CartListItemComponent', () => {
  let component: CartListItemComponent;
  let fixture: ComponentFixture<CartListItemComponent>;
  let store: Store;
  let router: Router;

  const mockCartItem: CartItem = {
    productId: 1,
    title: 'Test Product',
    description: 'Test Description',
    thumbnail: 'test.jpg',
    stock: 5,
    availabilityStatus: 'In Stock',
    price: 100,
    quantity: 2,
    category: 'beauty',
    sku: 'URT-IFG-SER',
    code: '4585156843654',
  };

  // Create a factory function for the component that allows setting userId
  const createComponent = (userId: number | undefined) => {
    // Configure TestBed with the specific userId
    TestBed.configureTestingModule({
      imports: [CartListItemComponent],
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              items: [mockCartItem],
              itemCount: 1,
              total: 100,
              userId: 1757590735311,
            },
            auth: {
              user: userId ? {
                id: userId,
                email: 'test@example.com',
                name: 'Test User'
              } : null,
              isLoading: false,
              error: null
            }
          }
        }),
        provideHttpClientTesting(),
        {provide: Router, useValue: {navigate: jasmine.createSpy('navigate')}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartListItemComponent);
    store = TestBed.inject(Store);

    // Mock selectSignal to return the specific userId
    (store as any).selectSignal = jasmine.createSpy('selectSignal').and.callFake((selector: any) => {
      if (selector === selectAuthUserId) {
        return () => userId;
      }
      // For other selectors used in initSignal
      if (selector && (selector.name === 'selectCartItemSubTotal' || selector === 'selectCartItemSubTotal')) {
        return () => 200; // Mock subtotal
      }
      if (selector && (selector.name === 'selectCartItemQuantity' || selector === 'selectCartItemQuantity')) {
        return () => 2; // Mock quantity
      }
      return () => undefined;
    });

    // Mock regular select for other selectors
    spyOn(store, 'select').and.returnValue(of(undefined));

    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    component.cartItemInput = mockCartItem;
    fixture.detectChanges();

    return { component, fixture, store, router };
  };

  describe('when user is logged in', () => {
    beforeEach(() => {
      createComponent(1757590735311);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render cart item details', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Test Product');
      expect(compiled.textContent).toContain('Test Description');
      expect(compiled.textContent).toContain('In Stock');
    });

    it('should call onRemove and dispatch action if userId exists', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onRemove();
      expect(dispatchSpy).toHaveBeenCalledWith(CartActions.removeFromCart({productId: 1, userId: 1757590735311}));
    });

    it('should call onQuantityChange and dispatch action with clamped quantity', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onQuantityChange(10, 5);
      expect(dispatchSpy).toHaveBeenCalledWith(CartActions.setCartItemQuantity({
        productId: 1,
        quantity: 5,
        userId: 123,
      }));
    });
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      createComponent(undefined);
    });

    it('should call onRemove and navigate to login if no userId', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onRemove();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should call onQuantityChange and navigate to login if no userId', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onQuantityChange(2, 5);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('common tests', () => {
    beforeEach(() => {
      createComponent(1757590735311);
    });

    it('should return correct stock status class', () => {
      expect(component.itemStockStatus('In Stock')).toBe('cart-item__enough-stock-status');
      expect(component.itemStockStatus('Low Stock')).toBe('cart-item__low-stock-status');
    });

    describe('getQuantityOptions', () => {
      it('should return empty array if stock < 1', () => {
        expect(component.getQuantityOptions(0)).toEqual([]);
        expect(component.getQuantityOptions(-5)).toEqual([]);
      });

      it('should return options 1 to stock if stock is 1-9 (no 10+)', () => {
        expect(component.getQuantityOptions(5).map(o => o.value)).toEqual([1, 2, 3, 4, 5]);
        expect(component.getQuantityOptions(9).map(o => o.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });

      it('should return options 1-10 if stock is 10 (no 10+)', () => {
        expect(component.getQuantityOptions(10).map(o => o.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      it('should return options 1-10 and 10+ if stock > 10', () => {
        const options = component.getQuantityOptions(12).map(o => o.value);
        expect(options).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      it('should add currentQuantity to options if not present', () => {
        const options = component.getQuantityOptions(5, 7).map(o => o.value);
        expect(options).toContain(7);
      });

      it('should add currentQuantity > stock to options', () => {
        const options = component.getQuantityOptions(5, 8).map(o => o.value);
        expect(options).toContain(8);
        expect(options.filter(v => v > 5)).toEqual([8]);
      });

      it('should not allow options above stock except currentQuantity', () => {
        const options = component.getQuantityOptions(5, 8);
        expect(options.every(opt => opt.value <= 5 || opt.value === 8)).toBeTrue();
      });

      it('should show 10+ only if stock > 10', () => {
        const options9 = component.getQuantityOptions(9).map(o => o.label);
        expect(options9).not.toContain('10+');
        const options10 = component.getQuantityOptions(10).map(o => o.label);
        expect(options10).not.toContain('10+');
        const options11 = component.getQuantityOptions(11).map(o => o.label);
        expect(options11).toContain('10+');
      });
    });

    it('should have a stub for onMoveToList', () => {
      expect(component.onMoveToList).toBeDefined();
    });
  });
});
