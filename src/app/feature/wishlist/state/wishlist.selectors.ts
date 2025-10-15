import { createSelector } from '@ngrx/store';
import { selectWishlistState } from './wishlist.reducer';

export const selectWishlist = createSelector(
  selectWishlistState,
  (state) => state,
)
export const selectWishlistItems = createSelector(
  selectWishlist,
  (state) => state.items,
);
export const selectWishlistItemCount = createSelector(
  selectWishlist,
  (state) => state.itemCount,
);
export const selectIsItemInWishlist = (productId: number) => createSelector(
  selectWishlistItems,
  (items) => items.some(item => item.productId === productId),
);
export const selectWishlistHasItems = createSelector(
  selectWishlist,
  (state) => state.itemCount > 0,
);

export const selectWishlistLoading = createSelector(
  selectWishlist,
  (state) => state.loading,
);

export const selectWishlistError = createSelector(
  selectWishlist,
  (state) => state.error,
)
