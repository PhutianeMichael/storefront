import { createFeatureSelector, createSelector } from '@ngrx/store';
import { productAdapter, productFeatureKey, ProductState } from './product.reducer';
import { Product } from '../models/product.model';
import { ProductFilter, SortOption } from './product.actions';

export const selectProductState = createFeatureSelector<ProductState>(productFeatureKey);

export const {
  selectAll: selectAllProducts,
  selectEntities: selectProductEntities,
} = productAdapter.getSelectors(selectProductState);

export const selectProductsLoading = createSelector(
  selectProductState,
  (state: ProductState) => state.loading,
);

export const selectProductsLoaded = createSelector(
  selectProductState,
  (state: ProductState) => state.loaded,
);

export const selectProductsError = createSelector(
  selectProductState,
  (state: ProductState) => state.error,
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  selectProductEntities,
  (state, entities) => state.selectedProductId ? entities[state.selectedProductId] : null,
);

export const selectProductFilters = createSelector(
  selectProductState,
  (state: ProductState) => state.filters,
);

export const selectProductSortBy = createSelector(
  selectProductState,
  (state: ProductState) => state.sortBy,
);

export const selectTotalCount = createSelector(
  selectProductState,
  (state: ProductState) => state.totalCount,
);

export const selectHasMoreProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.hasMore,
);

export const selectCurrentPage = createSelector(
  selectProductState,
  (state: ProductState) => state.currentPage,
);

export const selectPageSize = createSelector(
  selectProductState,
  (state: ProductState) => state.pageSize,
);

export const selectCategories = createSelector(
  selectProductState,
  (state: ProductState) => state.categories,
);

export const selectFilteredProducts = createSelector(
  selectAllProducts,
  selectProductFilters,
  (products: Product[], filters: Partial<ProductFilter>) => {
    if (!filters || Object.keys(filters).length === 0) {
      return products;
    }

    return products.filter(product => {
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        if (!matchesSearch) return false;
      }

      if (filters.category && product.category !== filters.category) {
        return false;
      }

      if (filters.priceRange && (product.price < filters.priceRange.min || product.price > filters.priceRange.max)) {
        return false;
      }

      if (filters.rating && product.rating < filters.rating) {
        return false;
      }

      if (filters.inStock && product.stock <= 0) {
        return false;
      }

      if (filters.onSale && product.discountPercentage <= 0) {
        return false;
      }

      if (filters.brand && filters.brand.length > 0) {
        if (!product.brand || !filters.brand.includes(product.brand)) {
          return false;
        }
      }

      if (filters.availabilityStatus && product.availabilityStatus !== filters.availabilityStatus) {
        return false;
      }

      if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
        if (!product.tags || !filters.tags.some(tag => product.tags.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  },
);

export const selectSortedProducts = createSelector(
  selectFilteredProducts,
  selectProductSortBy,
  (products: Product[], sortBy: SortOption) => {
    const sortedProducts = [...products];

    switch (sortBy) {
      case 'price-low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'rating':
        return sortedProducts.sort((a, b) => b.rating - a.rating);
      case 'title':
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      case 'discount':
        return sortedProducts.sort((a, b) => b.discountPercentage - a.discountPercentage);
      case 'stock':
        return sortedProducts.sort((a, b) => b.stock - a.stock);
      case 'newest':
        return sortedProducts.sort((a, b) => b.id - a.id);
      case 'popular':
        return sortedProducts.sort((a, b) => b.rating - a.rating);
      default:
        return sortedProducts;
    }
  },
);

export const selectFilteredProductsCount = createSelector(
  selectFilteredProducts,
  (products: Product[]) => products.length,
);

export const selectCurrentViewProducts = createSelector(
  selectSortedProducts,
  selectCurrentPage,
  selectPageSize,
  (products: Product[], currentPage: number, pageSize: number) => {
    return products.slice(0, currentPage * pageSize);
  },
);
