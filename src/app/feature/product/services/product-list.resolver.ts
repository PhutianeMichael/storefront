import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Observable, combineLatest } from 'rxjs';
import {
  selectProductsLoaded,
  selectProductsLoading,
  selectProductFilters,
  selectProductSortBy,
  selectCurrentPage
} from '../state/product.selectors';
import * as ProductActions from '../state/product.actions';
import { tap, filter, take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductListResolver implements Resolve<boolean> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const category = route.queryParamMap.get('category');
    const search = route.queryParamMap.get('search');
    return combineLatest([
      this.store.select(selectProductsLoaded),
      this.store.select(selectProductsLoading),
      this.store.select(selectProductFilters),
      this.store.select(selectProductSortBy),
      this.store.select(selectCurrentPage)
    ]).pipe(
      tap(([loaded, loading, currentFilters]) => {
        const needsLoad = !loaded ||
          (category && category !== currentFilters?.category) ||
          (search && search !== currentFilters?.search);

        if (needsLoad && !loading) {
          const filters: any = {
            ...currentFilters
          };
          if (category) filters.category = category;
          if (search) filters.search = search;

          this.store.dispatch(ProductActions.loadCategoryList());
          this.store.dispatch(ProductActions.loadProducts(filters));
        }
      }),
      filter(([loaded, loading]) => loaded && !loading),
      take(1),
      map(() => true)
    );
  }
}
