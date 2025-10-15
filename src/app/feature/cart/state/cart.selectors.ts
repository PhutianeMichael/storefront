import { createSelector } from '@ngrx/store';
import { CartItem } from '../models/cart.model';
import { selectCartState } from './cart.reducer';

const calculateItemSubTotal = (
    quantity: number,
    price: number,
    discountPercentage: number | undefined,
): number => {
    return discountPercentage
        ? quantity * price * (1 - discountPercentage / 100)
        : quantity * price;
}

export const selectCart = createSelector(
    selectCartState,
    (state) => state,
);

export const selectCartItemCount = createSelector(
    selectCart,
    (state) => state.itemCount,
);

export const selectCartTotal = createSelector(
    selectCart,
    (state) => state.total,
);

export const selectCartItems = createSelector(
    selectCart,
    (state) => state.items,
);

export const selectCartError = createSelector(
    selectCart,
    (state) => state.error,
);

export const selectCartUserId = createSelector(
    selectCart,
    (state) => state.userId,
);

export const selectCartItemById = (productId: number) => createSelector(
    selectCartItems,
    (items: CartItem[]) => items.find(item => item.productId === productId),
);

export const selectIsCurrentUserCart = (userId: number) => createSelector(
    selectCartUserId,
    (cartUserId) => cartUserId === userId,
);

export const selectIsProductInCart = (productId: number) => createSelector(
    selectCartItemById(productId),
    (item) => !!item,
);

export const selectCartItemQuantity = (productId: number) => createSelector(
    selectCartItemById(productId),
    (item) => item ? item.quantity : 0,
);

export const selectCartItemSubTotal = (productId: number) => createSelector(
    selectCartItemById(productId),
    (item) => item ? calculateItemSubTotal(item.quantity, item.price, item.discountPercentage) : 0,
);

export const selectCartHasItems = createSelector(
    selectCartItemCount,
    (itemCount) => itemCount > 0,
);

export const selectCartIsEmpty = createSelector(
    selectCartItemCount,
    (itemCount) => itemCount === 0,
);
