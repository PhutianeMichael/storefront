import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { HttpParams } from '@angular/common/http';

import * as ProductActions from './product.actions';
import { Product } from '../models/product.model';
import { selectCurrentPage, selectPageSize, selectProductFilters, selectProductSortBy } from './product.selectors';
import { AppState } from '../../../app.state';
import { ProductService } from '../services/product.service';

@Injectable()
export class ProductEffects {
    private actions$ = inject(Actions);
    readonly store = inject(Store<AppState>);
    private productService: ProductService = inject(ProductService);

    loadProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.loadProducts),
            switchMap((action) => {
                const {category, limit, page, sort, filters} = action;
                const pageSize = limit || 12;
                const currentPage = page || 1;
                const skip = (currentPage - 1) * pageSize;

                let params = new HttpParams()
                    .set('limit', pageSize.toString())
                    .set('sortBy', sort?.toString() || 'title')
                    .set('order', 'asc')
                    .set('skip', skip.toString());

                if (category && category !== 'all') {
                    return this.productService.getProductsByCategory(params, category).pipe(
                        map(response => ProductActions.loadProductsSuccess({
                            products: response.products,
                            totalCount: response.total,
                            hasMore: response.skip + response.limit < response.total,
                            filters: {...filters, category},
                            sort: sort || 'title',
                            currentPage,
                        })),
                        catchError(error => of(ProductActions.loadProductsFailure({
                            error: this.getErrorMessage(error),
                        }))),
                    );
                } else {
                    return this.productService.getProducts(params).pipe(
                        map(response => ProductActions.loadProductsSuccess({
                            products: response.products,
                            totalCount: response.total,
                            hasMore: response.skip + response.limit < response.total,
                            filters: {...filters, category: undefined},
                            sort: sort || 'title',
                            currentPage,
                        })),
                        catchError(error => of(ProductActions.loadProductsFailure({
                            error: this.getErrorMessage(error),
                        }))),
                    );
                }
            }),
        ),
    );

    loadProductCategoryList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.loadCategoryList),
            switchMap((action) =>
                this.productService.getProductCategoryList()
                    .pipe(
                        map(response => ProductActions.loadCategoryListSuccess({
                            categories: response,
                        })),
                        catchError(error => of(ProductActions.loadCategoryListFailure({
                            error: this.getErrorMessage(error),
                        }))),
                    ),
            ),
        ),
    )

    loadMoreProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.loadMoreProducts),
            withLatestFrom(
                this.store.select(selectCurrentPage),
                this.store.select(selectPageSize),
                this.store.select(selectProductFilters),
                this.store.select(selectProductSortBy),
            ),
            switchMap(([action, currentPage, pageSize, filters, sortBy]) => {
                const nextPage = currentPage + 1;
                const skip = (nextPage - 1) * pageSize;

                let params = new HttpParams()
                    .set('limit', pageSize.toString())
                    .set('sortBy', sortBy.toString())
                    .set('order', 'asc')
                    .set('skip', skip.toString());

                if (filters?.category) {
                    return this.productService.getProductsByCategory(params, filters.category).pipe(
                        map(response => ProductActions.loadMoreProductsSuccess({
                            products: response.products,
                            hasMore: response.skip + response.limit < response.total,
                        })),
                        catchError(error => of(ProductActions.loadProductsFailure({
                            error: this.getErrorMessage(error),
                        }))),
                    );
                } else {
                    return this.productService.getProducts(params).pipe(
                        map(response => ProductActions.loadMoreProductsSuccess({
                            products: response.products,
                            hasMore: response.skip + response.limit < response.total,
                        })),
                        catchError(error => of(ProductActions.loadProductsFailure({
                            error: this.getErrorMessage(error),
                        }))),
                    );
                }
            }),
        ),
    );

    filterProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.filterProducts),
            switchMap(({filters}) => {
                return of(ProductActions.loadProducts({
                    filters,
                    page: 1,
                }));
            }),
        ),
    );

    sortProducts$ = createEffect(() =>
            this.actions$.pipe(
                ofType(ProductActions.sortProducts),
                map(() => ({type: 'SORT_APPLIED'})),
            ),
        {dispatch: false},
    );

    searchProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.searchProducts),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(({query}) => {
                if (!query.trim()) {
                    return of(ProductActions.clearFilters());
                }

                return this.productService.searchProducts(query).pipe(
                    map(response => ProductActions.loadProductsSuccess({
                        products: response.products,
                        totalCount: response.total,
                        hasMore: response.skip + response.limit < response.total,
                        filters: {search: query},
                        currentPage: 1,
                    })),
                    catchError(error => of(ProductActions.loadProductsFailure({
                        error: this.getErrorMessage(error),
                    }))),
                );
            }),
        ),
    );

    loadProductDetail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.loadProductDetail),
            switchMap(({productId}) =>
                this.productService.getProductById(productId).pipe(
                    filter((product): product is Product => !!product),
                    map((product: Product) => ProductActions.loadProductDetailSuccess({product})),
                    catchError(error => of(ProductActions.loadProductDetailFailure({
                        error: this.getErrorMessage(error),
                    }))),
                ),
            ),
        ),
    );

    private getErrorMessage(error: any): string {
        if (error.status === 0) {
            return 'Network error: Please check your internet connection';
        }
        if (error.status === 404) {
            return 'Product not found';
        }
        if (error.error?.message) {
            return error.error.message;
        }
        return 'An unexpected error occurred. Please try again.';
    }
}
