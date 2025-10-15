import { Component, EventEmitter, inject, Output } from '@angular/core';
import { WishlistListItemComponent } from '../wishlist-list-item/wishlist-list-item.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { selectWishlistError, selectWishlistItems, selectWishlistLoading } from '../state/wishlist.selectors';
import { WishlistItem } from '../models/wishlist.model';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-wishlist-list',
    imports: [
        WishlistListItemComponent,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButton,
    ],
    templateUrl: './wishlist-list.component.html',
    styleUrl: './wishlist-list.component.scss',
})
export class WishlistListComponent {
    readonly store = inject(Store<AppState>);
    wishlistItems = this.store.selectSignal(selectWishlistItems);
    loading = this.store.selectSignal(selectWishlistLoading);
    error = this.store.selectSignal(selectWishlistError);

    @Output() onReloadWishlist = new EventEmitter<{ reload: true }>();

    /**
     * trackBy function for ngFor to optimize rendering of wishlist items.
     * @param wishlistItem The wishlist item to track.
     * @returns The productId of the wishlist item.
     */
    trackByWishlistId(wishlistItem: WishlistItem) {
        return wishlistItem.productId;
    }
}
