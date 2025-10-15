import { TestBed } from '@angular/core/testing';
import { WishlistStorageService } from './wishlist-storage.service';
import { Wishlist } from '../models/wishlist.model';

describe('WishlistStorageService', () => {
  let service: WishlistStorageService;
  const userId = 12345;
  const wishlist: Wishlist = {
    userId,
    items: [
      {
        productId: 1,
        title: 'Test Product',
        description: 'desc',
        category: 'beauty',
        price: 10,
        discountPercentage: 0,
        stock: 5,
        sku: 'SKU',
        availabilityStatus: 'In Stock',
        code: 'CODE',
        thumbnail: 'thumb.jpg',
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WishlistStorageService]
    });
    service = TestBed.inject(WishlistStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save wishlist for a user and retrieve it', () => {
    service.saveUserWishlist(userId, wishlist);
    const loaded = service.loadUserWishlist(userId);
    expect(loaded).toEqual(wishlist);
  });

  it('should overwrite an existing wishlist for the same user', () => {
    service.saveUserWishlist(userId, wishlist);
    const updatedWishlist: Wishlist = {
      userId,
      items: [{
        productId: 2,
        title: 'Updated Product',
        description: 'desc',
        category: 'beauty',
        price: 20,
        discountPercentage: 0,
        stock: 10,
        sku: 'SKU2',
        availabilityStatus: 'In Stock',
        code: 'CODE2',
        thumbnail: 'thumb2.jpg',
      }]
    };
    service.saveUserWishlist(userId, updatedWishlist);
    const loaded = service.loadUserWishlist(userId);
    expect(loaded).toEqual(updatedWishlist);
    expect(loaded?.items[0].productId).toBe(2);
  });

  it('should handle saving when localStorage is empty', () => {
    localStorage.clear();
    service.saveUserWishlist(userId, wishlist);
    const loaded = service.loadUserWishlist(userId);
    expect(loaded).toEqual(wishlist);
  });

  it('should handle localStorage errors gracefully when saving', () => {
    spyOn(localStorage, 'setItem').and.throwError('Storage error');
    spyOn(console, 'error');

    expect(() => {
      service.saveUserWishlist(userId, wishlist);
    }).toThrowError('Failed to save wishlist');

    expect(console.error).toHaveBeenCalledWith('Error saving wishlist to localStorage:', jasmine.any(Error));
  });

  it('should not save if wishlist is undefined', () => {
    spyOn(console, 'warn');
    service.saveUserWishlist(userId, undefined as any);
    expect(console.warn).toHaveBeenCalledWith('Attempted to save undefined wishlist');

    const loaded = service.loadUserWishlist(userId);
    expect(loaded).toBeNull();
  });

  it('should load null if wishlist for userId is missing', () => {
    service.saveUserWishlist(userId, wishlist);
    const loaded = service.loadUserWishlist(99999);
    expect(loaded).toBeNull();
  });

  it('should handle loading when localStorage is empty', () => {
    localStorage.clear();
    const loaded = service.loadUserWishlist(userId);
    expect(loaded).toBeNull();
  });

  it('should handle corrupted localStorage gracefully when loading', () => {
    localStorage.setItem('wishlist', 'corrupted');
    spyOn(console, 'error');

    expect(() => service.loadUserWishlist(userId)).toThrowError('Failed to load wishlist');
    expect(console.error).toHaveBeenCalledWith('Error loading wishlist from localStorage:', jasmine.any(SyntaxError));
  });

  it('should return correct wishlist when multiple users are present', () => {
    const otherUserId = 54321;
    const otherWishlist: Wishlist = {
      userId: otherUserId,
      items: [{
        productId: 99,
        title: 'Other Product',
        description: 'desc',
        category: 'beauty',
        price: 99,
        discountPercentage: 0,
        stock: 1,
        sku: 'SKU99',
        availabilityStatus: 'In Stock',
        code: 'CODE99',
        thumbnail: 'thumb99.jpg',
      }]
    };

    service.saveUserWishlist(userId, wishlist);
    service.saveUserWishlist(otherUserId, otherWishlist);

    const loaded1 = service.loadUserWishlist(userId);
    const loaded2 = service.loadUserWishlist(otherUserId);

    expect(loaded1?.userId).toBe(userId);
    expect(loaded2?.userId).toBe(otherUserId);
    expect(loaded1?.items[0].productId).toBe(1);
    expect(loaded2?.items[0].productId).toBe(99);
  });

  it('should handle partial wishlist data gracefully', () => {
    const partialData = {
      userId,
      items: [{
        productId: 1,
        title: 'Test',
      }]
    };

    localStorage.setItem('wishlist', JSON.stringify({ [userId]: partialData }));

    const loaded = service.loadUserWishlist(userId);
    expect(loaded).toEqual({
      userId,
      items: [{
        productId: 1,
        title: 'Test',
        description: '',
        category: '',
        price: 0,
        discountPercentage: 0,
        stock: 0,
        sku: '',
        availabilityStatus: '',
        code: '',
        thumbnail: '',
      }]
    });
  });

  it('should handle complex wishlist with multiple items', () => {
    const complexWishlist: Wishlist = {
      userId,
      items: [
        {
          productId: 1,
          title: 'A', description: '', category: '', price: 1, discountPercentage: 0, stock: 1, sku: '', availabilityStatus: '', code: '', thumbnail: ''
        },
        {
          productId: 2,
          title: 'B', description: '', category: '', price: 2, discountPercentage: 0, stock: 2, sku: '', availabilityStatus: '', code: '', thumbnail: ''
        },
        {
          productId: 3,
          title: 'C', description: '', category: '', price: 3, discountPercentage: 0, stock: 3, sku: '', availabilityStatus: '', code: '', thumbnail: ''
        }
      ]
    };

    service.saveUserWishlist(userId, complexWishlist);
    const loaded = service.loadUserWishlist(userId);

    expect(loaded?.items.length).toBe(3);
    expect(loaded?.items.map(i => i.productId)).toEqual([1, 2, 3]);
  });

  it('should handle empty items array', () => {
    const emptyWishlist: Wishlist = {
      userId,
      items: []
    };

    service.saveUserWishlist(userId, emptyWishlist);
    const loaded = service.loadUserWishlist(userId);

    expect(loaded?.items).toEqual([]);
    expect(loaded?.items.length).toBe(0);
  });

  it('should handle non-array items data', () => {
    const invalidData = {
      userId,
      items: 'not-an-array'
    };

    localStorage.setItem('wishlist', JSON.stringify({ [userId]: invalidData }));

    const loaded = service.loadUserWishlist(userId);
    expect(loaded?.items).toEqual([]);
  });

  it('should handle missing userId in stored data', () => {
    const dataWithoutUserId = {
      items: [{
        productId: 1,
        title: 'Test Product',
        description: 'desc',
        category: 'beauty',
        price: 10,
        discountPercentage: 0,
        stock: 5,
        sku: 'SKU',
        availabilityStatus: 'In Stock',
        code: 'CODE',
        thumbnail: 'thumb.jpg',
      }]
    };

    localStorage.setItem('wishlist', JSON.stringify({ [userId]: dataWithoutUserId }));

    const loaded = service.loadUserWishlist(userId);
    expect(loaded?.userId).toBe(userId);
    expect(loaded?.items[0].productId).toBe(1);
  });
});
