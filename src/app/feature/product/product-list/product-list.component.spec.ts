import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { ProductListComponent } from './product-list.component';
import {
  selectCategories,
  selectCurrentViewProducts,
  selectFilteredProductsCount,
  selectHasMoreProducts,
  selectProductFilters,
  selectProductsError,
  selectProductsLoading,
  selectProductSortBy,
  selectTotalCount,
} from '../state/product.selectors';

let storeMock: any;

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    storeMock = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select'),
      selectSignal: (selector: any) => {
        switch (selector) {
          case selectCurrentViewProducts:
            return () => [];
          case selectProductsLoading:
            return () => false;
          case selectProductsError:
            return () => null;
          case selectHasMoreProducts:
            return () => false;
          case selectCategories:
            return () => [];
          case selectTotalCount:
            return () => 0;
          case selectFilteredProductsCount:
            return () => 0;
          case selectProductFilters:
            return () => ({search: '', category: null});
          case selectProductSortBy:
            return () => 'newest';
          default:
            return () => undefined;
        }
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        {provide: Store, useValue: storeMock},
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear search and filters', () => {
    component.searchControl.setValue('test');
    component.categoryControl.setValue('cat');
    component.sortControl.setValue('price-low');
    component.clearSearch();
    expect(component.searchControl.value).toBe('');
    expect(component.categoryControl.value).toBeNull();
    expect(component.sortControl.value).toBe('newest');
    expect(component.store.dispatch).toHaveBeenCalled();
  });

  it('should clear all filters', () => {
    component.searchControl.setValue('test');
    component.categoryControl.setValue('cat');
    component.sortControl.setValue('price-low');
    component.clearAllFilters();
    expect(component.searchControl.value).toBe('');
    expect(component.categoryControl.value).toBeNull();
    expect(component.sortControl.value).toBe('newest');
    expect(component.store.dispatch).toHaveBeenCalled();
  });

  it('should dispatch filterProducts on category change', () => {
    component.onCategoryChange('beauty');
    expect(component.store.dispatch).toHaveBeenCalled();
  });

  it('should dispatch sortProducts on sort change', () => {
    component.onSortChange('price-high');
    expect(component.store.dispatch).toHaveBeenCalled();
  });

  it('should dispatch loadMoreProducts on loadMore', () => {
    component.loadMore();
    expect(component.store.dispatch).toHaveBeenCalled();
  });

  it('should track by product id', () => {
    expect(component.trackByProductId(0, {id: 5} as any)).toBe(5);
    expect(typeof component.trackByProductId(1, {} as any)).toBe('number');
  });

  it('should have correct hasActiveFilters logic', () => {
    component.searchControl.setValue('test');
    expect(component.hasActiveFilters).toBeTrue();
    component.searchControl.setValue('');
    component.categoryControl.setValue('cat');
    expect(component.hasActiveFilters).toBeTrue();
    component.categoryControl.setValue(null);
    component.sortControl.setValue('newest');
    expect(component.hasActiveFilters).toBeFalse();
  });
});
