import { CartItem } from '../models/cart.model';
import { createAction, props } from '@ngrx/store';

export const enum CartActionTypes {
    ADD_TO_CART = '[Cart] Add to Cart',
    REMOVE_FROM_CART = '[Cart] Remove from Cart',
    UPDATE_CART_ITEM_QUANTITY = '[Cart] Update Cart Item Quantity',
    CLEAR_CART = '[Cart] Clear Cart',
    CLEAR_CART_ON_LOGOUT = '[Cart] Logout Clear Cart',
    SAVE_CART_TO_STORAGE = '[Cart] Save Cart to Storage',
    LOAD_CART_FROM_STORAGE = '[Cart] Load Cart from Storage',
    LOAD_CART_FROM_STORAGE_FAILURE = '[Cart] Load Cart From Storage Failure',
    LOAD_USER_CART = '[Cart] Load User Cart',
    SWITCH_USER_CART = '[Cart] Switch User Cart',
    APP_CART_INIT = '[App] Init',
    SET_CART_ITEM_QUANTITY = '[Cart] Set Cart Item Quantity',
}

export const CART_STORAGE_KEY = 'shopping_cart';

export const addToCart = createAction(
    CartActionTypes.ADD_TO_CART,
    props<{ product: CartItem; userId: number }>(),
);

export const removeFromCart = createAction(
    CartActionTypes.REMOVE_FROM_CART,
    props<{ productId: number; userId: number }>(),
);

export const clearCartOnLogout = createAction(
    CartActionTypes.CLEAR_CART_ON_LOGOUT,
    props<{ userId: number }>(),
);

export const updateCartItemQuantity = createAction(
    CartActionTypes.UPDATE_CART_ITEM_QUANTITY,
    props<{ productId: number; quantity: number; userId: number }>(),
);

export const setCartItemQuantity = createAction(
    CartActionTypes.SET_CART_ITEM_QUANTITY,
    props<{ productId: number; quantity: number; userId: number }>(),
);

export const clearCart = createAction(
    CartActionTypes.CLEAR_CART,
    props<{ userId: number }>(),
);

export const saveCartToStorage = createAction(
    CartActionTypes.SAVE_CART_TO_STORAGE,
    props<{ userId: number }>(),
);

export const loadCartFromStorage = createAction(
    CartActionTypes.LOAD_CART_FROM_STORAGE,
    props<{ items: CartItem[]; userId: number }>(),
);

export const loadCartFromStorageFailure = createAction(
    CartActionTypes.LOAD_CART_FROM_STORAGE_FAILURE,
    props<{ error: string }>(),
);

export const loadUserCart = createAction(
    CartActionTypes.LOAD_USER_CART,
    props<{ userId: number }>(),
);

export const switchUserCart = createAction(
    CartActionTypes.SWITCH_USER_CART,
    props<{ userId: number }>(),
);

export const appCartInit = createAction(CartActionTypes.APP_CART_INIT);
