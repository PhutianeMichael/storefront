import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ProductListItemComponent } from './product-list-item.component';
import { Product } from '../models/product.model';
import * as CartActions from '../../cart/state/cart.actions';
import * as WishlistActions from '../../wishlist/state/wishlist.actions';
import * as ProductActions from '../state/product.actions';
import { of } from 'rxjs';

describe('ProductListItemComponent', () => {
  let component: ProductListItemComponent;
  let fixture: ComponentFixture<ProductListItemComponent>;
  let store: Store;
  let router: Router;
  let dialog: MatDialog;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 10,
    brand: 'Test Brand',
    category: 'beauty',
    thumbnail: 'test.jpg',
    images: ['test1.jpg', 'test2.jpg'],
    availabilityStatus: 'In Stock',
    sku: 'TEST-SKU',
    tags: ['test', 'sample'],
    reviews: [
      {
        rating: 5,
        comment: 'Great product!',
        date: '2023-01-01',
        reviewerName: 'John Doe',
        reviewerEmail: 'john@example.com'
      }
    ],
    weight: 1,
    dimensions: { width: 10, height: 10, depth: 10 },
    warrantyInformation: '1 year',
    shippingInformation: 'Free shipping',
    returnPolicy: '30 days',
    meta: {
      barcode: '123456789',
      qrCode: 'qr123',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    }
  };

  // Complete MatDialog mock
  const mockDialogRef = {
    componentInstance: {},
    afterClosed: () => of({ showReviews: false }),
    close: jasmine.createSpy('close')
  };

  const mockDialog = {
    open: jasmine.createSpy('open').and.returnValue(mockDialogRef),
    closeAll: jasmine.createSpy('closeAll'),
    getDialogById: jasmine.createSpy('getDialogById')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListItemComponent],
      providers: [
        provideMockStore({
          initialState: {
            auth: {
              user: { id: 123 }
            },
            cart: {
              items: [],
              total: 0,
              itemCount: 0,
              userId: 123
            },
            wishlist: {
              items: [],
              userId: 123
            },
            product: {
              entities: { 1: mockProduct },
              selectedProductId: null
            }
          }
        }),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: MatDialog, useValue: mockDialog }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListItemComponent);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);

    component = fixture.componentInstance;
    component.productInput = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Cart Actions - Logged In', () => {
    beforeEach(() => {
      // Set up logged in user
      Object.defineProperty(component, 'userId', {
        get: () => () => 123
      });
    });

    it('should dispatch updateCartItemQuantity when onIncreaseOrDecreaseItemQuantity is called', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onIncreaseOrDecreaseItemQuantity(1, 1);

      expect(dispatchSpy).toHaveBeenCalledWith(CartActions.updateCartItemQuantity({
        productId: 1,
        quantity: 1,
        userId: 123
      }));
    });

    it('should dispatch addToCart when onAddProductToCart is called', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onAddProductToCart(mockProduct);

      expect(dispatchSpy).toHaveBeenCalledWith(CartActions.addToCart({
        product: {
          productId: 1,
          title: 'Test Product',
          description: 'Test Description',
          price: 100,
          discountPercentage: 10,
          quantity: 1,
          thumbnail: 'test.jpg',
          stock: 10,
          availabilityStatus: 'In Stock',
          category: 'beauty',
          sku: 'TEST-SKU',
          code: '123456789'
        },
        userId: 123
      }));
    });
  });

  describe('Cart Actions - Logged Out', () => {
    beforeEach(() => {
      // Set up logged out user
      Object.defineProperty(component, 'userId', {
        get: () => () => undefined
      });
    });

    it('should navigate to login when adding to cart if no user', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.onAddProductToCart(mockProduct);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should navigate to login when updating quantity if no user', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.onIncreaseOrDecreaseItemQuantity(1, 1);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Wishlist Actions - Logged In', () => {
    beforeEach(() => {
      // Set up logged in user
      Object.defineProperty(component, 'userId', {
        get: () => () => 123
      });
    });

    it('should add to wishlist when item is not in wishlist', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      // Set item not in wishlist
      Object.defineProperty(component, 'isItemInWishlist', {
        get: () => () => false
      });

      component.onToggleWishlist(mockProduct);

      expect(dispatchSpy).toHaveBeenCalledWith(WishlistActions.addItemToWishlist({
        item: {
          productId: 1,
          title: 'Test Product',
          description: 'Test Description',
          stock: 10,
          availabilityStatus: 'In Stock',
          price: 100,
          thumbnail: 'test.jpg',
          category: 'beauty',
          discountPercentage: 10,
          code: '123456789',
          sku: 'TEST-SKU'
        },
        userId: 123
      }));
    });

    it('should remove from wishlist when item is already in wishlist', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      // Set item in wishlist
      Object.defineProperty(component, 'isItemInWishlist', {
        get: () => () => true
      });

      component.onToggleWishlist(mockProduct);

      expect(dispatchSpy).toHaveBeenCalledWith(WishlistActions.removeItemFromWishlist({
        productId: 1,
        userId: 123
      }));
    });
  });

  describe('Wishlist Actions - Logged Out', () => {
    beforeEach(() => {
      // Set up logged out user
      Object.defineProperty(component, 'userId', {
        get: () => () => undefined
      });
    });

    it('should navigate to login when toggling wishlist if no user', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.onToggleWishlist(mockProduct);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Utility Methods', () => {
    it('should calculate discounted price correctly', () => {
      const discountedPrice = component.calculateDiscountedPrice(100, 10);
      expect(discountedPrice).toBe(90);
    });

    it('should round numbers correctly', () => {
      expect(component.roundNum(4.5)).toBe(5);
      expect(component.roundNum(4.4)).toBe(4);
    });

    it('should ceil numbers correctly', () => {
      expect(component.ceilNum(4.1)).toBe(5);
      expect(component.ceilNum(4.9)).toBe(5);
    });

    it('should track stars correctly', () => {
      expect(component.trackStar(0, 1)).toBe(1);
      expect(component.trackStar(1, 2)).toBe(2);
    });
  });
});
