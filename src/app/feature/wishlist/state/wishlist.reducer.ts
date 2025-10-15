import * as WishlistActions from './wishlist.actions';
import { createReducer, on } from '@ngrx/store';
import { WishlistState } from '../models/wishlist.model';
import { AppState } from '../../../app.state';

/**
 * The initial state for the wishlist feature.
 */
export const initialState: WishlistState = {
  userId: undefined,
  items: [],
  loading: false,
  error: null,
  itemCount: 0,
}

/**
 * The reducer function for the wishlist feature.
 * Handles all wishlist-related actions and updates the state accordingly.
 */
export const wishlistReducer = createReducer(
  initialState,

  on(WishlistActions.appWishlistInit, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(WishlistActions.loadUserWishlist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(WishlistActions.addItemToWishlist, (state, {item, userId}) => {
    if (state.userId === null || state.userId === undefined) {
      return {
        ...state,
        userId,
        items: [item],
        itemCount: 1,
        loading: false,
        error: null,
      };
    }
    if (state.userId !== userId) {
      return {
        ...initialState,
        userId,
        items: [item],
        itemCount: 1,
        loading: false,
        error: null,
      };
    }

    const exists = state.items.some(i => i.productId === item.productId);
    if (exists) {
      return {...state, loading: false};
    }
    const updatedItems = [...state.items, item];
    return {
      ...state,
      items: updatedItems,
      itemCount: updatedItems.length,
      loading: false,
      error: null,
    };
  }),

  on(WishlistActions.removeItemFromWishlist, (state, {productId, userId}) => {
    if (state.userId !== userId) return {...state, loading: false};

    const updatedItems = state.items.filter(item => item.productId !== productId);
    return {
      ...state,
      items: updatedItems,
      itemCount: updatedItems.length,
      loading: false,
    };
  }),

  on(WishlistActions.clearWishlistOnLogout, (state, {userId}) => {
    if (state.userId !== userId) return {...state, loading: false};
    return {...initialState, userId: undefined, loading: false};
  }),

  on(WishlistActions.clearWishlist, (state, {userId}) => {
    if (state.userId !== userId) return {...state, loading: false};
    return {
      ...state,
      items: [],
      itemCount: 0,
      loading: false,
    };
  }),

  on(WishlistActions.loadWishlistFromStorage, (state, {items, userId}) => {
    const validatedItems = Array.isArray(items) ? items : [];
    return {
      ...state,
      userId,
      items: validatedItems,
      itemCount: validatedItems.length,
      loading: false,
      error: null,
    };
  }),

  on(WishlistActions.loadWishlistFromStorageFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  on(
    WishlistActions.saveWishlistToStorage,
    (state) => ({
      ...state,
      loading: false,
    }),
  ),
);

/**
 * The feature key for the wishlist state in the store.
 */
export const wishlistFeatureKey = 'wishlist';

export const selectWishlistState = (state: AppState) => state.wishlist;
