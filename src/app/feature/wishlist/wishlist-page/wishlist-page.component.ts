import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WishlistListComponent } from '../wishlist-list/wishlist-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { selectWishlistError, selectWishlistHasItems } from '../state/wishlist.selectors';
import * as WishlistActions from '../state/wishlist.actions';
import { selectAuthUserId } from '../../auth/state/auth.selectors';

@Component({
    selector: 'app-wishlist-page',
    imports: [
        MatIconModule,
        MatButton,
        RouterLink,
        WishlistListComponent,

    ],
    templateUrl: './wishlist-page.component.html',
    styleUrl: 'wishlist-page.component.scss',
})
export class WishlistPageComponent {
    readonly store = inject(Store<AppState>);
    router = inject(Router);
    isWishEmpty = this.store.selectSignal(selectWishlistHasItems);
    error = this.store.selectSignal(selectWishlistError);
    private userId = this.store.selectSignal(selectAuthUserId);

    /**
     * Dispatches an action to reload the wishlist from storage.
     */
    handleOnReloadWishlist() {
        this.store.dispatch(WishlistActions.appWishlistInit());
    }

    /**
     * Clears the user's wishlist if logged in, otherwise navigates to login.
     * Dispatches the clearWishlist action or navigates to login if not authenticated.
     */
    onClearWishlist() {
        const userId = this.userId();
        if (!userId) {
            this.router.navigateByUrl('/login');
            return;
        }

        this.store.dispatch(WishlistActions.clearWishlist({userId}));
    }
}
