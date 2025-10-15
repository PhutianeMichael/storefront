import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { Cart, Product, SortByType } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductListItemComponent } from '../product-list-item/product-list-item.component';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  selectCategories,
  selectCurrentViewProducts,
  selectFilteredProductsCount,
  selectHasMoreProducts,
  selectProductFilters,
  selectProductsError,
  selectProductsLoading,
  selectProductSortBy,
  selectTotalCount,
} from '../state/product.selectors';
import * as ProductActions from '../state/product.actions';
import { ProductFilter } from '../state/product.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppState } from '../../../app.state';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    ProductListItemComponent,
  ],
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit, OnDestroy {
  readonly store = inject(Store<AppState>);
  private destroy$ = new Subject<void>();

  readonly products: Signal<Product[]> = this.store.selectSignal(selectCurrentViewProducts);
  readonly loading: Signal<boolean> = this.store.selectSignal(selectProductsLoading);
  readonly error: Signal<string | null> = this.store.selectSignal(selectProductsError);
  readonly hasMore: Signal<boolean> = this.store.selectSignal(selectHasMoreProducts);
  readonly categories: Signal<string[]> = this.store.selectSignal(selectCategories);
  readonly totalCount: Signal<number> = this.store.selectSignal(selectTotalCount);
  readonly filteredProductsCount: Signal<number> = this.store.selectSignal(selectFilteredProductsCount);
  readonly filters: Signal<Partial<ProductFilter>> = this.store.selectSignal(selectProductFilters);
  readonly sortBy: Signal<SortByType> = this.store.selectSignal(selectProductSortBy);

  searchControl = new FormControl('');
  categoryControl = new FormControl<string | null>(null);
  sortControl = new FormControl('newest');

  cart!: Cart;
  sortOptions = [
    {value: 'newest', label: 'Newest'},
    {value: 'price-low', label: 'Price: Low to High'},
    {value: 'price-high', label: 'Price: High to Low'},
    {value: 'rating', label: 'Highest Rated'},
    {value: 'discount', label: 'Best Discount'},
    {value: 'title', label: 'Name: A to Z'},
  ];

  /**
   * Returns true if any product filter is active.
   */
  get hasActiveFilters(): boolean {
    return !!this.searchControl.value || !!this.categoryControl.value || this.sortControl.value !== 'newest';
  }

  /**
   * Initializes the component, sets up form controls, and subscribes to changes for filtering, sorting, and searching products.
   */
  ngOnInit() {
    const filters = this.filters();
    if (filters?.search) {
      this.searchControl.setValue(filters.search, {emitEvent: false});
    }
    if (filters?.category) {
      this.categoryControl.setValue(filters.category, {emitEvent: false});
    }

    const sortBy = this.sortBy();
    if (sortBy) {
      this.sortControl.setValue(sortBy, {emitEvent: false});
    }

    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe(query => {
        if (query?.trim()) {
          this.store.dispatch(ProductActions.searchProducts({query: query.trim()}));
        } else {
          this.store.dispatch(ProductActions.filterProducts({filters: {search: undefined}}));
        }
      });

    this.categoryControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe(category => {
        this.onCategoryChange(category);
      });

    this.sortControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe(sortBy => {
        this.onSortChange(sortBy as any);
      });
  }

  /**
   * Cleans up subscriptions and resources on component destroy.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles category filter changes and dispatches filter action.
   * @param category The selected category or null.
   */
  onCategoryChange(category: string | null) {
    this.store.dispatch(ProductActions.loadProducts({
      category: category || undefined,
      page: 1,
    }));
  }

  /**
   * Handles sort option changes and dispatches sort action.
   * @param sortBy The selected sort option.
   */
  onSortChange(sortBy: string) {
    this.store.dispatch(ProductActions.sortProducts({sortBy: sortBy as any}));
  }

  /**
   * Clears the search input and resets filters.
   */
  clearSearch() {
    this.searchControl.setValue('');
    this.categoryControl.setValue(null, {emitEvent: false});
    this.sortControl.setValue('newest', {emitEvent: false});
    this.store.dispatch(ProductActions.clearFilters());
  }

  /**
   * Clears all filters and resets form controls.
   */
  clearAllFilters() {
    this.searchControl.setValue('');
    this.categoryControl.setValue(null, {emitEvent: false});
    this.sortControl.setValue('newest', {emitEvent: false});
    this.store.dispatch(ProductActions.clearFilters());
  }

  /**
   * Dispatches an action to load more products.
   */
  loadMore() {
    this.store.dispatch(ProductActions.loadMoreProducts());
  }

  /**
   * trackBy function for ngFor to optimize rendering of product items.
   * @param index The index of the product.
   * @param product The product object.
   * @returns The product ID or index if missing.
   */
  trackByProductId(index: number, product: Product): number | string {
    if (product && product.id != null) {
      return product.id;
    } else {
      console.warn('Product missing id at index', index, product);
      return index;
    }
  }

}
