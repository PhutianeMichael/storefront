import { ActivatedRouteSnapshot } from '@angular/router';
import { ProductListResolver } from './product-list.resolver';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  selectProductsLoaded,
  selectProductsLoading,
  selectProductFilters,
  selectProductSortBy,
  selectCurrentPage
} from '../state/product.selectors';
import { fakeAsync, tick } from '@angular/core/testing';


describe('ProductListResolver', () => {
  let resolver: ProductListResolver;
  let storeSpy: jasmine.SpyObj<Store<any>>;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    storeSpy.select.and.callFake((selector: any) => {
      switch (selector) {
        case selectProductsLoaded:
          return of(true);
        case selectProductsLoading:
          return of(false);
        case selectProductFilters:
          return of({});
        case selectProductSortBy:
          return of('');
        case selectCurrentPage:
          return of(1);
        default:
          return of(true);
      }
    });
    resolver = new ProductListResolver(storeSpy);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve to true when products are loaded', (done) => {
    const route = new ActivatedRouteSnapshot();
    resolver.resolve(route).subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should resolve to false when products are not loaded', fakeAsync(() => {
    storeSpy.select.and.callFake((selector: any) => {
      if (selector === selectProductsLoaded) return of(false);
      if (selector === selectProductsLoading) return of(false);
      return of(true);
    });
    resolver = new ProductListResolver(storeSpy);
    const route = new ActivatedRouteSnapshot();
    let result: boolean | undefined;
    resolver.resolve(route).subscribe(res => {
      result = res;
    });
    tick();
    expect(result).toBeUndefined();
  }));

  it('should handle loading state', fakeAsync(() => {
    storeSpy.select.and.callFake((selector: any) => {
      if (selector === selectProductsLoaded) return of(false);
      if (selector === selectProductsLoading) return of(true);
      return of(false);
    });
    resolver = new ProductListResolver(storeSpy);
    const route = new ActivatedRouteSnapshot();
    let result: boolean | undefined;
    resolver.resolve(route).subscribe(res => {
      result = res;
    });
    tick();
    expect(result).toBeUndefined();
  }));
});
