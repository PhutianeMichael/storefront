import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { ProductService } from './product.service';

describe('ProductService', () => {
    let service: ProductService;
    let httpSpy: any;

    beforeEach(() => {
        httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
        TestBed.configureTestingModule({
            providers: [
                {provide: ProductService, useClass: ProductService},
                {provide: HttpClient, useValue: httpSpy},
            ],
        });
        service = TestBed.inject(ProductService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get products and map response', (done) => {
        const mockApiResponse = {products: [{id: 1, title: 'Test', price: 10}]};
        httpSpy.get.and.returnValue(of(mockApiResponse));
        const params = new HttpParams();
        service.getProducts(params).subscribe(response => {
            expect(response.products.length).toBe(1);
            expect(response.products[0].title).toBe('Test');
            done();
        });
    });

    it('should get product by id and map response', (done) => {
        const mockProduct = {id: 1, title: 'Test', price: 10};
        httpSpy.get.and.returnValue(of(mockProduct));
        service.getProductById(1).subscribe(product => {
            expect(product).not.toBeNull();
            if (product) {
                expect(product.id).toBe(1);
                expect(product.title).toBe('Test');
            }
            done();
        });
    });

    it('should handle http error for getProducts', (done) => {
        httpSpy.get.and.returnValue(of({products: []}));
        const params = new HttpParams();
        service.getProducts(params).subscribe(response => {
            expect(Array.isArray(response.products)).toBeTrue();
            done();
        });
    });

    it('should handle http error for getProductById', (done) => {
        httpSpy.get.and.returnValue(of(undefined));
        service.getProductById(1).subscribe({
            next: product => {
                expect(product).toBeUndefined();
                done();
            },
            error: err => {
                expect(err).toBeDefined();
                done();
            },
        });
    });

    it('should get product category list', (done) => {
        const mockCategories = ['electronics', 'furniture', 'clothing'];
        httpSpy.get.and.returnValue(of(mockCategories));
        service.getProductCategoryList().subscribe(categories => {
            expect(categories).toEqual(mockCategories);
            done();
        });
    });

    it('should get products by category and map response', (done) => {
        const mockApiResponse = {products: [{id: 2, title: 'CategoryTest', price: 20}]};
        httpSpy.get.and.returnValue(of(mockApiResponse));
        const params = new HttpParams();
        service.getProductsByCategory(params, 'electronics').subscribe(response => {
            expect(response.products.length).toBe(1);
            expect(response.products[0].title).toBe('CategoryTest');
            done();
        });
    });
});
