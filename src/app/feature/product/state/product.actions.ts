import { createAction, props } from '@ngrx/store';
import { Product } from '../models/product.model';

export interface ProductFilter {
    category?: string;
    priceRange?: { min: number; max: number };
    brand?: string[];
    rating?: number;
    inStock?: boolean;
    onSale?: boolean;
    search?: string;
    availabilityStatus?: string;
    tags?: string[];
}

export type SortOption =
    | 'title'
    | 'price-low'
    | 'price-high'
    | 'rating'
    | 'newest'
    | 'popular'
    | 'discount'
    | 'stock';

export const loadCategoryList = createAction(
    '[ProductList] Load Category List',
)

export const loadCategoryListSuccess = createAction(
    '[ProductList] Load Category ListSuccess',
    props<{ categories: string[] }>(),
)

export const loadCategoryListFailure = createAction(
    '[ProductList] Load Category ListFailure',
    props<{ error: string }>(),
)

export const loadProducts = createAction(
    '[Product] Load Products',
    props<{
        category?: string;
        filters?: Partial<ProductFilter>;
        sort?: SortOption;
        limit?: number;
        page?: number;
    }>(),
);

export const loadProductsSuccess = createAction(
    '[Product] Load Products Success',
    props<{
        products: Product[];
        totalCount: number;
        hasMore: boolean;
        sort?: SortOption;
        filters?: Partial<ProductFilter>;
        currentPage?: number;
    }>(),
);

export const loadProductsFailure = createAction(
    '[Product] Load Products Failure',
    props<{ error: string }>(),
);

export const loadProductDetail = createAction(
    '[Product] Load Product Detail',
    props<{ productId: number }>(),
);

export const loadProductDetailSuccess = createAction(
    '[Product] Load Product Detail Success',
    props<{ product: Product }>(),
);

export const loadProductDetailFailure = createAction(
    '[Product] Load Product Detail Failure',
    props<{ error: string }>(),
);

export const filterProducts = createAction(
    '[Product] Filter Products',
    props<{ filters: Partial<ProductFilter> }>(),
);

export const sortProducts = createAction(
    '[Product] Sort Products',
    props<{ sortBy: SortOption }>(),
);

export const searchProducts = createAction(
    '[Product] Search Products',
    props<{ query: string }>(),
);

export const clearFilters = createAction('[Product] Clear Filters');

export const loadMoreProducts = createAction('[Product] Load More Products');

export const loadMoreProductsSuccess = createAction(
    '[Product] Load More Products Success',
    props<{ products: Product[]; hasMore: boolean }>(),
);

export const clearSelectedProduct = createAction('[Product] Clear Selected Product');

export const setSelectedProduct = createAction(
    '[Product] Set Selected Product',
    props<{ productId: number }>(),
);
