import { Component, inject } from '@angular/core';
import { CartListComponent } from '../cart-list/cart-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartActions from '../state/cart.actions';
import { selectCartHasItems } from '../state/cart.selectors';
import { selectAuthUserId } from '../../auth/state/auth.selectors';

@Component({
  selector: 'app-cart-page',
  imports: [
    CartListComponent,
    MatIconModule,
    MatButton,
    RouterLink,

  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  readonly store = inject(Store<AppState>);
  router = inject(Router);

  readonly hasCartItems = this.store.selectSignal(selectCartHasItems);
  readonly userIdSignal = this.store.selectSignal(selectAuthUserId);

  /**
   * Dispatches an action to clear the cart for the current user.
   * Uses a temporary userId until authentication is implemented.
   */
  onClearCart() {
    const userId = this.userIdSignal();
    if (!userId) {
      return;
    }

    this.store.dispatch(CartActions.clearCart({userId}));
  }
}
