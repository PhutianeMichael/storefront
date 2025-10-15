import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as WishlistActions from './wishlist.actions';
import { tap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { WishlistStorageService } from '../services/wishlist-storage.service';
import { Wishlist } from '../models/wishlist.model';

@Injectable()
/**
 * Handles side effects for wishlist actions, such as saving to and loading from localStorage.
 */
export class WishlistEffects {
    private actions$ = inject(Actions);
    readonly store = inject(Store<AppState>);
    private wishlistStorage = inject(WishlistStorageService);

    /**
     * Effect to save the wishlist to localStorage whenever relevant actions are dispatched.
     * @effect
     */
    saveWishlistToStorage$ = createEffect(() =>
            this.actions$.pipe(
                ofType(
                    WishlistActions.addItemToWishlist,
                    WishlistActions.removeItemFromWishlist,
                    WishlistActions.clearWishlist,
                    WishlistActions.saveWishlistToStorage
                ),
                withLatestFrom(
                    this.store.select((state: AppState) => state.wishlist)
                ),
                tap(([, wishlistState]) => {
                    if (!wishlistState?.userId) return;
                    try {
                        const wishlist: Wishlist = {
                            userId: wishlistState.userId,
                            items: wishlistState.items
                        };
                        this.wishlistStorage.saveUserWishlist(wishlistState.userId, wishlist);
                    } catch (error) {
                        console.error('Error saving wishlist to localStorage:', error);
                    }
                })
            ),
        { dispatch: false }
    );

    /**
     * Effect to load the wishlist from localStorage on app initialization.
     * @effect
     */
    loadWishlistOnAppInit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WishlistActions.appWishlistInit),
            withLatestFrom(this.store.select((state: AppState) => state.auth.user)),
            map(([action, user]) => {
                try {
                    if (!user?.id) {
                        return WishlistActions.loadWishlistFromStorage({ items: [], userId: 0 });
                    }

                    const userWishlist = this.wishlistStorage.loadUserWishlist(user.id);

                    return WishlistActions.loadWishlistFromStorage({
                        items: userWishlist?.items || [],
                        userId: user.id
                    });
                } catch (error) {
                    console.error('Error loading wishlist from localStorage:', error);
                    return WishlistActions.loadWishlistFromStorageFailure({
                        error: 'Failed to load wishlist from storage'
                    });
                }
            }),
            catchError(error => of(WishlistActions.loadWishlistFromStorageFailure({
                error: error.message
            })))
        )
    );
    /**
     * Effect to load a specific user's wishlist from storage.
     * @effect
     */
    loadUserWishlist$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WishlistActions.loadUserWishlist),
            map((action) => {
                try {
                    const userWishlist = this.wishlistStorage.loadUserWishlist(action.userId);
                    return WishlistActions.loadWishlistFromStorage({
                        items: userWishlist?.items || [],
                        userId: action.userId
                    });
                } catch (error) {
                    console.error('Error loading user wishlist from storage:', error);
                    return WishlistActions.loadWishlistFromStorageFailure({
                        error: 'Failed to load wishlist from storage'
                    });
                }
            }),
            catchError(error => of(WishlistActions.loadWishlistFromStorageFailure({
                error: error.message
            })))
        )
    );
}
