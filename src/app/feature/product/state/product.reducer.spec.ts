import { initialState, productReducer } from './product.reducer';
import * as ProductActions from './product.actions';
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

const mockProducts: Product[] = [
    mockProduct,
    {
        ...mockProduct,
        id: 2,
        title: 'Test Product 2',
        category: 'beauty',
        brand: 'Brand 2',
    },
];

describe('Product Reducer', () => {
    it('should return the initial state', () => {
        const action = {} as any;
        const state = productReducer(undefined, action);
        expect(state).toEqual(initialState);
    });

    describe('loadProducts', () => {
        it('should set loading to true and clear error', () => {
            const action = ProductActions.loadProducts({category: 'electronics'});
            const state = productReducer(initialState, action);

            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
            expect(state.filters.category).toBe('electronics');
        });

        it('should update filters and reset current page', () => {
            const action = ProductActions.loadProducts({
                category: 'electronics',
                filters: {rating: 4},
                page: 2,
            });
            const state = productReducer(initialState, action);

            expect(state.filters.category).toBe('electronics');
            expect(state.filters.rating).toBe(4);
            expect(state.currentPage).toBe(2);
        });
    });

    describe('loadProductsSuccess', () => {
        it('should update state with products and metadata', () => {
            const loadAction = ProductActions.loadProducts({});
            const stateAfterLoad = productReducer(initialState, loadAction);

            const successAction = ProductActions.loadProductsSuccess({
                products: mockProducts,
                totalCount: 100,
                hasMore: true,
                currentPage: 1,
            });

            const state = productReducer(stateAfterLoad, successAction);

            expect(state.loading).toBe(false);
            expect(state.loaded).toBe(true);
            expect(state.error).toBeNull();
            expect(state.totalCount).toBe(100);
            expect(state.hasMore).toBe(true);
            expect(state.currentPage).toBe(1);
            expect(state.entities[1]).toEqual(mockProducts[0]);
            expect(state.entities[2]).toEqual(mockProducts[1]);

            expect(state.brands).toEqual(['Test Brand', 'Brand 2']);
            expect(state.tags).toEqual(['tag1', 'tag2']);
        });
    });

    describe('loadProductsFailure', () => {
        it('should set error and stop loading', () => {
            const loadAction = ProductActions.loadProducts({});
            const stateAfterLoad = productReducer(initialState, loadAction);

            const errorAction = ProductActions.loadProductsFailure({
                error: 'Failed to load',
            });

            const state = productReducer(stateAfterLoad, errorAction);

            expect(state.loading).toBe(false);
            expect(state.error).toBe('Failed to load');
        });
    });

    describe('loadMoreProducts', () => {
        it('should set loading to true', () => {
            const action = ProductActions.loadMoreProducts();
            const state = productReducer(initialState, action);

            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
        });
    });

    describe('loadMoreProductsSuccess', () => {
        it('should add products and update pagination state', () => {
            const initialStateWithProducts = {
                ...initialState,
                ids: [1],
                entities: {1: mockProducts[0]},
                currentPage: 1,
            };

            const action = ProductActions.loadMoreProductsSuccess({
                products: [mockProducts[1]],
                hasMore: false,
            });

            const state = productReducer(initialStateWithProducts, action);

            expect(state.loading).toBe(false);
            expect(state.hasMore).toBe(false);
            expect(state.currentPage).toBe(2);
            expect(state.ids).toEqual([1, 2]);
            expect(state.entities[2]).toEqual(mockProducts[1]);
        });
    });

    describe('filterProducts', () => {
        it('should update filters and reset page', () => {
            const action = ProductActions.filterProducts({
                filters: {rating: 4, brand: ['Test Brand']},
            });

            const state = productReducer(initialState, action);

            expect(state.filters.rating).toBe(4);
            expect(state.filters.brand).toEqual(['Test Brand']);
            expect(state.currentPage).toBe(1);
        });
    });

    describe('sortProducts', () => {
        it('should update sortBy and reset page', () => {
            const action = ProductActions.sortProducts({sortBy: 'price-high'});
            const state = productReducer(initialState, action);

            expect(state.sortBy).toBe('price-high');
            expect(state.currentPage).toBe(1);
        });
    });

    describe('searchProducts', () => {
        it('should update searchQuery and reset page', () => {
            const action = ProductActions.searchProducts({query: 'test'});
            const state = productReducer(initialState, action);

            expect(state.searchQuery).toBe('test');
            expect(state.currentPage).toBe(1);
        });
    });

    describe('clearFilters', () => {
        it('should reset all filters and search', () => {
            const stateWithFilters = {
                ...initialState,
                filters: {category: 'electronics', rating: 4},
                searchQuery: 'test',
                sortBy: 'price-high' as const,
                currentPage: 3,
            };

            const action = ProductActions.clearFilters();
            const state = productReducer(stateWithFilters, action);

            expect(state.filters).toEqual({});
            expect(state.searchQuery).toBe('');
            expect(state.sortBy).toBe('newest');
            expect(state.currentPage).toBe(1);
        });
    });

    describe('product detail actions', () => {
        it('should handle loadProductDetail', () => {
            const action = ProductActions.loadProductDetail({productId: 1});
            const state = productReducer(initialState, action);

            expect(state.loading).toBe(true);
            expect(state.selectedProductId).toBe(1);
            expect(state.error).toBeNull();
        });

        it('should handle loadProductDetailSuccess', () => {
            const action = ProductActions.loadProductDetailSuccess({
                product: mockProduct,
            });

            const state = productReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.selectedProductId).toBe(1);
            expect(state.entities[1]).toEqual(mockProduct);
        });

        it('should handle loadProductDetailFailure', () => {
            const action = ProductActions.loadProductDetailFailure({
                error: 'Not found',
            });

            const state = productReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.error).toBe('Not found');
        });

        it('should handle clearSelectedProduct', () => {
            const stateWithSelection = {...initialState, selectedProductId: 1};
            const action = ProductActions.clearSelectedProduct();
            const state = productReducer(stateWithSelection, action);

            expect(state.selectedProductId).toBeNull();
        });

        it('should handle setSelectedProduct', () => {
            const action = ProductActions.setSelectedProduct({productId: 5});
            const state = productReducer(initialState, action);

            expect(state.selectedProductId).toBe(5);
        });
    });

    describe('loadCategoryListSuccess', () => {
        it('should update categories in state', () => {
            const categories = ['electronics', 'furniture', 'clothing'];
            const action = ProductActions.loadCategoryListSuccess({categories});
            const state = productReducer(initialState, action);
            expect(state.categories).toEqual(categories);
        });
    });

    describe('loadCategoryListFailure', () => {
        it('should set error in state', () => {
            const error = 'Failed to load categories';
            const action = ProductActions.loadCategoryListFailure({error});
            const state = productReducer(initialState, action);
            expect(state.error).toBe(error);
        });
    });
});
