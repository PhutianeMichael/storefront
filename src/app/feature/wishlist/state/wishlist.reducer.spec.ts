import { WishlistItem, WishlistState } from '../models/wishlist.model';
import * as WishlistActions from './wishlist.actions';
import { initialState, wishlistReducer } from './wishlist.reducer';

describe('Wishlist Reducer - Loading States', () => {
  const userId = 123;
  const item: WishlistItem = {
    productId: 1,
    title: 'Test',
    description: '',
    category: '',
    price: 1,
    discountPercentage: 0,
    stock: 1,
    sku: '',
    availabilityStatus: '',
    code: '',
    thumbnail: ''
  };

  it('should set loading to true on appWishlistInit', () => {
    const action = WishlistActions.appWishlistInit();
    const state = wishlistReducer(initialState, action);
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should set loading to true on loadUserWishlist', () => {
    const action = WishlistActions.loadUserWishlist({ userId });
    const state = wishlistReducer(initialState, action);
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should set loading to false and clear error on successful addItemToWishlist', () => {
    const prevState: WishlistState = {
      ...initialState,
      loading: true,
      error: 'Previous error'
    };
    const action = WishlistActions.addItemToWishlist({ item, userId });
    const state = wishlistReducer(prevState, action);

    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('should set loading to false on removeItemFromWishlist', () => {
    const prevState: WishlistState = {
      ...initialState,
      userId,
      items: [item],
      loading: true
    };
    const action = WishlistActions.removeItemFromWishlist({ productId: item.productId, userId });
    const state = wishlistReducer(prevState, action);

    expect(state.loading).toBeFalse();
  });

  it('should set loading to false on clearWishlist', () => {
    const prevState: WishlistState = {
      ...initialState,
      userId,
      items: [item],
      loading: true
    };
    const action = WishlistActions.clearWishlist({ userId });
    const state = wishlistReducer(prevState, action);

    expect(state.loading).toBeFalse();
  });

  it('should set loading to false and clear error on successful loadWishlistFromStorage', () => {
    const prevState: WishlistState = {
      ...initialState,
      loading: true,
      error: 'Previous error'
    };
    const action = WishlistActions.loadWishlistFromStorage({ items: [item], userId });
    const state = wishlistReducer(prevState, action);

    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('should set loading to false and set error on loadWishlistFromStorageFailure', () => {
    const prevState: WishlistState = { ...initialState, loading: true };
    const action = WishlistActions.loadWishlistFromStorageFailure({ error: 'Load failed' });
    const state = wishlistReducer(prevState, action);

    expect(state.loading).toBeFalse();
    expect(state.error).toBe('Load failed');
  });

  it('should set loading to false on saveWishlistToStorage', () => {
    const prevState: WishlistState = { ...initialState, loading: true };
    const action = WishlistActions.saveWishlistToStorage({ userId });
    const state = wishlistReducer(prevState, action);

    expect(state.loading).toBeFalse();
  });

  it('should set loading to false on clearWishlistOnLogout', () => {
    const prevState: WishlistState = {
      ...initialState,
      userId,
      items: [item],
      loading: true
    };
    const action = WishlistActions.clearWishlistOnLogout({ userId });
    const state = wishlistReducer(prevState, action);

    expect(state.loading).toBeFalse();
  });

  it('should maintain loading state when not changing user in addItemToWishlist', () => {
    const prevState: WishlistState = {
      ...initialState,
      userId: 999,
      items: [item],
      loading: true
    };
    const action = WishlistActions.addItemToWishlist({ item, userId: 123 });
    const state = wishlistReducer(prevState, action);

    expect(state.loading).toBeFalse();
    expect(state.userId).toBe(123);
  });

  it('should maintain loading state when not authorized in removeItemFromWishlist', () => {
    const prevState: WishlistState = {
      ...initialState,
      userId: 123,
      items: [item],
      loading: true
    };
    const action = WishlistActions.removeItemFromWishlist({ productId: item.productId, userId: 999 });
    const state = wishlistReducer(prevState, action);

    expect(state.loading).toBeFalse();
    expect(state.items.length).toBe(1);
  });
});
