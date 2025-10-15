import { AuthState } from './feature/auth/models/auth.model';
import { ProductState } from './feature/product/state/product.reducer';

export interface AppState {
  products: ProductState;
  auth: AuthState;
}
