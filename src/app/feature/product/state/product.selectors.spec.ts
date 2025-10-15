import {
    selectAllProducts,
    selectCategories,
    selectCurrentPage,
    selectCurrentViewProducts,
    selectFilteredProducts,
    selectFilteredProductsCount,
    selectHasMoreProducts,
    selectPageSize,
    selectProductEntities,
    selectProductFilters,
    selectProductsError,
    selectProductsLoaded,
    selectProductsLoading,
    selectProductSortBy,
    selectProductState,
    selectSelectedProduct,
    selectSortedProducts,
    selectTotalCount,
} from './product.selectors';
import { productAdapter, ProductState } from './product.reducer';
import { Product } from '../models/product.model';
import { SortOption } from './product.actions';

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
        title: 'Another Product',
        description: 'Another Description',
        price: 200,
        rating: 3.5,
        category: 'beauty',
        brand: 'Brand 2',
        tags: ['tag3', 'tag4'],
        meta: {
            createdAt: '2023-01-03',
            updatedAt: '2023-01-04',
            barcode: 'BARCODE2',
            qrCode: 'QRCODE2',
        },
    },
    {
        ...mockProduct,
        id: 3,
        title: 'Cheap Product',
        description: 'Affordable item',
        price: 50,
        rating: 4.0,
        category: 'electronics',
        brand: 'Brand 3',
        tags: ['tag5'],
        meta: {
            createdAt: '2023-01-05',
            updatedAt: '2023-01-06',
            barcode: 'BARCODE3',
            qrCode: 'QRCODE3',
        },
    },
];

const createMockState = (overrides: Partial<ProductState> = {}): ProductState => {
    const baseState = productAdapter.getInitialState({
        loading: false,
        loaded: true,
        error: null,
        selectedProductId: null,
        filters: {},
        sortBy: 'newest' as SortOption,
        searchQuery: '',
        totalCount: 100,
        hasMore: true,
        currentPage: 1,
        pageSize: 12,
        categories: ['electronics', 'beauty'],
        brands: ['Test Brand', 'Brand 2', 'Brand 3'],
        tags: ['tag1', 'tag2'],
        ...overrides,
    });

    return productAdapter.setAll(mockProducts, baseState);
};

