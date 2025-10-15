import { cartReducer, initialState } from './cart.reducer';
import * as CartActions from './cart.actions';
import { CartItem, CartState } from '../models/cart.model';

describe('Cart Reducer', () => {
  const userId = 1;
    const product: CartItem = {
        productId: 101,
        title: 'Test Product',
        price: 99.99,
        quantity: 2,
        stock: 10,
        thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp',
        description: 'desc',
        discountPercentage: 0,
        availabilityStatus: 'In Stock',
        category: 'beauty',
        sku: 'BEA-CHI-LIP-004',
        code: '9467746727219',
    };

  it('should return the initial state', () => {
    const state = cartReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(initialState);
  });

  it('should add item to cart for new user', () => {
    const action = CartActions.addToCart({ product, userId });
    const state = cartReducer(initialState, action);
    expect(state.items.length).toBe(1);
    expect(state.items[0]).toEqual(product);
    expect(state.userId).toBe(userId);
    expect(state.total).toBe(product.price * product.quantity);
    expect(state.itemCount).toBe(product.quantity);
  });

  it('should add item to cart for same user', () => {
    const prevState: CartState = { ...initialState, userId, items: [product], total: product.price * product.quantity, itemCount: product.quantity, error: null };
    const newProduct = { ...product, productId: 102 };
    const action = CartActions.addToCart({ product: newProduct, userId });
    const state = cartReducer(prevState, action);
    expect(state.items.length).toBe(2);
    expect(state.items[1]).toEqual(newProduct);
    expect(state.userId).toBe(userId);
  });

  it('should update quantity if product already exists', () => {
    const prevState: CartState = { ...initialState, userId, items: [product], total: product.price * product.quantity, itemCount: product.quantity, error: null };
    const action = CartActions.addToCart({ product: { ...product, quantity: 1 }, userId });
    const state = cartReducer(prevState, action);
    expect(state.items[0].quantity).toBe(product.quantity + 1);
  });

  it('should not add invalid cart item', () => {
    const invalidProduct = { ...product, price: undefined };
    const action = CartActions.addToCart({ product: invalidProduct as any, userId });
    const state = cartReducer(initialState, action);
    expect(state.error).toBe('Invalid cart item');
  });

  it('should remove item from cart', () => {
    const prevState: CartState = { ...initialState, userId, items: [product], total: product.price * product.quantity, itemCount: product.quantity, error: null };
    const action = CartActions.removeFromCart({ productId: product.productId, userId });
    const state = cartReducer(prevState, action);
    expect(state.items.length).toBe(0);
    expect(state.total).toBe(0);
    expect(state.itemCount).toBe(0);
  });

  it('should update item quantity', () => {
    const prevState: CartState = { ...initialState, userId, items: [product], total: product.price * product.quantity, itemCount: product.quantity, error: null };
    const action = CartActions.updateCartItemQuantity({ productId: product.productId, quantity: -product.quantity, userId });
    const state = cartReducer(prevState, action);
    expect(state.items.length).toBe(0);
    expect(state.itemCount).toBe(0);
  });

  it('should not update quantity below 1', () => {
    const prevState: CartState = { ...initialState, userId, items: [product], total: product.price * product.quantity, itemCount: product.quantity, error: null };
    const action = CartActions.updateCartItemQuantity({ productId: product.productId, quantity: -product.quantity - 1, userId });
    const state = cartReducer(prevState, action);
    expect(state.items.length).toBe(0);
    expect(state.itemCount).toBe(0);
  });

  it('should clamp quantity to stock when updating cart item quantity', () => {
    const prevState: CartState = {
      ...initialState,
      userId,
      items: [{ ...product, quantity: 8, stock: 10 }],
      total: product.price * 2,
      itemCount: 2,
      error: null
    };

    const action = CartActions.updateCartItemQuantity({ productId: 101, quantity: 5, userId });
    const state = cartReducer(prevState, action);
    expect(state.items[0].quantity).toBe(10);
  });
});
