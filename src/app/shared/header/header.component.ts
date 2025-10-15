import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { selectAuthUserId, selectIsAuthenticated, selectUsername } from '../../feature/auth/state/auth.selectors';
import { logout } from '../../feature/auth/state/auth.actions';
import * as CartActions from '../../feature/cart/state/cart.actions'
import { selectCartItemCount } from '../../feature/cart/state/cart.selectors';
import * as WishlistActions from '../../feature/wishlist/state/wishlist.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly store = inject(Store<AppState>);
  readonly cartItemCount = this.store.selectSignal(selectCartItemCount);
  readonly isUserLoggedIn = this.store.selectSignal(selectIsAuthenticated);
  readonly username = this.store.selectSignal(selectUsername);
  private userId = this.store.selectSignal(selectAuthUserId);

  /**
   * Logs out the current user and clears cart and wishlist data for the user.
   */
  onLogout() {
    const userId = this.userId();
    if (!userId) {
      return;
    }

    this.store.dispatch(CartActions.clearCartOnLogout({userId}));
    this.store.dispatch(WishlistActions.clearWishlistOnLogout({userId}));
    this.store.dispatch(logout());
  }
}
