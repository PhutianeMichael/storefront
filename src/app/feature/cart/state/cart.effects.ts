import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartActions from './cart.actions';
import { catchError, map, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartStorageService } from '../services/cartStorage.service';

@Injectable()
export class CartEffects {
    private actions$ = inject(Actions);
    readonly store = inject(Store<AppState>);
    private cartStorage = inject(CartStorageService);

    saveCartToStorage$ = createEffect(() =>
            this.actions$.pipe(
                ofType(
                    CartActions.addToCart,
                    CartActions.removeFromCart,
                    CartActions.updateCartItemQuantity,
                    CartActions.clearCart,
                    CartActions.setCartItemQuantity,
                    CartActions.saveCartToStorage,
                ),
                withLatestFrom(
                    this.store.select((state: AppState) => state.cart),
                ),
                tap(([action, cart]) => {
                    if (!cart?.userId) return;
                    try {
                        this.cartStorage.saveUserCart(cart.userId, {
                            items: cart.items,
                            total: cart.total,
                            itemCount: cart.itemCount,
                        });
                    } catch (error) {
                        console.error('Error saving cart to storage:', error);
                    }
                }),
            ),
        {dispatch: false},
    );

    loadCartOnAppInit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CartActions.appCartInit),
            withLatestFrom(this.store.select((state: AppState) => state.auth.user)),
            map(([action, user]) => {
                try {
                    if (!user?.id) {
                        return CartActions.loadCartFromStorage({items: [], userId: 0});
                    }
                    const userCart = this.cartStorage.loadUserCart(user.id);
                    return CartActions.loadCartFromStorage({
                        items: userCart?.items || [],
                        userId: user.id,
                    });
                } catch (error) {
                    console.error('Error loading cart on app init:', error);
                    return CartActions.loadCartFromStorageFailure({
                        error: 'Failed to load cart from storage',
                    });
                }
            }),
            catchError(error => of(CartActions.loadCartFromStorageFailure({
                error: error.message,
            }))),
        ),
    );

    loadUserCart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CartActions.loadUserCart),
            map((action) => {
                try {
                    const userCart = this.cartStorage.loadUserCart(action.userId);
                    return CartActions.loadCartFromStorage({
                        items: userCart?.items || [],
                        userId: action.userId,
                    });
                } catch (error) {
                    console.error('Error loading user cart:', error);
                    return CartActions.loadCartFromStorageFailure({
                        error: 'Failed to load user cart',
                    });
                }
            }),
            catchError(error => of(CartActions.loadCartFromStorageFailure({
                error: error.message,
            }))),
        ),
    );

    switchUserCart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CartActions.switchUserCart),
            map(({userId}) => {
                try {
                    const userCart = this.cartStorage.loadUserCart(userId);
                    return CartActions.loadCartFromStorage({
                        items: userCart?.items || [],
                        userId,
                    });
                } catch (error) {
                    console.error('Error switching user cart:', error);
                    return CartActions.loadCartFromStorageFailure({
                        error: 'Failed to switch user cart',
                    });
                }
            }),
            catchError(error => of(CartActions.loadCartFromStorageFailure({
                error: error.message,
            }))),
        ),
    );

}
