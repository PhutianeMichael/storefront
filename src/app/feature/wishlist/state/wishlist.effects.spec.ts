import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';
import { WishlistEffects } from './wishlist.effects';
import * as WishlistActions from './wishlist.actions';
import { WishlistStorageService } from '../services/wishlist-storage.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Wishlist } from '../models/wishlist.model';

const mockWishlist: Wishlist = {
  userId: 123,
  items: [{
    productId: 1,
    title: 'Test',
    description: '',
    category: '',
    price: 1,
    discountPercentage: 0,
    stock: 1,
    sku: '',
    availabilityStatus: '',
    code: '',
    thumbnail: ''
  }]
};

const mockWishlistState = {
  userId: 123,
  items: mockWishlist.items,
  loading: false,
  error: null,
  itemCount: 1
};

const initialState: AppState = {
  wishlist: mockWishlistState,
  auth: { user: { id: 123 } } as any,
} as any;

describe('WishlistEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: WishlistEffects;
  let wishlistStorage: jasmine.SpyObj<WishlistStorageService>;
  let store: MockStore<AppState>;

  beforeEach(() => {
    wishlistStorage = jasmine.createSpyObj('WishlistStorageService', ['saveUserWishlist', 'loadUserWishlist']);
    actions$ = new ReplaySubject<any>(1);
    TestBed.configureTestingModule({
      providers: [
        WishlistEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        { provide: WishlistStorageService, useValue: wishlistStorage }
      ]
    });
    effects = TestBed.inject(WishlistEffects);
    store = TestBed.inject(Store) as MockStore<AppState>;
  });

  it('should create loadUserWishlist$ effect', () => {
    expect(effects.loadUserWishlist$).toBeDefined();
  });

  describe('saveWishlistToStorage$', () => {
    const executeWithDelay = (testFn: () => void) => {
      setTimeout(testFn, 10);
    };

    it('should call saveUserWishlist with Wishlist format when userId is present (addItemToWishlist)', (done) => {
      wishlistStorage.saveUserWishlist.and.stub();

      effects.saveWishlistToStorage$.subscribe(() => {
        executeWithDelay(() => {
          expect(wishlistStorage.saveUserWishlist).toHaveBeenCalledWith(
              mockWishlist.userId,
              jasmine.objectContaining({
                userId: mockWishlist.userId,
                items: mockWishlist.items
              })
          );
          done();
        });
      });

      actions$.next(WishlistActions.addItemToWishlist({
        item: mockWishlist.items[0],
        userId: mockWishlist.userId
      }));
    });

    it('should call saveUserWishlist with Wishlist format when userId is present (removeItemFromWishlist)', (done) => {
      wishlistStorage.saveUserWishlist.and.stub();

      effects.saveWishlistToStorage$.subscribe(() => {
        executeWithDelay(() => {
          expect(wishlistStorage.saveUserWishlist).toHaveBeenCalledWith(
              mockWishlist.userId,
              jasmine.objectContaining({
                userId: mockWishlist.userId,
                items: mockWishlist.items
              })
          );
          done();
        });
      });

      actions$.next(WishlistActions.removeItemFromWishlist({
        productId: mockWishlist.items[0].productId,
        userId: mockWishlist.userId
      }));
    });

    it('should call saveUserWishlist with Wishlist format when userId is present (clearWishlist)', (done) => {
      wishlistStorage.saveUserWishlist.and.stub();

      effects.saveWishlistToStorage$.subscribe(() => {
        executeWithDelay(() => {
          expect(wishlistStorage.saveUserWishlist).toHaveBeenCalledWith(
              mockWishlist.userId,
              jasmine.objectContaining({
                userId: mockWishlist.userId,
                items: mockWishlist.items
              })
          );
          done();
        });
      });

      actions$.next(WishlistActions.clearWishlist({ userId: mockWishlist.userId }));
    });

    it('should call saveUserWishlist with Wishlist format when userId is present (saveWishlistToStorage)', (done) => {
      wishlistStorage.saveUserWishlist.and.stub();

      effects.saveWishlistToStorage$.subscribe(() => {
        executeWithDelay(() => {
          expect(wishlistStorage.saveUserWishlist).toHaveBeenCalledWith(
              mockWishlist.userId,
              jasmine.objectContaining({
                userId: mockWishlist.userId,
                items: mockWishlist.items
              })
          );
          done();
        });
      });

      actions$.next(WishlistActions.saveWishlistToStorage({ userId: mockWishlist.userId }));
    });

    it('should not call saveUserWishlist if userId is missing', (done) => {
      store.setState({
        ...initialState,
        wishlist: {
          userId: undefined,
          items: [],
          loading: false,
          error: null,
          itemCount: 0
        }
      });

      wishlistStorage.saveUserWishlist.and.stub();

      effects.saveWishlistToStorage$.subscribe(() => {
        executeWithDelay(() => {
          expect(wishlistStorage.saveUserWishlist).not.toHaveBeenCalled();
          done();
        });
      });

      actions$.next(WishlistActions.addItemToWishlist({
        item: mockWishlist.items[0],
        userId: mockWishlist.userId
      }));
    });

    it('should handle errors gracefully (addItemToWishlist)', (done) => {
      wishlistStorage.saveUserWishlist.and.throwError('save error');
      spyOn(console, 'error');

      effects.saveWishlistToStorage$.subscribe(() => {
        executeWithDelay(() => {
          expect(console.error).toHaveBeenCalledWith('Error saving wishlist to localStorage:', jasmine.any(Error));
          done();
        });
      });

      actions$.next(WishlistActions.addItemToWishlist({
        item: mockWishlist.items[0],
        userId: mockWishlist.userId
      }));
    });

    it('should handle errors gracefully (removeItemFromWishlist)', (done) => {
      wishlistStorage.saveUserWishlist.and.throwError('save error');
      spyOn(console, 'error');

      effects.saveWishlistToStorage$.subscribe(() => {
        executeWithDelay(() => {
          expect(console.error).toHaveBeenCalledWith('Error saving wishlist to localStorage:', jasmine.any(Error));
          done();
        });
      });

      actions$.next(WishlistActions.removeItemFromWishlist({
        productId: mockWishlist.items[0].productId,
        userId: mockWishlist.userId
      }));
    });

    it('should handle errors gracefully (clearWishlist)', (done) => {
      wishlistStorage.saveUserWishlist.and.throwError('save error');
      spyOn(console, 'error');

      effects.saveWishlistToStorage$.subscribe(() => {
        executeWithDelay(() => {
          expect(console.error).toHaveBeenCalledWith('Error saving wishlist to localStorage:', jasmine.any(Error));
          done();
        });
      });

      actions$.next(WishlistActions.clearWishlist({ userId: mockWishlist.userId }));
    });

    it('should handle errors gracefully (saveWishlistToStorage)', (done) => {
      wishlistStorage.saveUserWishlist.and.throwError('save error');
      spyOn(console, 'error');

      effects.saveWishlistToStorage$.subscribe(() => {
        executeWithDelay(() => {
          expect(console.error).toHaveBeenCalledWith('Error saving wishlist to localStorage:', jasmine.any(Error));
          done();
        });
      });

      actions$.next(WishlistActions.saveWishlistToStorage({ userId: mockWishlist.userId }));
    });
  });

  describe('loadWishlistOnAppInit$', () => {
    it('should dispatch loadWishlistFromStorage with empty items and userId 0 if no user', (done) => {
      store.setState({
        ...initialState,
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null
        }
      });

      effects.loadWishlistOnAppInit$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorage({ items: [], userId: 0 }));
        done();
      });

      actions$.next(WishlistActions.appWishlistInit());
    });

    it('should dispatch loadWishlistFromStorage with loaded items if user is present', (done) => {
      wishlistStorage.loadUserWishlist.and.returnValue(mockWishlist);

      effects.loadWishlistOnAppInit$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorage({
          items: mockWishlist.items,
          userId: mockWishlist.userId
        }));
        done();
      });

      actions$.next(WishlistActions.appWishlistInit());
    });

    it('should dispatch loadWishlistFromStorage with empty items if user wishlist is null', (done) => {
      wishlistStorage.loadUserWishlist.and.returnValue(null);

      effects.loadWishlistOnAppInit$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorage({
          items: [],
          userId: mockWishlist.userId
        }));
        done();
      });

      actions$.next(WishlistActions.appWishlistInit());
    });

    it('should dispatch loadWishlistFromStorage with empty items if user wishlist has no items', (done) => {
      wishlistStorage.loadUserWishlist.and.returnValue({ userId: 123, items: [] });

      effects.loadWishlistOnAppInit$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorage({
          items: [],
          userId: mockWishlist.userId
        }));
        done();
      });

      actions$.next(WishlistActions.appWishlistInit());
    });

    it('should dispatch loadWishlistFromStorageFailure if error occurs during loading', (done) => {
      wishlistStorage.loadUserWishlist.and.throwError('load error');

      effects.loadWishlistOnAppInit$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorageFailure({
          error: 'Failed to load wishlist from storage'
        }));
        done();
      });

      actions$.next(WishlistActions.appWishlistInit());
    });

    it('should handle service errors and dispatch failure action', (done) => {
      wishlistStorage.loadUserWishlist.and.throwError(new Error('Storage corrupted'));
      spyOn(console, 'error');

      effects.loadWishlistOnAppInit$.subscribe(action => {
        expect(console.error).toHaveBeenCalledWith('Error loading wishlist from localStorage:', jasmine.any(Error));
        expect(action).toEqual(WishlistActions.loadWishlistFromStorageFailure({
          error: 'Failed to load wishlist from storage'
        }));
        done();
      });

      actions$.next(WishlistActions.appWishlistInit());
    });
  });

  describe('loadUserWishlist$', () => {
    it('should dispatch loadWishlistFromStorage with loaded items when wishlist exists', (done) => {
      wishlistStorage.loadUserWishlist.and.returnValue(mockWishlist);

      effects.loadUserWishlist$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorage({
          items: mockWishlist.items,
          userId: mockWishlist.userId
        }));
        expect(wishlistStorage.loadUserWishlist).toHaveBeenCalledWith(mockWishlist.userId);
        done();
      });

      actions$.next(WishlistActions.loadUserWishlist({ userId: mockWishlist.userId }));
    });

    it('should dispatch loadWishlistFromStorage with empty items when wishlist is null', (done) => {
      wishlistStorage.loadUserWishlist.and.returnValue(null);

      effects.loadUserWishlist$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorage({
          items: [],
          userId: mockWishlist.userId
        }));
        expect(wishlistStorage.loadUserWishlist).toHaveBeenCalledWith(mockWishlist.userId);
        done();
      });

      actions$.next(WishlistActions.loadUserWishlist({ userId: mockWishlist.userId }));
    });

    it('should dispatch loadWishlistFromStorage with empty items when wishlist items is undefined', (done) => {
      const wishlistWithUndefinedItems = { userId: 123, items: undefined };
      wishlistStorage.loadUserWishlist.and.returnValue(wishlistWithUndefinedItems as any);

      effects.loadUserWishlist$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorage({
          items: [],
          userId: mockWishlist.userId
        }));
        done();
      });

      actions$.next(WishlistActions.loadUserWishlist({ userId: mockWishlist.userId }));
    });

    it('should dispatch loadWishlistFromStorageFailure when storage service throws error', (done) => {
      wishlistStorage.loadUserWishlist.and.throwError('Storage error');

      effects.loadUserWishlist$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorageFailure({
          error: 'Failed to load wishlist from storage'
        }));
        done();
      });

      actions$.next(WishlistActions.loadUserWishlist({ userId: mockWishlist.userId }));
    });

    it('should handle different user IDs correctly', (done) => {
      const differentUserId = 456;
      const differentWishlist: Wishlist = {
        userId: differentUserId,
        items: [{
          productId: 2,
          title: 'Different Product',
          description: 'desc',
          category: 'electronics',
          price: 199,
          discountPercentage: 10,
          stock: 5,
          sku: 'ELEC-001',
          availabilityStatus: 'In Stock',
          code: 'CODE456',
          thumbnail: 'thumb2.jpg'
        }]
      };

      wishlistStorage.loadUserWishlist.and.returnValue(differentWishlist);

      effects.loadUserWishlist$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorage({
          items: differentWishlist.items,
          userId: differentUserId
        }));
        expect(wishlistStorage.loadUserWishlist).toHaveBeenCalledWith(differentUserId);
        done();
      });

      actions$.next(WishlistActions.loadUserWishlist({ userId: differentUserId }));
    });

    it('should handle empty items array from storage', (done) => {
      const emptyWishlist: Wishlist = {
        userId: 123,
        items: []
      };

      wishlistStorage.loadUserWishlist.and.returnValue(emptyWishlist);

      effects.loadUserWishlist$.subscribe(action => {
        expect(action).toEqual(WishlistActions.loadWishlistFromStorage({
          items: [],
          userId: emptyWishlist.userId
        }));
        done();
      });

      actions$.next(WishlistActions.loadUserWishlist({ userId: emptyWishlist.userId }));
    });

    it('should handle multiple loadUserWishlist actions in sequence', (done) => {
      const userId1 = 123;
      const userId2 = 456;
      const wishlist1: Wishlist = {
        userId: userId1,
        items: [mockWishlist.items[0]]
      };
      const wishlist2: Wishlist = {
        userId: userId2,
        items: []
      };

      let callCount = 0;
      wishlistStorage.loadUserWishlist.and.callFake((userId: number) => {
        callCount++;
        return callCount === 1 ? wishlist1 : wishlist2;
      });

      const results: any[] = [];
      effects.loadUserWishlist$.subscribe({
        next: action => {
          results.push(action);
          if (results.length === 2) {
            expect(results[0]).toEqual(WishlistActions.loadWishlistFromStorage({
              items: wishlist1.items,
              userId: userId1
            }));
            expect(results[1]).toEqual(WishlistActions.loadWishlistFromStorage({
              items: wishlist2.items,
              userId: userId2
            }));
            expect(wishlistStorage.loadUserWishlist).toHaveBeenCalledTimes(2);
            expect(wishlistStorage.loadUserWishlist).toHaveBeenCalledWith(userId1);
            expect(wishlistStorage.loadUserWishlist).toHaveBeenCalledWith(userId2);
            done();
          }
        }
      });

      actions$.next(WishlistActions.loadUserWishlist({ userId: userId1 }));
      actions$.next(WishlistActions.loadUserWishlist({ userId: userId2 }));
    });

    it('should log error when storage service throws error', (done) => {
      wishlistStorage.loadUserWishlist.and.throwError(new Error('Storage corrupted'));
      spyOn(console, 'error');

      effects.loadUserWishlist$.subscribe(action => {
        expect(console.error).toHaveBeenCalledWith('Error loading user wishlist from storage:', jasmine.any(Error));
        expect(action).toEqual(WishlistActions.loadWishlistFromStorageFailure({
          error: 'Failed to load wishlist from storage'
        }));
        done();
      });

      actions$.next(WishlistActions.loadUserWishlist({ userId: mockWishlist.userId }));
    });
  });
});
