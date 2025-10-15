import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartItemCount, selectCartItems, selectCartTotal } from '../state/cart.selectors';
import { DecimalPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { AppState } from '../../../app.state';
import { CartListItemComponent } from '../cart-list-item/cart-list-item.component';

@Component({
  selector: 'app-cart-list',
  imports: [
    DecimalPipe,
    MatButton,
    CartListItemComponent,
  ],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss',
})
export class CartListComponent {
  readonly store = inject(Store<AppState>);
  readonly cartItems = this.store.selectSignal(selectCartItems);
  readonly cartTotal = this.store.selectSignal(selectCartTotal);
  readonly cartItemCount = this.store.selectSignal(selectCartItemCount);

}

