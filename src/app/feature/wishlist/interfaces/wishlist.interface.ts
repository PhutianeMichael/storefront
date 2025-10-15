import { Wishlist } from '../models/wishlist.model';

export interface WishlistInterface {
    saveUserWishlist(userId: number, wishlist: Wishlist): void;
    loadUserWishlist(userId: number): Wishlist | null;
}
