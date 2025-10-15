import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';

import { WishlistListComponent } from './wishlist-list.component';
import { ProductService } from '../../product/services/product.service';
import { AppState } from '../../../app.state';
import { selectWishlistError, selectWishlistItems, selectWishlistLoading } from '../state/wishlist.selectors';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('WishlistListComponent', () => {
    let component: WishlistListComponent;
    let fixture: ComponentFixture<WishlistListComponent>;
    let store: jasmine.SpyObj<Store<AppState>>;

    const wishlistItems = [
        {
            productId: 101,
            title: 'Test Product',
            price: 99.99,
            stock: 10,
            thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp',
            description: 'desc',
            discountPercentage: 0,
            availabilityStatus: 'In Stock',
            category: 'beauty',
            sku: 'BEA-CHI-LIP-004',
            code: '9467746727219',
        },
        {
            productId: 102,
            title: 'Another Product',
            price: 49.99,
            stock: 5,
            thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp',
            description: 'desc2',
            discountPercentage: 5,
            availabilityStatus: 'In Stock',
            category: 'beauty',
            sku: 'BEA-CHI-LIP-005',
            code: '9467746727220',
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WishlistListComponent, MatProgressSpinnerModule],
            providers: [
                {provide: Store, useValue: jasmine.createSpyObj('Store', ['selectSignal'])},
                ProductService,
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;
        store.selectSignal.and.callFake((selector: any) => {
            if (selector === selectWishlistItems) return computed(() => wishlistItems);
            if (selector === selectWishlistLoading) return computed(() => false);
            if (selector === selectWishlistError) return computed(() => null);
            return computed(() => undefined as any);
        });

        fixture = TestBed.createComponent(WishlistListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display wishlist items when available', () => {
        fixture.detectChanges();
        const itemElements = fixture.nativeElement.querySelectorAll('app-wishlist-list-item');
        expect(itemElements.length).toBe(2);
        expect(component.wishlistItems()[0].title).toBe('Test Product');
        expect(component.wishlistItems()[1].title).toBe('Another Product');
    });

    it('should show loading spinner when loading', () => {
        store.selectSignal.withArgs(selectWishlistLoading).and.returnValue(computed(() => true));
        store.selectSignal.withArgs(selectWishlistItems).and.returnValue(computed(() => []));
        fixture = TestBed.createComponent(WishlistListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const spinner = fixture.nativeElement.querySelector('mat-spinner');
        const loadingText = fixture.nativeElement.querySelector('.loading-state p');
        expect(spinner).toBeTruthy();
        expect(loadingText.textContent).toContain('Loading your wishlist');
    });

    it('should show error message when there is an error', () => {
        const errorMessage = 'Failed to load wishlist';
        store.selectSignal.withArgs(selectWishlistError).and.returnValue(computed(() => errorMessage));
        store.selectSignal.withArgs(selectWishlistLoading).and.returnValue(computed(() => false));
        fixture = TestBed.createComponent(WishlistListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const errorElement = fixture.nativeElement.querySelector('.error-state');
        expect(errorElement).toBeTruthy();
        expect(errorElement.textContent).toContain(errorMessage);
    });

    it('should show empty state when no items and not loading', () => {
        store.selectSignal.withArgs(selectWishlistItems).and.returnValue(computed(() => []));
        store.selectSignal.withArgs(selectWishlistLoading).and.returnValue(computed(() => false));
        store.selectSignal.withArgs(selectWishlistError).and.returnValue(computed(() => null));
        fixture = TestBed.createComponent(WishlistListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const itemElements = fixture.nativeElement.querySelectorAll('app-wishlist-list-item');
        expect(itemElements.length).toBe(0);
        const spinner = fixture.nativeElement.querySelector('mat-spinner');
        const errorElement = fixture.nativeElement.querySelector('.error-state');
        expect(spinner).toBeNull();
        expect(errorElement).toBeNull();
    });

    it('should track items by productId', () => {
        const trackResult = component.trackByWishlistId(wishlistItems[0]);
        expect(trackResult).toBe(101);

        const trackResult2 = component.trackByWishlistId(wishlistItems[1]);
        expect(trackResult2).toBe(102);
    });

    it('should handle undefined items gracefully', () => {
        store.selectSignal.withArgs(selectWishlistItems).and.returnValue(computed(() => undefined));
        fixture = TestBed.createComponent(WishlistListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const itemElements = fixture.nativeElement.querySelectorAll('app-wishlist-list-item');
        expect(itemElements.length).toBe(0);
    });
});
