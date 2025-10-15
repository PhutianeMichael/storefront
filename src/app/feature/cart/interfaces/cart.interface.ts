import { CartState, UserCartPayload } from '../models/cart.model';

export interface CartInterface {
    saveUserCart(userId: number, cart: Partial<CartState>): void;
    loadUserCart(userId: number): Partial<CartState> | null
    loadAllCarts(): UserCartPayload
    clearUserCart(userId: number): void
}
