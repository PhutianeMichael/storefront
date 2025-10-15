import * as CartSelectors from './cart.selectors';
import { CartItem, CartState } from '../models/cart.model';

describe('Cart Selectors', () => {
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
  const state: CartState = {
    userId,
    items: [product],
    total: 180,
    itemCount: 2,
    error: null
  };

  it('should select cart state', () => {
    expect(CartSelectors.selectCart.projector(state)).toEqual(state);
  });

  it('should select cart item count', () => {
    expect(CartSelectors.selectCartItemCount.projector(state)).toBe(2);
  });

  it('should select cart total', () => {
    expect(CartSelectors.selectCartTotal.projector(state)).toBe(180);
  });

  it('should select cart items', () => {
    expect(CartSelectors.selectCartItems.projector(state)).toEqual([product]);
  });

  it('should select cart error', () => {
    expect(CartSelectors.selectCartError.projector(state)).toBeNull();
  });

  it('should select cart userId', () => {
    expect(CartSelectors.selectCartUserId.projector(state)).toBe(userId);
  });

  it('should select cart item by id', () => {
    expect(CartSelectors.selectCartItemById(product.productId).projector([product])).toEqual(product);
  });

  it('should select is current user cart', () => {
    expect(CartSelectors.selectIsCurrentUserCart(userId).projector(userId)).toBeTrue();
    expect(CartSelectors.selectIsCurrentUserCart(2).projector(userId)).toBeFalse();
  });

  it('should select is product in cart', () => {
    expect(CartSelectors.selectIsProductInCart(product.productId).projector(product)).toBeTrue();
    expect(CartSelectors.selectIsProductInCart(999).projector(undefined)).toBeFalse();
  });

  it('should select cart item quantity', () => {
    expect(CartSelectors.selectCartItemQuantity(product.productId).projector(product)).toBe(product.quantity);
  });
});
