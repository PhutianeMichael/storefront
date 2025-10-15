import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { CartEffects } from './cart.effects';
import * as CartActions from './cart.actions';
import { CartStorageService } from '../services/cartStorage.service';
import { CartItem } from '../models/cart.model';
import { provideMockStore } from '@ngrx/store/testing';

describe('CartEffects', () => {
  let actions$: Observable<any>;
  let effects: CartEffects;
  let cartStorageSpy: jasmine.SpyObj<CartStorageService>;

  const userId = 1;
  const product: CartItem = {
    productId: 101,
    title: 'Test Product',
    price: 99.99,
    quantity: 2,
    stock: 10,
    thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp',
    description: 'desc',
    discountPercentage: 0,
    availabilityStatus: 'In Stock',
    category: 'beauty',
    sku: 'BEA-CHI-LIP-004',
    code: '9467746727219',
  };

  beforeEach(() => {
    cartStorageSpy = jasmine.createSpyObj('CartStorageService', ['saveUserCart', 'loadUserCart']);
    TestBed.configureTestingModule({
      providers: [
        CartEffects,
        provideMockActions(() => actions$),
        { provide: CartStorageService, useValue: cartStorageSpy },
        provideMockStore({
          initialState: {
            cart: {
              userId: 1,
              items: [],
              total: 0,
              itemCount: 0,
              error: null
            },
            auth: {
              user: { id: 1 }
            }
          }
        })
      ]
    });
    effects = TestBed.inject(CartEffects);
  });

  it('should save cart to storage on addToCart', (done) => {
    cartStorageSpy.saveUserCart.and.stub();
    actions$ = of(CartActions.addToCart({ product, userId }));
    effects.saveCartToStorage$.subscribe(() => {
      expect(cartStorageSpy.saveUserCart).toHaveBeenCalled();
      done();
    });
  });

  it('should load cart from storage on appCartInit', (done) => {
    cartStorageSpy.loadUserCart.and.returnValue({ items: [product], total: 199.98, itemCount: 2 });
    actions$ = of(CartActions.appCartInit());
    effects.loadCartOnAppInit$.subscribe(action => {
      expect(action).toEqual(jasmine.objectContaining({ items: [product], userId: userId }));
      expect('error' in action).toBeFalse();
      done();
    });
  });

  it('should handle error when loading cart from storage', (done) => {
    cartStorageSpy.loadUserCart.and.throwError('Storage error');
    actions$ = of(CartActions.appCartInit());
    effects.loadCartOnAppInit$.subscribe(action => {
      expect(action.type).toBe(CartActions.CartActionTypes.LOAD_CART_FROM_STORAGE_FAILURE);
      done();
    });
  });
});
