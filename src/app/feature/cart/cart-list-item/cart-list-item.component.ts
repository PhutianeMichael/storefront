import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CartItem } from '../models/cart.model';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DecimalPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartActions from '../state/cart.actions';

import { selectCartItemQuantity, selectCartItemSubTotal } from '../state/cart.selectors';
import { selectAuthUserId } from '../../auth/state/auth.selectors';

@Component({
  selector: 'app-cart-list-item',
  imports: [
    MatIconModule,
    MatCardModule,
    NgOptimizedImage,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgClass,
    DecimalPipe,

  ],
  templateUrl: './cart-list-item.component.html',
  styleUrl: './cart-list-item.component.scss',
})
export class CartListItemComponent {
  cartItem!: CartItem;

  @Input() set cartItemInput(value: CartItem) {
    this.cartItem = value;
    if (value && value.productId !== undefined && value.productId !== null) {
      this.initSignal(value);
    } else {
      this.cartItemTotal = () => 0;
      this.cartItemQuantity = () => 0;
    }

  }

  readonly store = inject(Store<AppState>);
  router = inject(Router);
  cartItemTotal = () => 0;
  cartItemQuantity = () => 0;
  private userId = this.store.selectSignal(selectAuthUserId);

  /**
   * Removes the cart item for the logged-in user, or navigates to login if not authenticated.
   */
  onRemove() {
    const userId = this.userId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.store.dispatch(CartActions.removeFromCart({productId: this.cartItem.productId, userId}));
  }

  /**
   * Formats the quantity for display, showing '10+' for quantities 10 or greater.
   * @param qty The quantity value.
   * @returns The formatted quantity string or number.
   */
  trackQuantity(qty: number) {
    if (qty >= 10) {
      return '10+';
    }
    return qty;
  }

  /**
   * Returns the CSS class for the item's stock status.
   * @param availabilityStatus The availability status string.
   * @returns The CSS class name for the stock status.
   */
  itemStockStatus(availabilityStatus: string) {
    return availabilityStatus === 'In Stock' ? 'cart-item__enough-stock-status' : 'cart-item__low-stock-status';
  }

  /**
   * Moves the cart item to the wishlist for the logged-in user.
   * @param item The cart item to move.
   */
  onMoveToList(item: CartItem) {
    const userId = this.userId();
    if (!userId) return;

    this.store.dispatch(CartActions.removeFromCart({productId: item.productId, userId}))
  }

  /**
   * Handles changes to the cart item quantity, ensuring it does not exceed stock.
   * @param quantity The new quantity value.
   * @param stock The available stock for the item.
   */
  onQuantityChange(quantity: number, stock: number) {
    const userId = this.userId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (quantity > stock) {
      quantity = stock;
    }
    this.store.dispatch(CartActions.setCartItemQuantity({
      productId: this.cartItem.productId,
      quantity,
      userId,
    }));
  }

  quantityOptions = [
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
    {value: 5, label: '5'},
    {value: 6, label: '6'},
    {value: 7, label: '7'},
    {value: 8, label: '8'},
    {value: 9, label: '9'},
    {value: 10, label: '10+'},
  ];

  /**
   * Returns the available quantity options for the cart item, based on stock and current quantity.
   * @param stock The available stock for the item.
   * @param currentQuantity The current quantity selected (optional).
   * @returns An array of quantity option objects.
   */
  getQuantityOptions(stock: number, currentQuantity?: number) {
    if (stock < 1) return [];
    let options;
    if (stock <= 10) {
      options = this.quantityOptions
        .filter(opt => opt.value <= stock)
        .map(opt =>
          opt.value === 10 ? {value: 10, label: '10'} : opt,
        );
    } else {
      options = [...this.quantityOptions];
    }
    if (
      currentQuantity != null &&
      !options.some(opt => opt.value === currentQuantity)
    ) {
      options = [
        ...options,
        {value: currentQuantity, label: String(currentQuantity)},
      ];
    }
    options = Array.from(new Map(options.map(opt => [opt.value, opt])).values());
    options = options.sort((a, b) => a.value - b.value);
    return options;
  }

  private initSignal(value: CartItem) {
    this.cartItemTotal = this.store.selectSignal(selectCartItemSubTotal(value.productId));
    this.cartItemQuantity = this.store.selectSignal(selectCartItemQuantity(value.productId));
  }

}
