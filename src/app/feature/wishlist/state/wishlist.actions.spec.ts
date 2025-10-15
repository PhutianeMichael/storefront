import * as WishlistActions from './wishlist.actions';
import { WishlistItem } from '../models/wishlist.model';

describe('Wishlist Actions', () => {
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
  const userId = 123;
  it('should create addItemToWishlist action', () => {
    const action = WishlistActions.addItemToWishlist({ item, userId });
    expect(action.type).toBe(WishlistActions.WishlistActionTypes.ADD_TO_WISHLIST);
    expect(action.item).toEqual(item);
    expect(action.userId).toBe(userId);
  });
  it('should create removeItemFromWishlist action', () => {
    const action = WishlistActions.removeItemFromWishlist({ productId: item.productId, userId });
    expect(action.type).toBe(WishlistActions.WishlistActionTypes.REMOVE_ITEM);
    expect(action.productId).toBe(item.productId);
    expect(action.userId).toBe(userId);
  });
  it('should create clearWishlist action', () => {
    const action = WishlistActions.clearWishlist({ userId });
    expect(action.type).toBe(WishlistActions.WishlistActionTypes.CLEAR_WISHLIST);
    expect(action.userId).toBe(userId);
  });
  it('should create clearWishlistOnLogout action', () => {
    const action = WishlistActions.clearWishlistOnLogout({ userId });
    expect(action.type).toBe(WishlistActions.WishlistActionTypes.CLEAR_WISHLIST_LOGOUT);
    expect(action.userId).toBe(userId);
  });
  it('should create loadWishlistFromStorage action', () => {
    const action = WishlistActions.loadWishlistFromStorage({ items: [item], userId });
    expect(action.type).toBe(WishlistActions.WishlistActionTypes.LOAD_WISHLIST_FROM_STORAGE);
    expect(action.items).toEqual([item]);
    expect(action.userId).toBe(userId);
  });
  it('should create loadWishlistFromStorageFailure action', () => {
    const error = 'Failed to load';
    const action = WishlistActions.loadWishlistFromStorageFailure({ error });
    expect(action.type).toBe(WishlistActions.WishlistActionTypes.LOAD_WISHLIST_FROM_STORAGE_FAILURE);
    expect(action.error).toBe(error);
  });
  it('should create loadUserWishlist action', () => {
    const action = WishlistActions.loadUserWishlist({ userId });
    expect(action.type).toBe(WishlistActions.WishlistActionTypes.LOAD_USER_WISHLIST);
    expect(action.userId).toBe(userId);
  });
  it('should create saveWishlistToStorage action', () => {
    const action = WishlistActions.saveWishlistToStorage({ userId });
    expect(action.type).toBe(WishlistActions.WishlistActionTypes.SAVE_WISHLIST_TO_STORAGE);
    expect(action.userId).toBe(userId);
  });
  it('should create appWishlistInit action', () => {
    const action = WishlistActions.appWishlistInit();
    expect(action.type).toBe(WishlistActions.WishlistActionTypes.APP_WISHLIST_INIT);
  });
});

