import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductDetailsComponent } from './product-details.component';
import { Product } from '../models/product.model';
import * as CartActions from '../../cart/state/cart.actions';
import * as WishlistActions from '../../wishlist/state/wishlist.actions';
import { of } from 'rxjs';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let store: Store;
  let router: Router;

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

  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => '1',
      has: (key: string) => true,
      keys: ['id']
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        provideMockStore({
          initialState: {
            product: {
              entities: { 1: mockProduct },
              selectedProductId: 1,
              loading: false,
              loaded: true,
              error: null
            },
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
            }
          }
        }),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    component = fixture.componentInstance;
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

    it('should dispatch addToCart if user is logged in', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onAddItemToCart(mockProduct);

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

    it('should dispatch updateCartItemQuantity if user is logged in', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onIncreaseOrDecreaseItemQuantity(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CartActions.updateCartItemQuantity({
        productId: 1,
        quantity: 1,
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

      component.onAddItemToCart(mockProduct);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should navigate to login when updating quantity if no user', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.onIncreaseOrDecreaseItemQuantity(1);
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

      component.onAddOrRemoveItemFromFavourite(mockProduct);

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

      component.onAddOrRemoveItemFromFavourite(mockProduct);

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

      component.onAddOrRemoveItemFromFavourite(mockProduct);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Utility Methods', () => {
    it('should calculate discounted price correctly', () => {
      const discountedPrice = component.calculateDiscountedPrice(100, 10);
      expect(discountedPrice).toBe(90);
    });

    it('should get ratings per bar correctly', () => {
      const fiveStarCount = component.getRatingsPerBar(mockProduct.reviews, 5);
      expect(fiveStarCount).toBe(1);
    });

    it('should return correct bar class for star ratings', () => {
      expect(component.getBarClass(5)).toBe('five-star-bar');
      expect(component.getBarClass(4)).toBe('four-star-bar');
      expect(component.getBarClass(3)).toBe('three-star-bar');
      expect(component.getBarClass(2)).toBe('two-star-bar');
      expect(component.getBarClass(1)).toBe('one-star-bar');
    });

    it('should use Math functions correctly', () => {
      expect(component.mathRound(4.5)).toBe(5);
      expect(component.mathCeil(4.1)).toBe(5);
    });
  });

  describe('Navigation', () => {
    it('should navigate back to products', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.goBack();

      expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(Object)); // clearSelectedProduct action
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });
  });
});
