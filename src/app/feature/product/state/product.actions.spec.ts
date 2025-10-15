import * as ProductActions from './product.actions';
import { ProductFilter, SortOption } from './product.actions';
import { Product } from '../models/product.model';

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

const mockProducts: Product[] = [mockProduct];

describe('Product Actions', () => {
    describe('Load Products Actions', () => {
        it('should create loadProducts action with no parameters', () => {
            const action = ProductActions.loadProducts({});

            expect(action.type).toBe('[Product] Load Products');
            expect(action.category).toBeUndefined();
            expect(action.filters).toBeUndefined();
            expect(action.sort).toBeUndefined();
            expect(action.limit).toBeUndefined();
            expect(action.page).toBeUndefined();
        });

        it('should create loadProducts action with all parameters', () => {
            const filters: Partial<ProductFilter> = {
                category: 'electronics',
                rating: 4,
                priceRange: {min: 50, max: 200},
            };

            const action = ProductActions.loadProducts({
                category: 'electronics',
                filters,
                sort: 'price-high' as SortOption,
                limit: 24,
                page: 2,
            });

            expect(action.type).toBe('[Product] Load Products');
            expect(action.category).toBe('electronics');
            expect(action.filters).toEqual(filters);
            expect(action.sort).toBe('price-high');
            expect(action.limit).toBe(24);
            expect(action.page).toBe(2);
        });

        it('should create loadProductsSuccess action', () => {
            const action = ProductActions.loadProductsSuccess({
                products: mockProducts,
                totalCount: 100,
                hasMore: true,
                filters: {category: 'electronics'},
                currentPage: 1,
            });

            expect(action.type).toBe('[Product] Load Products Success');
            expect(action.products).toEqual(mockProducts);
            expect(action.totalCount).toBe(100);
            expect(action.hasMore).toBe(true);
            expect(action.filters).toEqual({category: 'electronics'});
            expect(action.currentPage).toBe(1);
        });

        it('should create loadProductsSuccess action without optional parameters', () => {
            const action = ProductActions.loadProductsSuccess({
                products: mockProducts,
                totalCount: 100,
                hasMore: false,
            });

            expect(action.type).toBe('[Product] Load Products Success');
            expect(action.products).toEqual(mockProducts);
            expect(action.totalCount).toBe(100);
            expect(action.hasMore).toBe(false);
            expect(action.filters).toBeUndefined();
            expect(action.currentPage).toBeUndefined();
        });

        it('should create loadProductsFailure action', () => {
            const action = ProductActions.loadProductsFailure({
                error: 'Failed to load products',
            });

            expect(action.type).toBe('[Product] Load Products Failure');
            expect(action.error).toBe('Failed to load products');
        });
    });

    describe('Load More Products Actions', () => {
        it('should create loadMoreProducts action', () => {
            const action = ProductActions.loadMoreProducts();

            expect(action.type).toBe('[Product] Load More Products');
        });

        it('should create loadMoreProductsSuccess action', () => {
            const action = ProductActions.loadMoreProductsSuccess({
                products: mockProducts,
                hasMore: true,
            });

            expect(action.type).toBe('[Product] Load More Products Success');
            expect(action.products).toEqual(mockProducts);
            expect(action.hasMore).toBe(true);
        });
    });

    describe('Product Detail Actions', () => {
        it('should create loadProductDetail action', () => {
            const action = ProductActions.loadProductDetail({
                productId: 123,
            });

            expect(action.type).toBe('[Product] Load Product Detail');
            expect(action.productId).toBe(123);
        });

        it('should create loadProductDetailSuccess action', () => {
            const action = ProductActions.loadProductDetailSuccess({
                product: mockProduct,
            });

            expect(action.type).toBe('[Product] Load Product Detail Success');
            expect(action.product).toEqual(mockProduct);
        });

        it('should create loadProductDetailFailure action', () => {
            const action = ProductActions.loadProductDetailFailure({
                error: 'Product not found',
            });

            expect(action.type).toBe('[Product] Load Product Detail Failure');
            expect(action.error).toBe('Product not found');
        });

        it('should create clearSelectedProduct action', () => {
            const action = ProductActions.clearSelectedProduct();

            expect(action.type).toBe('[Product] Clear Selected Product');
        });

        it('should create setSelectedProduct action', () => {
            const action = ProductActions.setSelectedProduct({
                productId: 456,
            });

            expect(action.type).toBe('[Product] Set Selected Product');
            expect(action.productId).toBe(456);
        });
    });

    describe('Filter and Sort Actions', () => {
        it('should create filterProducts action', () => {
            const filters: Partial<ProductFilter> = {
                category: 'electronics',
                rating: 4,
                brand: ['Sony', 'Samsung'],
                priceRange: {min: 100, max: 1000},
            };

            const action = ProductActions.filterProducts({
                filters,
            });

            expect(action.type).toBe('[Product] Filter Products');
            expect(action.filters).toEqual(filters);
        });

        it('should create filterProducts action with empty filters', () => {
            const action = ProductActions.filterProducts({
                filters: {},
            });

            expect(action.type).toBe('[Product] Filter Products');
            expect(action.filters).toEqual({});
        });

        it('should create sortProducts action', () => {
            const action = ProductActions.sortProducts({
                sortBy: 'price-high' as SortOption,
            });

            expect(action.type).toBe('[Product] Sort Products');
            expect(action.sortBy).toBe('price-high');
        });

        it('should create sortProducts action with all sort options', () => {
            const sortOptions: SortOption[] = [
                'title',
                'price-low',
                'price-high',
                'rating',
                'newest',
                'popular',
                'discount',
                'stock',
            ];

            sortOptions.forEach(sortOption => {
                const action = ProductActions.sortProducts({sortBy: sortOption});
                expect(action.type).toBe('[Product] Sort Products');
                expect(action.sortBy).toBe(sortOption);
            });
        });

        it('should create searchProducts action', () => {
            const action = ProductActions.searchProducts({
                query: 'smartphone',
            });

            expect(action.type).toBe('[Product] Search Products');
            expect(action.query).toBe('smartphone');
        });

        it('should create searchProducts action with empty query', () => {
            const action = ProductActions.searchProducts({
                query: '',
            });

            expect(action.type).toBe('[Product] Search Products');
            expect(action.query).toBe('');
        });

        it('should create clearFilters action', () => {
            const action = ProductActions.clearFilters();

            expect(action.type).toBe('[Product] Clear Filters');
        });
    });

    describe('Category List Actions', () => {
        it('should create loadCategoryList action', () => {
            const action = ProductActions.loadCategoryList();
            expect(action.type).toBe('[ProductList] Load Category List');
        });

        it('should create loadCategoryListSuccess action', () => {
            const categories = ['beauty', 'fragrances', 'furniture', 'groceries'];
            const action = ProductActions.loadCategoryListSuccess({categories});
            expect(action.type).toBe('[ProductList] Load Category ListSuccess');
            expect(action.categories).toEqual(categories);
        });

        it('should create loadCategoryListFailure action', () => {
            const error = 'Failed to load categories';
            const action = ProductActions.loadCategoryListFailure({error});
            expect(action.type).toBe('[ProductList] Load Category ListFailure');
            expect(action.error).toBe(error);
        });
    });

    describe('Action Type Guards', () => {
        it('should have correct action type strings', () => {
            expect(ProductActions.loadProducts.type).toBe('[Product] Load Products');
            expect(ProductActions.loadProductsSuccess.type).toBe('[Product] Load Products Success');
            expect(ProductActions.loadProductsFailure.type).toBe('[Product] Load Products Failure');
            expect(ProductActions.loadMoreProducts.type).toBe('[Product] Load More Products');
            expect(ProductActions.loadMoreProductsSuccess.type).toBe('[Product] Load More Products Success');
            expect(ProductActions.loadProductDetail.type).toBe('[Product] Load Product Detail');
            expect(ProductActions.loadProductDetailSuccess.type).toBe('[Product] Load Product Detail Success');
            expect(ProductActions.loadProductDetailFailure.type).toBe('[Product] Load Product Detail Failure');
            expect(ProductActions.filterProducts.type).toBe('[Product] Filter Products');
            expect(ProductActions.sortProducts.type).toBe('[Product] Sort Products');
            expect(ProductActions.searchProducts.type).toBe('[Product] Search Products');
            expect(ProductActions.clearFilters.type).toBe('[Product] Clear Filters');
            expect(ProductActions.clearSelectedProduct.type).toBe('[Product] Clear Selected Product');
            expect(ProductActions.setSelectedProduct.type).toBe('[Product] Set Selected Product');
            expect(ProductActions.loadCategoryList.type).toBe('[ProductList] Load Category List');
            expect(ProductActions.loadCategoryListSuccess.type).toBe('[ProductList] Load Category ListSuccess');
            expect(ProductActions.loadCategoryListFailure.type).toBe('[ProductList] Load Category ListFailure');
        });
    });

    describe('Action Creator Functions', () => {
        it('should create actions with correct payload structures', () => {
            const action1 = ProductActions.loadProducts({});
            expect(action1.type).toBe('[Product] Load Products');
            expect(action1.category).toBeUndefined();
            expect(action1.filters).toBeUndefined();
            expect(action1.sort).toBeUndefined();
            expect(action1.limit).toBeUndefined();
            expect(action1.page).toBeUndefined();

            const action2 = ProductActions.loadProducts({category: 'electronics'});
            expect(action2.type).toBe('[Product] Load Products');
            expect(action2.category).toBe('electronics');
            expect(action2.filters).toBeUndefined();
            expect(action2.sort).toBeUndefined();
            expect(action2.limit).toBeUndefined();
            expect(action2.page).toBeUndefined();

            const successAction = ProductActions.loadProductsSuccess({
                products: mockProducts,
                totalCount: 50,
                hasMore: true,
            });
            expect(successAction.type).toBe('[Product] Load Products Success');
            expect(successAction.products).toEqual(mockProducts);
            expect(successAction.totalCount).toBe(50);
            expect(successAction.hasMore).toBe(true);
            expect(successAction.filters).toBeUndefined();
            expect(successAction.currentPage).toBeUndefined();

            const filterAction = ProductActions.filterProducts({
                filters: {category: 'electronics', rating: 4},
            });
            expect(filterAction.type).toBe('[Product] Filter Products');
            expect(filterAction.filters).toEqual({category: 'electronics', rating: 4});
        });
    });

    describe('TypeScript Type Validation', () => {
        it('should enforce ProductFilter interface', () => {
            const validFilter: ProductFilter = {
                category: 'electronics',
                priceRange: {min: 100, max: 1000},
                brand: ['Sony', 'Samsung'],
                rating: 4,
                inStock: true,
                onSale: false,
                search: 'smartphone',
                availabilityStatus: 'In Stock',
                tags: ['wireless', 'bluetooth'],
            };

            expect(validFilter).toBeDefined();

            const partialFilter: Partial<ProductFilter> = {
                category: 'electronics',
                rating: 4,
            };

            expect(partialFilter).toBeDefined();
        });

        it('should enforce SortOption type', () => {
            const validSortOptions: SortOption[] = [
                'title',
                'price-low',
                'price-high',
                'rating',
                'newest',
                'popular',
                'discount',
                'stock',
            ];

            validSortOptions.forEach(option => {
                expect(option).toBeDefined();
            });

            // @ts-expect-error - Testing invalid sort option
            const invalidOption: SortOption = 'invalid-sort';
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined and null values in filters', () => {
            const action = ProductActions.filterProducts({
                filters: {
                    category: undefined,
                    rating: undefined,
                    // @ts-ignore - testing edge case
                    brand: null,
                    // @ts-ignore - testing edge case
                    priceRange: undefined,
                },
            });

            expect(action.type).toBe('[Product] Filter Products');
            expect(action.filters.category).toBeUndefined();
            expect(action.filters.rating).toBeUndefined();
            expect(action.filters.brand).toBeNull();
            expect(action.filters.priceRange).toBeUndefined();
        });

        it('should handle empty arrays in filters', () => {
            const action = ProductActions.filterProducts({
                filters: {
                    brand: [],
                    tags: [],
                },
            });

            expect(action.type).toBe('[Product] Filter Products');
            expect(action.filters).toEqual({
                brand: [],
                tags: [],
            });
        });

        it('should handle extreme values in filters', () => {
            const action = ProductActions.filterProducts({
                filters: {
                    rating: 5,
                    priceRange: {min: 0, max: Number.MAX_SAFE_INTEGER},
                },
            });

            expect(action.type).toBe('[Product] Filter Products');
            expect(action.filters.rating).toBe(5);
            expect(action.filters.priceRange?.min).toBe(0);
            expect(action.filters.priceRange?.max).toBe(Number.MAX_SAFE_INTEGER);
        });
    });

    describe('Action Serialization', () => {
        it('should be JSON serializable', () => {
            const actions = [
                ProductActions.loadProducts({category: 'electronics'}),
                ProductActions.loadProductsSuccess({
                    products: mockProducts,
                    totalCount: 100,
                    hasMore: true,
                }),
                ProductActions.filterProducts({
                    filters: {category: 'electronics', rating: 4},
                }),
                ProductActions.searchProducts({query: 'test'}),
            ];

            actions.forEach(action => {
                const serialized = JSON.stringify(action);
                const deserialized = JSON.parse(serialized);

                expect(deserialized.type).toBe(action.type);
                if (action.type === '[Product] Search Products') {
                    expect(deserialized.query).toBe('test');
                }
            });
        });
    });
});
