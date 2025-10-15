import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Product, Review } from '../models/product.model';
import { MatButtonModule, MatMiniFabButton } from '@angular/material/button';
import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { setSelectedProduct } from '../state/product.actions';
import { AppState } from '../../../app.state';
import { selectAuthUserId } from '../../auth/state/auth.selectors';
import { ProductReviewsDialogComponent } from '../components/product-reviews-dialog/product-reviews-dialog.component';
import * as CartActions from '../../cart/state/cart.actions';
import { CartItem } from '../../cart/models/cart.model';
import { selectCartItemQuantity, selectIsProductInCart } from '../../cart/state/cart.selectors';

@Component({
    selector: 'app-product-list-item',
    imports: [
        MatCardModule,
        MatButtonModule,
        CurrencyPipe,
        NgOptimizedImage,
        MatMiniFabButton,
        MatIconModule,
        MatDialogModule,
        NgClass,

    ],
    templateUrl: './product-list-item.component.html',
    styleUrl: './product-list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListItemComponent {
    readonly dialog = inject(MatDialog);
    readonly router = inject(Router);
    protected store = inject(Store<AppState>);
    product?: Product;
    private userId = this.store.selectSignal(selectAuthUserId);

    @Input()
    set productInput(value: Product | undefined) {
        this.product = value;
        if (value && value.id !== undefined && value.id !== null) {
            this.initSignals(value);
        } else {
            this.isProductInCart = () => false;
            this.cartItemQuantity = () => 0;
            this.isItemInWishlist = () => false;
        }
    }

    isProductInCart = () => false;
    cartItemQuantity = () => 0;
    isItemInWishlist = () => false;
    /**
     * trackBy function for rendering stars in ngFor.
     * @param index The index of the star.
     * @param star The star value.
     * @returns The star value for tracking.
     */
    trackStar = (index: number, star: number) => star;

    /**
     * Calculates the discounted price for a product.
     * @param price The original price.
     * @param discountPercentage The discount percentage.
     * @returns The discounted price.
     */
    calculateDiscountedPrice(price: number, discountPercentage: number) {
        return price - (price * discountPercentage / 100);
    }

    /**
     * Opens the product reviews dialog and navigates to reviews page if requested.
     * @param productId The product ID.
     * @param reviews Array of reviews.
     * @param rating The product rating.
     */
    openDialog(productId: number, reviews: Review[], rating: number) {
        this.store.dispatch(setSelectedProduct({productId}));
        const dialogRef = this.dialog.open(ProductReviewsDialogComponent, {
            width: '400px',
            data: {reviews, rating},
        });

        dialogRef.afterClosed().subscribe((result: { showReviews: boolean }) => {
            if (result?.showReviews) {
                this.router.navigate([`/products/${productId}/reviews`]);
                return;
            }
        })
    }

    /**
     * Updates the quantity of the product in the cart for the logged-in user.
     * @param productId The product ID.
     * @param quantity The new quantity value.
     */
    onIncreaseOrDecreaseItemQuantity(productId: number, quantity: number) {
        const userId = this.userId();
        if (!userId) {
            this.router.navigate(['/login']);
            return;
        }

        this.store.dispatch(CartActions.updateCartItemQuantity({productId, quantity, userId}));
    }

    /**
     * Navigates to the product details page.
     * @param productId The product ID.
     */
    onViewProductDetails(productId: number) {
        this.store.dispatch(setSelectedProduct({productId}));
        this.router.navigate([`/products/${productId}`]);
    }

    /**
     * Adds or removes the product from the wishlist for the logged-in user.
     * @param product The product to add or remove.
     */
    onToggleWishlist(product: Product) {
        const userId = this.userId();
        if (!userId) {
            this.router.navigate(['/login']);
            return;
        }

        if (this.isItemInWishlist()) {
            return;
        }

    }

    /**
     * Rounds a number to the nearest integer.
     * @param input The number to round.
     * @returns The rounded integer.
     */
    roundNum(input: number): number {
        return Math.round(input);
    }

    /**
     * Rounds a number up to the next largest integer.
     * @param input The number to round up.
     * @returns The smallest integer greater than or equal to the input.
     */
    ceilNum(input: number): number {
        return Math.ceil(input);
    }

    /**
     * Adds the product to the cart for the logged-in user, or navigates to login if not authenticated.
     * @param productData The product to add to the cart.
     */
    onAddProductToCart(productData: Product) {
        const userId = this.userId();
        if (!userId) {
            this.router.navigate(['/login']);
            return;
        }

        const product: CartItem = {
            availabilityStatus: productData.availabilityStatus,
            category: productData.category,
            code: productData.meta.barcode,
            description: productData.description,
            discountPercentage: productData?.discountPercentage ?? 0,
            price: productData.price,
            productId: productData.id,
            quantity: 1,
            sku: productData.sku,
            stock: productData.stock,
            thumbnail: productData.thumbnail,
            title: productData.title,
        }
        this.store.dispatch(CartActions.addToCart({product, userId}));
    }

    /**
     * Initializes the signals for the component.
     * @param product The product to initialize signals for.
     */
    private initSignals(product: Product) {
        this.isProductInCart = this.store.selectSignal(selectIsProductInCart(product.id));
        this.cartItemQuantity = this.store.selectSignal(selectCartItemQuantity(product.id));
        this.isItemInWishlist = signal(false);
    }
}
