import { Routes } from '@angular/router';
import { ProductListComponent } from './feature/product/product-list/product-list.component';
import { ProductListResolver } from './feature/product/services/product-list.resolver';

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
