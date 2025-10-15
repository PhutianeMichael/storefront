import { CartStorageService } from './cartStorage.service';
import { CartState } from '../models/cart.model';
import { CART_STORAGE_KEY } from '../state/cart.actions';

describe('CartStorageService', () => {
  let service: CartStorageService;
  let mockLocalStorage: { [key: string]: string };

  const userId = 1;
  const cart: Partial<CartState> = {
    userId,
    items: [{ productId: 101, title: 'Test', price: 10, quantity: 1, stock: 5, thumbnail: '', description: '', discountPercentage: 0, availabilityStatus: 'In Stock', category: '', sku: '', code: '' }],
    total: 10,
    itemCount: 1,
    error: null
  };

  beforeEach(() => {
    service = new CartStorageService();
    mockLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => { mockLocalStorage[key] = value; });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => { delete mockLocalStorage[key]; });
  });

  it('should save user cart to localStorage', () => {
    service.saveUserCart(userId, cart);
    const stored = JSON.parse(mockLocalStorage[CART_STORAGE_KEY]);
    expect(stored[userId]).toEqual(cart);
  });

  it('should load user cart from localStorage', () => {
    mockLocalStorage[CART_STORAGE_KEY] = JSON.stringify({ [userId]: cart });
    const loaded = service.loadUserCart(userId);
    expect(loaded).toEqual(cart);
  });

  it('should return null if user cart does not exist', () => {
    mockLocalStorage[CART_STORAGE_KEY] = JSON.stringify({});
    const loaded = service.loadUserCart(userId);
    expect(loaded).toBeNull();
  });

  it('should load all carts from localStorage', () => {
    mockLocalStorage[CART_STORAGE_KEY] = JSON.stringify({ [userId]: cart, 2: { userId: 2, items: [], total: 0, itemCount: 0 } });
    const all = service.loadAllCarts();
    expect(all[userId]).toEqual(cart);
    expect(all[2]).toEqual({ userId: 2, items: [], total: 0, itemCount: 0 });
  });

  it('should clear user cart from localStorage', () => {
    mockLocalStorage[CART_STORAGE_KEY] = JSON.stringify({ [userId]: cart });
    service.clearUserCart(userId);
    const stored = JSON.parse(mockLocalStorage[CART_STORAGE_KEY]);
    expect(stored[userId]).toBeUndefined();
  });

  it('should handle error when saving cart', () => {
    (localStorage.setItem as jasmine.Spy).and.callFake(() => { throw new Error('Storage error'); });
    expect(() => service.saveUserCart(userId, cart)).toThrowError('Failed to save cart');
    (localStorage.setItem as jasmine.Spy).and.callFake((key: string, value: string) => { mockLocalStorage[key] = value; });
  });

  it('should handle error when loading cart', () => {
    (localStorage.getItem as jasmine.Spy).and.callFake(() => { throw new Error('Storage error'); });
    expect(() => service.loadUserCart(userId)).toThrowError('Failed to load cart');
    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => mockLocalStorage[key] || null);
  });

  it('should handle error when loading all carts', () => {
    (localStorage.getItem as jasmine.Spy).and.callFake(() => { throw new Error('Storage error'); });
    expect(service.loadAllCarts()).toEqual({});
    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => mockLocalStorage[key] || null);
  });

  it('should handle error when clearing cart', () => {
    (localStorage.setItem as jasmine.Spy).and.callFake(() => { throw new Error('Storage error'); });
    expect(() => service.clearUserCart(userId)).toThrowError('Failed to clear cart');
    (localStorage.setItem as jasmine.Spy).and.callFake((key: string, value: string) => { mockLocalStorage[key] = value; });
  });
});
