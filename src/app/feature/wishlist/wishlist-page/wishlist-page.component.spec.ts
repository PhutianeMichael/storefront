import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { WishlistPageComponent } from './wishlist-page.component';
import { ProductService } from '../../product/services/product.service';
import { selectWishlistError, selectWishlistHasItems } from '../state/wishlist.selectors';
import { selectAuthUserId } from '../../auth/state/auth.selectors';
import * as WishlistActions from '../state/wishlist.actions';

describe('WishlistPageComponent', () => {
  let component: WishlistPageComponent;
  let fixture: ComponentFixture<WishlistPageComponent>;
  let store: MockStore;
  let router: Router;

  const initialState = {
    wishlist: {
      userId: undefined,
      items: [],
      loading: false,
      error: null,
      itemCount: 0,
    },
    auth: {
      user: {
        id: 1757590735311,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistPageComponent],
      providers: [
        provideMockStore({initialState}),
        {provide: Router, useValue: {navigateByUrl: jasmine.createSpy('navigateByUrl')}},
        {provide: ActivatedRoute, useValue: {params: of({}), data: of({})}},
        provideHttpClientTesting(),
        ProductService,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(WishlistPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    // Mock the selectors
    store.overrideSelector(selectWishlistHasItems, false);
    store.overrideSelector(selectWishlistError, null);
    store.overrideSelector(selectAuthUserId, 1757590735311);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty wishlist message when wishlist is empty', () => {
    store.overrideSelector(selectWishlistHasItems, false);
    store.refreshState();
    fixture.detectChanges();

    expect(component.isWishEmpty()).toBe(false);
  });

  it('should render wishlist when wishlist has items', () => {
    store.overrideSelector(selectWishlistHasItems, true);
    store.refreshState();
    fixture.detectChanges();

    expect(component.isWishEmpty()).toBe(true);
  });

  it('should dispatch clearWishlist when onClearWishlist is called and user is logged in', () => {
    const userId = 1757590735311;
    spyOn(store, 'dispatch');

    component.onClearWishlist();

    expect(store.dispatch).toHaveBeenCalledWith(
      WishlistActions.clearWishlist({userId}),
    );
  });

  it('should navigate to login if user not logged in when clearing wishlist', () => {
    store.overrideSelector(selectAuthUserId, undefined);
    store.refreshState();

    component.onClearWishlist();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should handle error state gracefully', () => {
    store.overrideSelector(selectWishlistError, 'Test error');
    store.refreshState();

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(component.error()).toBe('Test error');
  });

  it('should dispatch appWishlistInit when handleOnReloadWishlist is called', () => {
    spyOn(store, 'dispatch');

    component.handleOnReloadWishlist();

    expect(store.dispatch).toHaveBeenCalledWith(
      WishlistActions.appWishlistInit(),
    );
  });
});
