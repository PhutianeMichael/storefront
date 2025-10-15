import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { WishlistListItemComponent } from './wishlist-list-item.component';
import { ProductService } from '../../product/services/product.service';
import { AppState } from '../../../app.state';
import { selectAuthUserId } from '../../auth/state/auth.selectors';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

describe('WishlistListItemComponent', () => {
    let component: WishlistListItemComponent;
    let fixture: ComponentFixture<WishlistListItemComponent>;
    let store: MockStore<AppState>;
    let router: Router;

    const wishlistItem = {
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
    };

    const outOfStockItem = {
        ...wishlistItem,
        stock: 0,
        availabilityStatus: 'Out of Stock',
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                WishlistListItemComponent,
                MatIconModule,
                MatCardModule,
                NgOptimizedImage,
                MatButtonModule,
            ],
            providers: [
                provideMockStore({
                    initialState: {
                        auth: {user: {id: 123}},
                    },
                }),
                provideHttpClientTesting(),
                ProductService,
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('Router', ['navigate']),
                },
            ],
        }).compileComponents();

        store = TestBed.inject(MockStore);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(WishlistListItemComponent);
        component = fixture.componentInstance;

        component.wishlistItem = wishlistItem;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display item details correctly', () => {
        const titleElement = fixture.nativeElement.querySelector('.wishlist-item__title');
        const descriptionElement = fixture.nativeElement.querySelector('.wishlist-item__description');
        const imageElement = fixture.nativeElement.querySelector('img');

        expect(titleElement.textContent).toContain('Test Product');
        expect(descriptionElement.textContent).toContain('desc');
        expect(imageElement.src).toContain(wishlistItem.thumbnail);
        expect(imageElement.alt).toBe('Test Product');
    });

    it('should display stock status correctly for in-stock items', () => {
        const statusElement = fixture.nativeElement.querySelector('.wishlist-item__availability');

        expect(statusElement.textContent).toContain('In Stock');
        expect(statusElement.classList).toContain('wishlist-item__enough-stock-status');
        expect(statusElement.classList).not.toContain('wishlist-item__low-stock-status');
    });

    it('should display stock status correctly for out-of-stock items', () => {
        component.wishlistItem = outOfStockItem;
        fixture.detectChanges();

        const statusElement = fixture.nativeElement.querySelector('.wishlist-item__availability');

        expect(statusElement.textContent).toContain('Out of Stock');
        expect(statusElement.classList).toContain('wishlist-item__low-stock-status');
    });

    it('should dispatch remove action when remove button is clicked', () => {
        spyOn(store, 'dispatch');
        spyOn(store, 'select').and.callFake((selector) => {
            if (selector === selectAuthUserId) {
                return of(123);
            }
            return of(undefined);
        });
        const removeButton = fixture.debugElement.query(By.css('.delete-cta'));

        removeButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: '[Wishlist] Remove Item',
            productId: 101,
        }));
    });

    it('should dispatch addToCart and remove actions when move to cart button is clicked for in-stock item', () => {
        spyOn(store, 'dispatch');
        store.overrideSelector(selectAuthUserId, 123);
        store.refreshState();

        const moveToCartButton = fixture.debugElement.query(By.css('.move-to-list-cta'));
        moveToCartButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: '[Cart] Add to Cart',
        }));
        expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: '[Wishlist] Remove Item',
        }));
    });

    it('should not dispatch addToCart for out-of-stock items', () => {
        spyOn(store, 'dispatch');
        component.wishlistItem = outOfStockItem;
        fixture.detectChanges();

        store.overrideSelector(selectAuthUserId, 123);
        store.refreshState();

        const moveToCartButton = fixture.debugElement.query(By.css('.move-to-list-cta'));
        moveToCartButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(store.dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
            type: '[Cart] Add to Cart',
        }));
    });

    it('should navigate to login when user is not logged in and move to cart is clicked', () => {
        store.overrideSelector(selectAuthUserId, undefined);
        store.refreshState();

        const moveToCartButton = fixture.debugElement.query(By.css('.move-to-list-cta'));
        moveToCartButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle missing wishlistItem gracefully', () => {
        component.wishlistItem = undefined as any;
        expect(() => fixture.detectChanges()).not.toThrow();

        const cardElement = fixture.nativeElement.querySelector('mat-card');
        expect(cardElement).toBeNull();
    });

    it('should have proper ARIA labels for accessibility', () => {
        const removeButton = fixture.nativeElement.querySelector('.delete-cta');
        const moveToCartButton = fixture.nativeElement.querySelector('.move-to-list-cta');

        expect(removeButton.getAttribute('aria-label')).toContain('Remove Test Product from wishlist');
        expect(moveToCartButton.getAttribute('aria-label')).toContain('Move Test Product to cart');
    });

    it('should apply correct stock status CSS classes', () => {
        expect(component.itemStockStatus('In Stock')).toBe('wishlist-item__enough-stock-status');
        expect(component.itemStockStatus('Out of Stock')).toBe('wishlist-item__low-stock-status');
        expect(component.itemStockStatus('Low Stock')).toBe('wishlist-item__low-stock-status');
    });
});
