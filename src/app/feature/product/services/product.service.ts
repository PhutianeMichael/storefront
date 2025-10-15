import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { ApiProduct, Product, ProductApiResponse, ProductsResponse } from '../models/product.model';
import { mapProductResponse } from '../mappers/mapProductResponse.mapper';
import { IProductService } from '../interfaces/product.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ProductService implements IProductService {
    private apiUrl = 'https://dummyjson.com/products';
    private http = inject(HttpClient);

    /**
     * Retrieves all products from the API.
     * @returns Observable emitting paginated products.
     */
    getProducts(params: HttpParams): Observable<ProductsResponse> {
        return this.http
            .get<ProductApiResponse>(this.apiUrl, {params})
            .pipe(
                map((response: ProductApiResponse) => {
                    return {
                        ...response,
                        products: response.products.map((product: ApiProduct) => mapProductResponse(product)),
                    }
                }),
                catchError(err => throwError(() => err)))
    }

    /**
     * Retrieves a product by its ID from the API.
     * @param id The product ID.
     * @returns Observable emitting the product or undefined if not found.
     */
    getProductById(id: number): Observable<Product | undefined> {
        return this.http
            .get<ApiProduct>(`${this.apiUrl}/${id}`)
            .pipe(
                map((product: ApiProduct | null) => product ? mapProductResponse(product) : undefined),
                catchError(err => throwError(() => err)),
            );
    }

    searchProducts(query: string): Observable<ProductsResponse> {
        return this.http.get<ProductApiResponse>(`${this.apiUrl}/search?q=${query}`)
            .pipe(
                map((response: ProductApiResponse) => {
                    return {
                        ...response,
                        products: response.products.map((product: ApiProduct) => mapProductResponse(product)),
                    }
                }),
                catchError(error => throwError(() => error)))
    }

    getProductCategoryList() {
        return this.http.get<string[]>(`${this.apiUrl}/category-list`);
    }

    getProductsByCategory(params: HttpParams, category: string): Observable<ProductsResponse> {
        return this.http.get<ProductApiResponse>(`${this.apiUrl}/category/${category}`, {params})
            .pipe(
                map(response => {
                    return {
                        ...response,
                        products: response.products.map((product: ApiProduct) => mapProductResponse(product)),
                    }
                }),
                catchError(err => throwError(() => err)))
    }
}
