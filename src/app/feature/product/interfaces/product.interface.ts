import { Observable } from 'rxjs';
import { Product, ProductsResponse } from '../models/product.model';
import { HttpParams } from '@angular/common/http';

export interface IProductService {
    getProducts(params: HttpParams): Observable<ProductsResponse>;

    getProductById(productId: number): Observable<Product | undefined>;

    searchProducts(query: string): Observable<ProductsResponse>

    getProductCategoryList(): Observable<string[]>

    getProductsByCategory(params: HttpParams, category: string): Observable<ProductsResponse>
}
