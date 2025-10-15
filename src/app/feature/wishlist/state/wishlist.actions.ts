import { createAction, props } from '@ngrx/store';
import { WishlistItem } from '../models/wishlist.model';

export const WishlistActionTypes = {
  ADD_TO_WISHLIST: '[Wishlist] Add to Wishlist',
  REMOVE_ITEM: '[Wishlist] Remove Item',
  CLEAR_WISHLIST: '[Wishlist] Clear Wishlist',
  CLEAR_WISHLIST_LOGOUT: '[Wishlist] Logout Clear Wishlist',
  LOAD_WISHLIST_FROM_STORAGE: '[Wishlist] Load Wishlist From Storage',
  LOAD_WISHLIST_FROM_STORAGE_FAILURE: '[Wishlist] Load Wishlist From Storage Failure',
  LOAD_USER_WISHLIST: '[Wishlist] Load User Wishlist',
  SAVE_WISHLIST_TO_STORAGE: '[Wishlist] Save Wishlist to Storage',
  APP_WISHLIST_INIT: '[Wishlist] App Wishlist Init',
}

export const WISHLIST_STORAGE_KEY = 'wishlist';
export const addItemToWishlist = createAction(
  WishlistActionTypes.ADD_TO_WISHLIST,
  props<{ item: WishlistItem, userId: number }>(),
);
export const removeItemFromWishlist = createAction(
  WishlistActionTypes.REMOVE_ITEM,
  props<{ productId: number, userId: number }>(),
);
export const clearWishlist = createAction(
  WishlistActionTypes.CLEAR_WISHLIST,
  props<{ userId: number }>(),
);
export const clearWishlistOnLogout = createAction(
  WishlistActionTypes.CLEAR_WISHLIST_LOGOUT,
  props<{ userId: number }>(),
);

export const loadWishlistFromStorage = createAction(
  WishlistActionTypes.LOAD_WISHLIST_FROM_STORAGE,
  props<{ items: WishlistItem[]; userId: number }>(),
);

export const loadWishlistFromStorageFailure = createAction(
  WishlistActionTypes.LOAD_WISHLIST_FROM_STORAGE_FAILURE,
  props<{ error: string }>(),
);

export const loadUserWishlist = createAction(
  WishlistActionTypes.LOAD_USER_WISHLIST,
  props<{ userId: number }>(),
);

export const saveWishlistToStorage = createAction(
  WishlistActionTypes.SAVE_WISHLIST_TO_STORAGE,
  props<{ userId: number }>(),
);

export const appWishlistInit = createAction(
  WishlistActionTypes.APP_WISHLIST_INIT,
);
