import { createReducer, on } from '@ngrx/store';
import { CartItem, CartState } from '../models/cart.model';
import * as CartActions from './cart.actions';

export const initialState: CartState = {
    userId: null,
    items: [],
    total: 0,
    itemCount: 0,
    error: null,
};

function calculateTotals(items: CartItem[]): {
    total: number;
    itemCount: number;
} {
    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    return {total, itemCount};
}

function validateCartItem(item: any): item is CartItem {
    return (
        item &&
        typeof item.productId === 'number' &&
        typeof item.quantity === 'number' &&
        typeof item.price === 'number' &&
        item.quantity > 0
    );
}

function validateCartItems(items: any[]): items is CartItem[] {
    return Array.isArray(items) && items.every(validateCartItem);
}

export const cartReducer = createReducer(
    initialState,

    on(CartActions.addToCart, (state, {product, userId}) => {
        if (!validateCartItem(product)) {
            return {...state, error: 'Invalid cart item'};
        }

        if (state.userId !== userId) {
            return {
                ...initialState,
                userId,
                items: [product],
                total: product.price * product.quantity,
                itemCount: product.quantity,
            };
        }

        const existingItemIndex = state.items.findIndex(
            i => i.productId === product.productId,
        );
        let updatedItems: CartItem[];

        if (existingItemIndex >= 0) {
            updatedItems = state.items.map((item, index) => {
                if (index === existingItemIndex) {
                    const qty = product.quantity + item.quantity;
                    const itemQty = qty < item.stock ? qty : item.stock;
                    return  {
                        ...item,
                        quantity: itemQty
                    }
                }
                return item;
            });
        } else {
            updatedItems = [...state.items, product];
        }

        const {total, itemCount} = calculateTotals(updatedItems);
        return {...state, items: updatedItems, total, itemCount, error: null};
    }),

    on(CartActions.removeFromCart, (state, {productId, userId}) => {
        if (state.userId !== userId) return state;

        const updatedItems = state.items.filter(
            (item) => item.productId !== productId,
        );
        const {total, itemCount} = calculateTotals(updatedItems);
        return {...state, items: updatedItems, total, itemCount, error: null};
    }),

    on(CartActions.clearCartOnLogout, (state, {userId}) => {
        if (state.userId !== userId) return state;

        return {...state, items: [], total: 0, itemCount: 0, error: null};
    }),

    on(
        CartActions.updateCartItemQuantity,
        (state, {productId, quantity, userId}) => {
            if (state.userId !== userId) return state;

            const updatedItems = state.items
                .map((item) => {
                    if (item.productId === productId) {
                        const qty = quantity + item.quantity;
                        const itemQty = qty < item.stock ? qty : item.stock;
                        return  {
                        ...item,
                            quantity: Math.max(0, itemQty)
                        }
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0);

            const {total, itemCount} = calculateTotals(updatedItems);
            return {...state, items: updatedItems, total, itemCount, error: null};
        },
    ),

    on(
        CartActions.setCartItemQuantity,
        (state, {productId, quantity, userId}) => {
            if (state.userId !== userId) return state;
            if (quantity < 0)
                return {...state, error: 'Quantity cannot be negative'};

            const updatedItems = state.items
                .map((item) =>
                    item.productId === productId
                        ? {...item, quantity: Math.max(0, quantity)}
                        : item,
                )
                .filter((item) => item.quantity > 0);

            const {total, itemCount} = calculateTotals(updatedItems);
            return {...state, items: updatedItems, total, itemCount, error: null};
        },
    ),

    on(CartActions.loadCartFromStorage, (state, {items, userId}) => {
        const validatedItems = validateCartItems(items) ? items : [];
        const {total, itemCount} = calculateTotals(validatedItems);
        return {
            ...state,
            userId,
            items: validatedItems,
            total,
            itemCount,
            error: null,
        };
    }),

    on(CartActions.clearCart, (state, {userId}) => {
        if (state.userId !== userId) return state;
        return {...state, items: [], total: 0, itemCount: 0, error: null};
    }),

    on(CartActions.switchUserCart, (state, {userId}) => {
        return {...state, userId};
    }),

    on(CartActions.loadCartFromStorageFailure, (state, {error}) => {
        return {...state, error, items: [], total: 0, itemCount: 0};
    }),
);

export const cartFeatureKey = 'cart';
