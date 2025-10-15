import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistItem } from '../models/wishlist.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as WishlistActions from '../state/wishlist.actions';
import { CartItem } from '../../cart/models/cart.model';
import { selectAuthUserId } from '../../auth/state/auth.selectors';
import * as CartActions from '../../cart/state/cart.actions';

@Component({
    selector: 'app-wishlist-list-item',
    imports: [
        MatIconModule,
        MatCardModule,
        NgOptimizedImage,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        NgClass,
    ],
    templateUrl: './wishlist-list-item.component.html',
    styleUrl: './wishlist-list-item.component.scss',
})
export class WishlistListItemComponent {
    /**
     * The wishlist item to display and interact with.
     */
    @Input() wishlistItem!: WishlistItem;
    readonly store = inject(Store<AppState>);
    router = inject(Router);
    private userId = this.store.selectSignal(selectAuthUserId);

    /**
     * Adds the wishlist item to the cart and removes it from the wishlist if the user is logged in and the item is in stock.
     * Navigates to login if the user is not logged in.
     * @param productData The wishlist item to add to the cart.
     */
    addToCart(productData: WishlistItem) {
        const userId = this.userId();
        if (!userId) {
            this.router.navigate(['/login']);
            return;
        }

        const product: CartItem = {
            availabilityStatus: productData.availabilityStatus,
            category: productData.category,
            code: productData.code,
            description: productData.description,
            discountPercentage: productData?.discountPercentage ?? 0,
            price: productData.price,
            productId: productData.productId,
            quantity: 1,
            sku: productData.sku,
            stock: productData.stock,
            thumbnail: productData.thumbnail,
            title: productData.title,
        };
        if (product.stock >= 1) {
            this.store.dispatch(CartActions.addToCart({product, userId}));
            this.store.dispatch(WishlistActions.removeItemFromWishlist({productId: product.productId, userId}));
        }
    }

    /**
     * Returns the CSS class for the item's stock status.
     * @param availabilityStatus The availability status string ('In Stock', etc.).
     * @returns The CSS class name for the stock status.
     */
    itemStockStatus(availabilityStatus: string) {
        return availabilityStatus === 'In Stock' ? 'wishlist-item__enough-stock-status' : 'wishlist-item__low-stock-status';
    }

    /**
     * Removes the item from the wishlist for the logged-in user.
     * @param productId The product ID to remove from the wishlist.
     */
    onRemoveFromWishlist(productId: number) {
        const userId = this.userId();
        if (!userId) return;

        this.store.dispatch(WishlistActions.removeItemFromWishlist({productId, userId}));
    }
}
