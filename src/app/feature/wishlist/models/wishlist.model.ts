/**
 * Represents an item in the user's wishlist.
 * @property productId The unique product ID.
 * @property title The product title.
 * @property description The product description.
 * @property availabilityStatus The stock status of the product.
 * @property stock The number of items in stock.
 * @property price The price of the product.
 * @property sku The SKU code.
 * @property code The product code.
 * @property category The product category.
 * @property discountPercentage The discount percentage (optional).
 * @property thumbnail The product thumbnail image URL.
 */
export interface WishlistItem {
  productId: number;
  title: string;
  description: string;
  availabilityStatus: string;
  stock: number;
  price: number;
  sku: string;
  code: string,
  category: string;

  discountPercentage?: number;
  thumbnail: string;
}

/**
 * Represents the state of the wishlist feature in the store.
 * @property userId The ID of the user.
 * @property items The array of wishlist items.
 * @property loading Whether the wishlist is loading.
 * @property error Any error message.
 * @property itemCount The number of items in the wishlist.
 */
export interface WishlistState {
  userId: number | undefined;
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  itemCount: number;
}

/**
 * Represents a user's wishlist.
 * @property userId The ID of the user.
 * @property items The array of wishlist items.
 */
export interface Wishlist {
  userId: number;
  items: WishlistItem[]
}

/**
 * The key used for storing wishlists in localStorage.
 */
export const WISHLIST_STORAGE_KEY = 'wishlists';
