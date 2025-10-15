import * as WishlistSelectors from './wishlist.selectors';
import { WishlistState, WishlistItem } from '../models/wishlist.model';

describe('Wishlist Selectors', () => {
    const item: WishlistItem = {
        productId: 1,
        title: 'Test',
        description: '',
        category: '',
        price: 1,
        discountPercentage: 0,
        stock: 1,
        sku: '',
        availabilityStatus: '',
        code: '',
        thumbnail: ''
    };
    const state: WishlistState = {
        userId: 123,
        items: [item],
        loading: false,
        error: null,
        itemCount: 1
    };
    const emptyState: WishlistState = {
        userId: 123,
        items: [],
        loading: false,
        error: null,
        itemCount: 0
    };

    it('should select wishlist state', () => {
        const result = WishlistSelectors.selectWishlist.projector(state);
        expect(result).toEqual(state);
    });

    it('should select wishlist items', () => {
        const result = WishlistSelectors.selectWishlistItems.projector(state);
        expect(result).toEqual([item]);
    });

    it('should select wishlist item count', () => {
        const result = WishlistSelectors.selectWishlistItemCount.projector(state);
        expect(result).toBe(1);
    });

    it('should return true for item in wishlist', () => {
        const selector = WishlistSelectors.selectIsItemInWishlist(item.productId);
        const result = selector.projector([item]);
        expect(result).toBeTrue();
    });

    it('should return false for item not in wishlist', () => {
        const selector = WishlistSelectors.selectIsItemInWishlist(999);
        const result = selector.projector([item]);
        expect(result).toBeFalse();
    });

    it('should return false for item not in wishlist (empty)', () => {
        const selector = WishlistSelectors.selectIsItemInWishlist(item.productId);
        const result = selector.projector([]);
        expect(result).toBeFalse();
    });

    it('should return true for wishlist has items', () => {
        const result = WishlistSelectors.selectWishlistHasItems.projector(state);
        expect(result).toBeTrue();
    });

    it('should return false for wishlist has items (empty)', () => {
        const result = WishlistSelectors.selectWishlistHasItems.projector(emptyState);
        expect(result).toBeFalse();
    });

    describe('Additional Wishlist Selectors', () => {
        const loadingState: WishlistState = {
            userId: 123,
            items: [item],
            loading: true,
            error: null,
            itemCount: 1
        };

        const errorState: WishlistState = {
            userId: 123,
            items: [item],
            loading: false,
            error: 'Failed to load wishlist',
            itemCount: 1
        };

        const notLoadingState: WishlistState = {
            userId: 123,
            items: [item],
            loading: false,
            error: null,
            itemCount: 1
        };

        const noErrorState: WishlistState = {
            userId: 123,
            items: [item],
            loading: false,
            error: null,
            itemCount: 1
        };

        it('should select wishlist loading state when loading', () => {
            const result = WishlistSelectors.selectWishlistLoading.projector(loadingState);
            expect(result).toBeTrue();
        });

        it('should select wishlist loading state when not loading', () => {
            const result = WishlistSelectors.selectWishlistLoading.projector(notLoadingState);
            expect(result).toBeFalse();
        });

        it('should select wishlist error state when error exists', () => {
            const result = WishlistSelectors.selectWishlistError.projector(errorState);
            expect(result).toBe('Failed to load wishlist');
        });

        it('should select wishlist error state when no error exists', () => {
            const result = WishlistSelectors.selectWishlistError.projector(noErrorState);
            expect(result).toBeNull();
        });

        it('should return null for error when error is null', () => {
            const result = WishlistSelectors.selectWishlistError.projector(state);
            expect(result).toBeNull();
        });

        it('should return false for loading when loading is false', () => {
            const result = WishlistSelectors.selectWishlistLoading.projector(state);
            expect(result).toBeFalse();
        });

        it('should handle empty state for loading selector', () => {
            const emptyLoadingState: WishlistState = {
                userId: undefined,
                items: [],
                loading: false,
                error: null,
                itemCount: 0
            };
            const result = WishlistSelectors.selectWishlistLoading.projector(emptyLoadingState);
            expect(result).toBeFalse();
        });

        it('should handle empty state for error selector', () => {
            const emptyErrorState: WishlistState = {
                userId: undefined,
                items: [],
                loading: false,
                error: null,
                itemCount: 0
            };
            const result = WishlistSelectors.selectWishlistError.projector(emptyErrorState);
            expect(result).toBeNull();
        });

        it('should handle different error messages', () => {
            const differentErrorState: WishlistState = {
                userId: 123,
                items: [item],
                loading: false,
                error: 'Network error',
                itemCount: 1
            };
            const result = WishlistSelectors.selectWishlistError.projector(differentErrorState);
            expect(result).toBe('Network error');
        });

        it('should handle loading state with error', () => {
            const loadingWithErrorState: WishlistState = {
                userId: 123,
                items: [item],
                loading: true,
                error: 'Loading in progress',
                itemCount: 1
            };
            const loadingResult = WishlistSelectors.selectWishlistLoading.projector(loadingWithErrorState);
            const errorResult = WishlistSelectors.selectWishlistError.projector(loadingWithErrorState);

            expect(loadingResult).toBeTrue();
            expect(errorResult).toBe('Loading in progress');
        });
    });
});
