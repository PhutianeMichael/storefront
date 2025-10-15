import { Injectable } from '@angular/core';
import { WISHLIST_STORAGE_KEY } from '../state/wishlist.actions';
import { Wishlist, WishlistItem } from '../models/wishlist.model';
import { WishlistInterface } from '../interfaces/wishlist.interface';

@Injectable({
    providedIn: 'root',
})
export class WishlistStorageService implements WishlistInterface {

    /**
     * Saves the user's wishlist to localStorage.
     * @param userId The user's ID.
     * @param wishlist The wishlist to save.
     */
    saveUserWishlist(userId: number, wishlist: Wishlist): void {
        try {
            if (!wishlist) {
                console.warn('Attempted to save undefined wishlist');
                return;
            }

            const storedWishlists = localStorage.getItem(WISHLIST_STORAGE_KEY);
            const allWishlists = storedWishlists ? JSON.parse(storedWishlists) : {};
            allWishlists[userId] = wishlist;
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(allWishlists));
        } catch (e) {
            console.error('Error saving wishlist to localStorage:', e);
            throw new Error('Failed to save wishlist');
        }
    }

    /**
     * Loads the user's wishlist from localStorage.
     * @param userId The user's ID.
     * @returns The user's wishlist or null if not found.
     */
    loadUserWishlist(userId: number): Wishlist | null {
        try {
            const storedWishlists = localStorage.getItem(WISHLIST_STORAGE_KEY);
            const allWishlists = storedWishlists ? JSON.parse(storedWishlists) : {};
            let wishlist = allWishlists[userId] || null;
            if (!wishlist) return null;
            wishlist.userId = wishlist.userId ?? userId;
            const defaultItem: WishlistItem = {
                productId: 0,
                title: '',
                description: '',
                category: '',
                price: 0,
                discountPercentage: 0,
                stock: 0,
                sku: '',
                availabilityStatus: '',
                code: '',
                thumbnail: ''
            };
            let items: any[] = Array.isArray(wishlist.items) ? wishlist.items : [];
            wishlist.items = items.map((item: any) => ({ ...defaultItem, ...item }));
            return wishlist;
        } catch (e) {
            console.error('Error loading wishlist from localStorage:', e);
            throw new Error('Failed to load wishlist');
        }
    }
}
