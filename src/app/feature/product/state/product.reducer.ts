import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as ProductActions from './product.actions';
import { ProductFilter, SortOption } from './product.actions';
import { Product } from '../models/product.model';

export const productAdapter = createEntityAdapter<Product>({
    selectId: (product) => product.id,
    sortComparer: false,
});

export interface ProductState extends EntityState<Product> {
    loading: boolean;
    loaded: boolean;
    error: string | null;
    selectedProductId: number | null;
    filters: Partial<ProductFilter>;
    sortBy: SortOption;
    searchQuery: string;
    totalCount: number;
    hasMore: boolean;
    currentPage: number;
    pageSize: number;
    categories: string[];
    brands: string[];
    tags: string[];
}

export const initialState: ProductState = productAdapter.getInitialState({
    loading: false,
    loaded: false,
    error: null,
    selectedProductId: null,
    filters: {},
    sortBy: 'newest',
    searchQuery: '',
    totalCount: 0,
    hasMore: false,
    currentPage: 1,
    pageSize: 12,
    categories: [],
    brands: [],
    tags: [],
});

export const productReducer = createReducer(
    initialState,

    on(ProductActions.loadProducts, (state, {category, filters, sort, limit, page}) => ({
        ...state,
        loading: true,
        error: null,
        filters: {...state.filters, ...filters, category},
        sortBy: sort || state.sortBy,
        pageSize: limit || state.pageSize,
        currentPage: page || 1,
    })),

    on(ProductActions.loadCategoryListSuccess, (state, {categories}) => ({
        ...state,
        categories: categories,
    })),

    on(ProductActions.loadCategoryListFailure, (state, {error}) => ({
        ...state,
        error: error,
    })),

    on(ProductActions.loadProductsSuccess, (state, {products, totalCount, hasMore, filters, currentPage, sort}) => {
        const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[];
        const tags = Array.from(new Set(products.flatMap(p => p.tags || [])));
        const sortBy = sort || state.sortBy;

        return productAdapter.setAll(products, {
            ...state,
            loading: false,
            loaded: true,
            error: null,
            totalCount,
            hasMore,
            sortBy,
            filters: filters || state.filters,
            currentPage: currentPage || state.currentPage,
            brands: [...new Set([...state.brands, ...brands])],
            tags: [...new Set([...state.tags, ...tags])],
        });
    }),

    on(ProductActions.loadProductsFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error,
    })),

    on(ProductActions.loadMoreProducts, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(ProductActions.loadMoreProductsSuccess, (state, {products, hasMore}) => {
        const categories = Array.from(new Set(products.map(p => p.category)));
        return productAdapter.addMany(products, {
            ...state,
            loading: false,
            hasMore,
            categories: [...new Set([...state.categories, ...categories])],
            currentPage: state.currentPage + 1,
        });
    }),

    on(ProductActions.loadProductDetail, (state, {productId}) => ({
        ...state,
        loading: true,
        selectedProductId: productId,
        error: null,
    })),

    on(ProductActions.loadProductDetailSuccess, (state, {product}) => {
        return productAdapter.upsertOne(product, {
            ...state,
            loading: false,
            selectedProductId: product.id,
            error: null,
        });
    }),

    on(ProductActions.loadProductDetailFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error,
    })),

    on(ProductActions.clearSelectedProduct, (state) => ({
        ...state,
        selectedProductId: null,
    })),

    on(ProductActions.setSelectedProduct, (state, {productId}) => ({
        ...state,
        selectedProductId: productId,
    })),

    on(ProductActions.filterProducts, (state, {filters}) => ({
        ...state,
        filters: {...state.filters, ...filters},
        currentPage: 1,
    })),

    on(ProductActions.sortProducts, (state, {sortBy}) => ({
        ...state,
        sortBy,
    })),

    on(ProductActions.searchProducts, (state, {query}) => ({
        ...state,
        searchQuery: query,
        currentPage: 1,
    })),

    on(ProductActions.clearFilters, (state) => ({
        ...state,
        filters: {},
        searchQuery: '',
        sortBy: 'newest' as SortOption,
        currentPage: 1,
    })),
);

export const {
    selectAll: selectAllProducts,
    selectEntities: selectProductEntities,
    selectIds: selectProductIds,
    selectTotal: selectProductTotal,
} = productAdapter.getSelectors();

export const productFeatureKey = 'product';
