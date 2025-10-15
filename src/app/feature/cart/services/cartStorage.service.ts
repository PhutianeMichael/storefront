import { Injectable } from '@angular/core';
import { CartState } from '../models/cart.model';
import { CART_STORAGE_KEY } from '../state/cart.actions';
import { CartInterface } from '../interfaces/cart.interface';


@Injectable({ providedIn: 'root' })
export class CartStorageService implements CartInterface {

  /**
   * Saves the user's cart to localStorage.
   * @param userId The user's ID.
   * @param cart The cart data to save.
   */
  saveUserCart(userId: number, cart: Partial<CartState>): void {
    try {
      const storedCarts = localStorage.getItem(CART_STORAGE_KEY);
      const allCarts = storedCarts ? JSON.parse(storedCarts) : {};
      allCarts[userId] = cart;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(allCarts));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      throw new Error('Failed to save cart');
    }
  }

  /**
   * Loads the user's cart from localStorage.
   * @param userId The user's ID.
   * @returns The user's cart or null if not found.
   */
  loadUserCart(userId: number): Partial<CartState> | null {
    try {
      const storedCarts = localStorage.getItem(CART_STORAGE_KEY);
      const allCarts = storedCarts ? JSON.parse(storedCarts) : {};
      return allCarts[userId] || null;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      throw new Error('Failed to load cart');
    }
  }

  /**
   * Loads all carts from localStorage.
   * @returns An object mapping user IDs to their carts.
   */
  loadAllCarts(): { [userId: number]: Partial<CartState> } {
    try {
      const storedCarts = localStorage.getItem(CART_STORAGE_KEY);
      return storedCarts ? JSON.parse(storedCarts) : {};
    } catch (error) {
      console.error('Error loading all carts from localStorage:', error);
      return {};
    }
  }

  /**
   * Clears the user's cart from localStorage.
   * @param userId The user's ID.
   */
  clearUserCart(userId: number): void {
    try {
      const storedCarts = localStorage.getItem(CART_STORAGE_KEY);
      const allCarts = storedCarts ? JSON.parse(storedCarts) : {};
      delete allCarts[userId];
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(allCarts));
    } catch (error) {
      console.error('Error clearing user cart:', error);
      throw new Error('Failed to clear cart');
    }
  }
}
