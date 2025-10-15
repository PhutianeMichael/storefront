import { Routes } from '@angular/router';
import { ProductListComponent } from './feature/product/product-list/product-list.component';
import { ProductListResolver } from './feature/product/services/product-list.resolver';
import { authGuard } from './feature/auth/services/auth.guard';

export const routes: Routes = [
  {
    path: '', redirectTo: 'products', pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductListComponent,
    resolve: {productsLoaded: ProductListResolver},
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./feature/cart/cart-page/cart-page.component').then(m => m.CartPageComponent),
  },
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () => import('./feature/wishlist/wishlist-page/wishlist-page.component').then(m => m.WishlistPageComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./feature/auth/signup/signup.component').then(m => m.SignupComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./feature/product/product-details/product-details.component').then(m => m.ProductDetailsComponent),
  },
  {
    path: 'products/:id/reviews',
    loadComponent: () => import('./feature/product/components/product-reviews/product-reviews.component').then(m => m.ProductReviewsComponent),
  },
  {
    path: '**', redirectTo: 'products',
  },
];
