import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ProductEffects } from './product.effects';
import * as ProductActions from './product.actions';
import { Product } from '../models/product.model';
import { selectCurrentPage, selectPageSize, selectProductFilters, selectProductSortBy } from './product.selectors';

const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    brand: 'Test Brand',
    category: 'electronics',
    thumbnail: 'test.jpg',
    images: ['test1.jpg', 'test2.jpg'],
    tags: ['tag1', 'tag2'],
    availabilityStatus: 'In Stock',
    sku: 'TEST123',
    weight: 500,
    dimensions: {width: 10, height: 20, depth: 5},
    warrantyInformation: '1 year',
    shippingInformation: 'Free shipping',
    returnPolicy: '30 days',
    reviews: [],
    meta: {
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        barcode: 'BARCODE1',
        qrCode: 'QRCODE1',
    },
};

const mockProductsResponse = {
    products: [mockProduct],
    total: 100,
    skip: 0,
    limit: 12,
};

describe('ProductEffects', () => {
    let actions$: Observable<any>;
    let effects: ProductEffects;
    let httpMock: HttpTestingController;
    let store: MockStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ProductEffects,
                provideMockActions(() => actions$),
                provideMockStore({
                    selectors: [
                        {selector: selectCurrentPage, value: 1},
                        {selector: selectPageSize, value: 12},
                        {selector: selectProductFilters, value: {}},
                        {selector: selectProductSortBy, value: 'title'},
                    ],
                }),
            ],
        });

        effects = TestBed.inject(ProductEffects);
        httpMock = TestBed.inject(HttpTestingController);
        store = TestBed.inject(MockStore);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('loadProducts$', () => {
        it('should dispatch loadProductsSuccess on successful API call', (done) => {
            actions$ = of(ProductActions.loadProducts({category: 'electronics'}));

            effects.loadProducts$.subscribe(action => {
                expect(action).toEqual(ProductActions.loadProductsSuccess({
                    products: [mockProduct],
                    totalCount: 100,
                    hasMore: true,
                    filters: {category: 'electronics'},
                    sort: 'title',
                    currentPage: 1,
                }));
                done();
            });

            const req = httpMock.expectOne(
                req => req.url === 'https://dummyjson.com/products/category/electronics' &&
                    req.params.get('limit') === '12' &&
                    req.params.get('sortBy') === 'title' &&
                    req.params.get('order') === 'asc' &&
                    req.params.get('skip') === '0',
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockProductsResponse);
        });

        it('should handle API errors', (done) => {
            actions$ = of(ProductActions.loadProducts({}));

            effects.loadProducts$.subscribe(action => {
                expect(action).toEqual(ProductActions.loadProductsFailure({
                    error: 'Network error: Please check your internet connection',
                }));
                done();
            });

            const req = httpMock.expectOne(req =>
                req.url === 'https://dummyjson.com/products' &&
                req.params.get('limit') === '12' &&
                req.params.get('sortBy') === 'title' &&
                req.params.get('order') === 'asc' &&
                req.params.get('skip') === '0',
            );
            req.error(new ProgressEvent('network error'));
        });

        it('should handle 404 errors', (done) => {
            actions$ = of(ProductActions.loadProducts({}));

            effects.loadProducts$.subscribe(action => {
                expect(action).toEqual(ProductActions.loadProductsFailure({
                    error: 'Product not found',
                }));
                done();
            });

            const req = httpMock.expectOne(req =>
                req.url === 'https://dummyjson.com/products' &&
                req.params.get('limit') === '12' &&
                req.params.get('sortBy') === 'title' &&
                req.params.get('order') === 'asc' &&
                req.params.get('skip') === '0',
            );
            req.flush({message: 'Not found'}, {status: 404, statusText: 'Not Found'});
        });
    });

    describe('loadMoreProducts$', () => {
        it('should dispatch loadMoreProductsSuccess on successful API call', (done) => {
            store.overrideSelector(selectCurrentPage, 1);
            store.overrideSelector(selectPageSize, 12);

            actions$ = of(ProductActions.loadMoreProducts());

            effects.loadMoreProducts$.subscribe(action => {
                expect(action).toEqual(ProductActions.loadMoreProductsSuccess({
                    products: [mockProduct],
                    hasMore: true,
                }));
                done();
            });

            const req = httpMock.expectOne(req =>
                req.url === 'https://dummyjson.com/products' &&
                req.params.get('limit') === '12' &&
                req.params.get('sortBy') === 'title' &&
                req.params.get('order') === 'asc' &&
                req.params.get('skip') === '12',
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockProductsResponse);
        });
    });

    describe('searchProducts$', () => {
        it('should dispatch loadProductsSuccess on successful search', (done) => {
            actions$ = of(ProductActions.searchProducts({query: 'test'}));

            effects.searchProducts$.subscribe(action => {
                expect(action).toEqual(ProductActions.loadProductsSuccess({
                    products: [mockProduct],
                    totalCount: 100,
                    hasMore: true,
                    filters: {search: 'test'},
                    currentPage: 1,
                }));
                done();
            });

            const req = httpMock.expectOne('https://dummyjson.com/products/search?q=test');
            req.flush(mockProductsResponse);
        });

        it('should dispatch clearFilters for empty query', (done) => {
            actions$ = of(ProductActions.searchProducts({query: ''}));

            effects.searchProducts$.subscribe(action => {
                expect(action).toEqual(ProductActions.clearFilters());
                done();
            });
        });

        it('should debounce search requests', (done) => {
            let callCount = 0;
            const queries = ['t', 'te', 'tes', 'test'];

            actions$ = of(...queries.map(query =>
                ProductActions.searchProducts({query}),
            ));

            effects.searchProducts$.subscribe(action => {
                callCount++;
                if (callCount === 1) {
                    expect(action).toEqual(ProductActions.loadProductsSuccess({
                        products: [mockProduct],
                        totalCount: 100,
                        hasMore: true,
                        filters: {search: 'test'},
                        currentPage: 1,
                    }));
                    done();
                }
            });

            const req = httpMock.expectOne('https://dummyjson.com/products/search?q=test');
            req.flush(mockProductsResponse);
        });
    });

    describe('loadProductDetail$', () => {
        it('should dispatch loadProductDetailSuccess on successful API call', (done) => {
            actions$ = of(ProductActions.loadProductDetail({productId: 1}));

            effects.loadProductDetail$.subscribe(action => {
                expect(action).toEqual(ProductActions.loadProductDetailSuccess({
                    product: mockProduct,
                }));
                done();
            });

            const req = httpMock.expectOne('https://dummyjson.com/products/1');
            req.flush(mockProduct);
        });

        it('should handle product detail errors', (done) => {
            actions$ = of(ProductActions.loadProductDetail({productId: 999}));

            effects.loadProductDetail$.subscribe(action => {
                expect(action).toEqual(ProductActions.loadProductDetailFailure({
                    error: 'Product not found',
                }));
                done();
            });

            const req = httpMock.expectOne('https://dummyjson.com/products/999');
            req.flush({message: 'Not found'}, {status: 404, statusText: 'Not Found'});
        });
    });

    describe('filterProducts$', () => {
        it('should dispatch loadProducts with filters', (done) => {
            actions$ = of(ProductActions.filterProducts({
                filters: {rating: 4, brand: ['Test']},
            }));

            effects.filterProducts$.subscribe(action => {
                expect(action).toEqual(ProductActions.loadProducts({
                    filters: {rating: 4, brand: ['Test']},
                    page: 1,
                }));
                done();
            });
        });
    });

    describe('sortProducts$', () => {
        it('should not dispatch any action', (done) => {
            actions$ = of(ProductActions.sortProducts({sortBy: 'price-high'}));

            effects.sortProducts$.subscribe(action => {
                expect(action).toEqual({type: 'SORT_APPLIED'});
                done();
            });
        });
    });

    describe('loadCategoryList$', () => {
        it('should dispatch loadCategoryListSuccess on successful API call', (done) => {
            const mockCategories = ['electronics', 'furniture', 'clothing'];
            actions$ = of(ProductActions.loadCategoryList());
            effects.loadProductCategoryList$.subscribe(action => {
                expect(action).toEqual(ProductActions.loadCategoryListSuccess({categories: mockCategories}));
                done();
            });
            const req = httpMock.expectOne('https://dummyjson.com/products/category-list');
            expect(req.request.method).toBe('GET');
            req.flush(mockCategories);
        });

        it('should dispatch loadCategoryListFailure on API error', (done) => {
            actions$ = of(ProductActions.loadCategoryList());
            effects.loadProductCategoryList$.subscribe(action => {
                expect(action.type).toBe(ProductActions.loadCategoryListFailure.type);
                if ('error' in action) {
                    expect(action.error).toBeDefined();
                }
                done();
            });
            const req = httpMock.expectOne('https://dummyjson.com/products/category-list');
            req.flush({message: 'Not found'}, {status: 404, statusText: 'Not Found'});
        });
    });
});
