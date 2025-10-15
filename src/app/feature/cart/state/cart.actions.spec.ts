import * as CartActions from './cart.actions';
import { CartItem } from '../models/cart.model';

describe('Cart Actions', () => {
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

  it('should create addToCart action', () => {
    const action = CartActions.addToCart({ product, userId });
    expect(action.type).toBe(CartActions.CartActionTypes.ADD_TO_CART);
    expect(action.product).toEqual(product);
    expect(action.userId).toBe(userId);
  });

  it('should create removeFromCart action', () => {
    const action = CartActions.removeFromCart({ productId: product.productId, userId });
    expect(action.type).toBe(CartActions.CartActionTypes.REMOVE_FROM_CART);
    expect(action.productId).toBe(product.productId);
    expect(action.userId).toBe(userId);
  });

  it('should create updateCartItemQuantity action', () => {
    const action = CartActions.updateCartItemQuantity({ productId: product.productId, quantity: 5, userId });
    expect(action.type).toBe(CartActions.CartActionTypes.UPDATE_CART_ITEM_QUANTITY);
    expect(action.productId).toBe(product.productId);
    expect(action.quantity).toBe(5);
    expect(action.userId).toBe(userId);
  });

  it('should create setCartItemQuantity action', () => {
    const action = CartActions.setCartItemQuantity({ productId: product.productId, quantity: 3, userId });
    expect(action.type).toBe(CartActions.CartActionTypes.SET_CART_ITEM_QUANTITY);
    expect(action.productId).toBe(product.productId);
    expect(action.quantity).toBe(3);
    expect(action.userId).toBe(userId);
  });

  it('should create clearCart action', () => {
    const action = CartActions.clearCart({ userId });
    expect(action.type).toBe(CartActions.CartActionTypes.CLEAR_CART);
    expect(action.userId).toBe(userId);
  });

  it('should create clearCartOnLogout action', () => {
    const action = CartActions.clearCartOnLogout({ userId });
    expect(action.type).toBe(CartActions.CartActionTypes.CLEAR_CART_ON_LOGOUT);
    expect(action.userId).toBe(userId);
  });

  it('should create saveCartToStorage action', () => {
    const action = CartActions.saveCartToStorage({ userId });
    expect(action.type).toBe(CartActions.CartActionTypes.SAVE_CART_TO_STORAGE);
    expect(action.userId).toBe(userId);
  });

  it('should create loadCartFromStorage action', () => {
    const items: CartItem[] = [product];
    const action = CartActions.loadCartFromStorage({ items, userId });
    expect(action.type).toBe(CartActions.CartActionTypes.LOAD_CART_FROM_STORAGE);
    expect(action.items).toEqual(items);
    expect(action.userId).toBe(userId);
  });
});