describe('Product Selectors', () => {
    const mockState = createMockState();

    it('should select the product state', () => {
        const result = selectProductState.projector(mockState);
        expect(result).toEqual(mockState);
    });

    it('should select selected product', () => {
        const stateWithSelection = createMockState({selectedProductId: 1});
        const entities = selectProductEntities({product: stateWithSelection});
        const result = selectSelectedProduct.projector(stateWithSelection, entities);
        expect(result).toEqual(mockProduct);
    });

    it('should select all products', () => {
        const result = selectAllProducts({product: mockState});
        expect(result).toEqual(mockProducts);
    });

    it('should select loading state', () => {
        const result = selectProductsLoading.projector(mockState);
        expect(result).toBe(false);
    });

    it('should select loaded state', () => {
        const result = selectProductsLoaded.projector(mockState);
        expect(result).toBe(true);
    });

    it('should select error state', () => {
        const result = selectProductsError.projector(mockState);
        expect(result).toBeNull();
    });

    it('should select product filters', () => {
        const stateWithFilters = createMockState({
            filters: {category: 'electronics', rating: 4},
        });
        const result = selectProductFilters.projector(stateWithFilters);
        expect(result).toEqual({category: 'electronics', rating: 4});
    });

    it('should select sort by', () => {
        const result = selectProductSortBy.projector(mockState);
        expect(result).toBe('newest');
    });

    it('should select total count', () => {
        const result = selectTotalCount.projector(mockState);
        expect(result).toBe(100);
    });

    it('should select has more products', () => {
        const result = selectHasMoreProducts.projector(mockState);
        expect(result).toBe(true);
    });

    it('should select current page', () => {
        const result = selectCurrentPage.projector(mockState);
        expect(result).toBe(1);
    });

    it('should select page size', () => {
        const result = selectPageSize.projector(mockState);
        expect(result).toBe(12);
    });

    it('should select categories', () => {
        const result = selectCategories.projector(mockState);
        expect(result).toEqual(['electronics', 'beauty']);
    });

    describe('selectFilteredProducts', () => {
        it('should return all products when no filters', () => {
            const result = selectFilteredProducts.projector(mockProducts, {});
            expect(result).toEqual(mockProducts);
        });

        it('should filter by category', () => {
            const result = selectFilteredProducts.projector(mockProducts, {
                category: 'electronics',
            });
            expect(result.length).toBe(2);
            expect(result.every(p => p.category === 'electronics')).toBe(true);
        });

        it('should filter by search query', () => {
            const result = selectFilteredProducts.projector(mockProducts, {
                search: 'Another',
            });
            expect(result.length).toBe(1);
            expect(result[0].title).toBe('Another Product');
        });

        it('should filter by rating', () => {
            const result = selectFilteredProducts.projector(mockProducts, {
                rating: 4,
            });
            expect(result.length).toBe(2);
            expect(result.every(p => p.rating >= 4)).toBe(true);
        });

        it('should filter by price range', () => {
            const result = selectFilteredProducts.projector(mockProducts, {
                priceRange: {min: 75, max: 150},
            });
            expect(result.length).toBe(1);
            expect(result[0].price).toBe(100);
        });

        it('should filter by brand', () => {
            const result = selectFilteredProducts.projector(mockProducts, {
                brand: ['Test Brand'],
            });
            expect(result.length).toBe(1);
            expect(result[0].brand).toBe('Test Brand');
        });

        it('should combine multiple filters', () => {
            const result = selectFilteredProducts.projector(mockProducts, {
                category: 'electronics',
                rating: 4,
                priceRange: {min: 75, max: 150},
            });
            expect(result.length).toBe(1);
            expect(result[0].id).toBe(1);
        });

        it('should handle inStock filter', () => {
            const productsWithStock = [
                {...mockProduct, stock: 0},
                {...mockProduct, id: 4, stock: 5},
            ];

            const result = selectFilteredProducts.projector(productsWithStock, {
                inStock: true,
            });

            expect(result.length).toBe(1);
            expect(result[0].stock).toBe(5);
        });

        it('should handle onSale filter', () => {
            const productsWithDiscount = [
                {...mockProduct, discountPercentage: 0},
                {...mockProduct, id: 4, discountPercentage: 15},
            ];

            const result = selectFilteredProducts.projector(productsWithDiscount, {
                onSale: true,
            });

            expect(result.length).toBe(1);
            expect(result[0].discountPercentage).toBe(15);
        });

        it('should handle availabilityStatus filter', () => {
            const productsWithStatus = [
                {...mockProduct, availabilityStatus: 'Out of Stock'},
                {...mockProduct, id: 4, availabilityStatus: 'In Stock'},
            ];

            const result = selectFilteredProducts.projector(productsWithStatus, {
                availabilityStatus: 'In Stock',
            });

            expect(result.length).toBe(1);
            expect(result[0].availabilityStatus).toBe('In Stock');
        });

        it('should handle tags filter', () => {
            const productsWithTags = [
                {...mockProduct, tags: ['tag1', 'tag2']},
                {...mockProduct, id: 4, tags: ['tag3']},
            ];

            const result = selectFilteredProducts.projector(productsWithTags, {
                tags: ['tag1'],
            });

            expect(result.length).toBe(1);
            expect(result[0].tags).toContain('tag1');
        });
    });

    describe('selectSortedProducts', () => {
        it('should sort by price low to high', () => {
            const result = selectSortedProducts.projector(mockProducts, 'price-low');
            expect(result[0].price).toBe(50);
            expect(result[2].price).toBe(200);
        });

        it('should sort by price high to low', () => {
            const result = selectSortedProducts.projector(mockProducts, 'price-high');
            expect(result[0].price).toBe(200);
            expect(result[2].price).toBe(50);
        });

        it('should sort by rating', () => {
            const result = selectSortedProducts.projector(mockProducts, 'rating');
            expect(result[0].rating).toBe(4.5);
            expect(result[2].rating).toBe(3.5);
        });

        it('should sort by title', () => {
            const result = selectSortedProducts.projector(mockProducts, 'title');
            expect(result[0].title).toBe('Another Product');
            expect(result[2].title).toBe('Test Product');
        });

        it('should sort by discount', () => {
            const productsWithDiscount = [
                {...mockProduct, discountPercentage: 10},
                {...mockProduct, id: 4, discountPercentage: 25},
                {...mockProduct, id: 5, discountPercentage: 5},
            ];

            const result = selectSortedProducts.projector(productsWithDiscount, 'discount');
            expect(result[0].discountPercentage).toBe(25);
            expect(result[2].discountPercentage).toBe(5);
        });

        it('should sort by stock', () => {
            const productsWithStock = [
                {...mockProduct, stock: 10},
                {...mockProduct, id: 4, stock: 50},
                {...mockProduct, id: 5, stock: 5},
            ];

            const result = selectSortedProducts.projector(productsWithStock, 'stock');
            expect(result[0].stock).toBe(50);
            expect(result[2].stock).toBe(5);
        });

        it('should sort by newest (id descending)', () => {
            const result = selectSortedProducts.projector(mockProducts, 'newest');
            expect(result[0].id).toBe(3);
            expect(result[2].id).toBe(1);
        });

        it('should sort by popular (rating descending)', () => {
            const result = selectSortedProducts.projector(mockProducts, 'popular');
            expect(result[0].rating).toBe(4.5);
            expect(result[2].rating).toBe(3.5);
        });

        it('should return unsorted products for default case', () => {
            const result = selectSortedProducts.projector(mockProducts, 'unknown' as any);
            expect(result).toEqual(mockProducts);
        });
    });

    describe('selectCurrentViewProducts', () => {
        it('should return cumulative products for first page', () => {
            const result = selectCurrentViewProducts.projector(mockProducts, 1, 2);
            expect(result.length).toBe(2);
            expect(result).toEqual(mockProducts.slice(0, 2));
        });

        it('should return cumulative products for second page', () => {
            const result = selectCurrentViewProducts.projector(mockProducts, 2, 2);
            expect(result.length).toBe(3);
            expect(result).toEqual(mockProducts.slice(0, 4));
        });

        it('should handle page beyond available products', () => {
            const result = selectCurrentViewProducts.projector(mockProducts, 5, 2);
            expect(result.length).toBe(mockProducts.length);
            expect(result).toEqual(mockProducts);
        });

        it('should handle empty products array', () => {
            const result = selectCurrentViewProducts.projector([], 1, 12);
            expect(result.length).toBe(0);
        });
    });

    describe('selectFilteredProductsCount', () => {
        it('should return correct count for filtered products', () => {
            const filtered = selectFilteredProducts.projector(mockProducts, {
                category: 'electronics',
            });
            const result = selectFilteredProductsCount.projector(filtered);
            expect(result).toBe(2);
        });

        it('should return 0 for no filtered products', () => {
            const filtered = selectFilteredProducts.projector(mockProducts, {
                category: 'nonexistent',
            });
            const result = selectFilteredProductsCount.projector(filtered);
            expect(result).toBe(0);
        });

        it('should return total count when no filters applied', () => {
            const filtered = selectFilteredProducts.projector(mockProducts, {});
            const result = selectFilteredProductsCount.projector(filtered);
            expect(result).toBe(3);
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined product properties in filtering', () => {
            const productsWithUndefined = [
                {...mockProduct, brand: undefined},
                {...mockProduct, id: 4, brand: 'Test Brand'},
            ];

            const result = selectFilteredProducts.projector(productsWithUndefined, {
                brand: ['Test Brand'],
            });

            expect(result.length).toBe(1);
            expect(result[0].brand).toBe('Test Brand');
        });

        it('should handle empty search term', () => {
            const result = selectFilteredProducts.projector(mockProducts, {
                search: '',
            });

            expect(result.length).toBe(3);
        });

        it('should handle case-insensitive search', () => {
            const result = selectFilteredProducts.projector(mockProducts, {
                search: 'TEST',
            });

            expect(result.length).toBe(1);
            expect(result[0].title).toBe('Test Product');
        });

        it('should handle sorting with equal values', () => {
            const productsWithEqualPrices = [
                {...mockProduct, price: 100},
                {...mockProduct, id: 4, price: 100},
                {...mockProduct, id: 5, price: 100},
            ];

            const result = selectSortedProducts.projector(productsWithEqualPrices, 'price-low');
            expect(result.length).toBe(3);
            expect(result.every(p => p.price === 100)).toBe(true);
        });
    });

    describe('Performance Considerations', () => {
        it('should memoize selectors properly', () => {
            const result1 = selectFilteredProducts.projector(mockProducts, {});
            const result2 = selectFilteredProducts.projector(mockProducts, {});

            expect(result1).toBe(result2);
        });

        it('should recompute when inputs change', () => {
            const result1 = selectFilteredProducts.projector(mockProducts, {});
            const result2 = selectFilteredProducts.projector(mockProducts, {category: 'electronics'});

            expect(result1).not.toBe(result2);
            expect(result1.length).toBe(3);
            expect(result2.length).toBe(2);
        });
    });

    describe('selectCategories', () => {
        it('should select the categories from state', () => {
            const categories = ['electronics', 'furniture', 'clothing'];
            const state: any = {
                product: {
                    ...productAdapter.getInitialState(),
                    categories,
                },
            };
            expect(selectCategories(state)).toEqual(categories);
        });
    });
});
