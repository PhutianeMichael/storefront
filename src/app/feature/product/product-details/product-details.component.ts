import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, take, tap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Product, Review } from '../models/product.model';
import { MatList, MatListItem } from '@angular/material/list';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { selectProductsError, selectProductsLoading, selectSelectedProduct } from '../state/product.selectors';
import { clearSelectedProduct, loadProductDetail } from '../state/product.actions';
import { AppState } from '../../../app.state';
import { selectAuthUserId } from '../../auth/state/auth.selectors';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartItem } from '../../cart/models/cart.model';
import * as CartActions from '../../cart/state/cart.actions';
import { selectCartItemQuantity, selectIsProductInCart } from '../../cart/state/cart.selectors';

@Component({
    selector: 'app-product-details',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        NgClass,
        CurrencyPipe,
        DatePipe,
        MatList,
        MatListItem,
        MatProgressBar,
        MatProgressSpinnerModule,
    ],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    readonly store = inject(Store<AppState>);

    readonly product = this.store.selectSignal(selectSelectedProduct);
    readonly isProductInCart = this.store.selectSignal(selectIsProductInCart(this.product()?.id ?? 0));
    readonly productItemQuantity = this.store.selectSignal(selectCartItemQuantity(this.product()?.id ?? 0));
    readonly isItemInWishlist = signal(1234);
    readonly isLoading = this.store.selectSignal(selectProductsLoading);
    readonly error = this.store.selectSignal(selectProductsError);
    private userId = this.store.selectSignal(selectAuthUserId);

    /**
     * Initializes the component and loads the product details.
     */
    ngOnInit() {
        this.loadProduct();
    }

    /**
     * Cleans up by clearing the selected product from the store.
     */
    ngOnDestroy() {
        this.store.dispatch(clearSelectedProduct());
    }

    /**
     * Loads the product details based on the route parameter.
     */
    private loadProduct() {
        this.route.paramMap.pipe(
            take(1),
            map(params => {
                return Number(params.get('id'));
            }),
            filter(id => !!id && !isNaN(id)),
            tap(id => {
                this.store.dispatch(loadProductDetail({productId: id}));
            }),
        ).subscribe();
    }

    /**
     * Rounds a number to the nearest integer.
     * @param value The value to round.
     * @returns The rounded value.
     */
    mathRound = Math.round;

    /**
     * Rounds a number up to the nearest integer.
     * @param value The value to round up.
     * @returns The rounded up value.
     */
    mathCeil = Math.ceil;

    /**
     * Adds the product to the cart for the logged-in user, or navigates to login if not authenticated.
     * @param productData The product to add to the cart.
     */
    onAddItemToCart(productData: Product) {
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
        };
        this.store.dispatch(CartActions.addToCart({product, userId}));

    }

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
     * Navigates back to the products list and clears the selected product.
     */
    goBack() {
        this.store.dispatch(clearSelectedProduct());
        this.router.navigate([`/products`]);
    }

    /**
     * Gets the number of reviews for a specific star rating.
     * @param reviews Array of reviews.
     * @param star The star rating to count.
     * @returns Number of reviews with the given star rating.
     */
    getRatingsPerBar(reviews: Review[], star: number): number {
        return reviews.filter((review: Review) => review.rating === star).length ?? 0;
    }

    /**
     * Returns the CSS class for the star bar based on the star value.
     * @param star The star rating.
     * @returns The CSS class name for the star bar.
     */
    getBarClass(star: number) {
        switch (star) {
            case 5:
                return 'five-star-bar';
            case 4:
                return 'four-star-bar';
            case 3:
                return 'three-star-bar';
            case 2:
                return 'two-star-bar';
            default:
                return 'one-star-bar';
        }
    }

    /**
     * Updates the quantity of the product in the cart for the logged-in user.
     * @param quantity The new quantity value.
     */
    onIncreaseOrDecreaseItemQuantity(quantity: number) {
        const userId = this.userId();
        if (!userId) {
            this.router.navigate(['/login']);
            return;
        }

        this.store.dispatch(CartActions.updateCartItemQuantity({
            productId: this.product()?.id ?? 0,
            quantity,
            userId,
        }));
    }

    /**
     * Adds or removes the product from the wishlist for the logged-in user.
     * If the product is already in the wishlist, it will be removed; otherwise, it will be added.
     * If the user is not logged in, navigates to the login page.
     *
     * @param product The product to add or remove from the wishlist.
     */
    onAddOrRemoveItemFromFavourite(product: Product) {
        const userId = this.userId();
        if (!userId) {
            this.router.navigate(['/login']);
            return;
        }

        if (this.isItemInWishlist()) {

            return;
        }

    }
}
