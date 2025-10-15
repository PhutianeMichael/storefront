import { AuthState } from './feature/auth/models/auth.model';
import { ProductState } from './feature/product/state/product.reducer';
import { CartState } from './feature/cart/models/cart.model';
import { WishlistState } from './feature/wishlist/models/wishlist.model';

export interface AppState {
  products: ProductState;
  auth: AuthState;
  cart: CartState;
  wishlist: WishlistState;
}
