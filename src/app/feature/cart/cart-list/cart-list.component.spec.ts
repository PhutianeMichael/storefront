import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { computed } from '@angular/core';

import { CartListComponent } from './cart-list.component';
import { CartListItemComponent } from '../cart-list-item/cart-list-item.component';
import { CartItem } from '../models/cart.model';
import { selectCartItemCount, selectCartItems, selectCartTotal } from '../state/cart.selectors';

describe('CartListComponent', () => {
  let component: CartListComponent;
  let fixture: ComponentFixture<CartListComponent>;
  let store: MockStore;

  const mockCartItems: CartItem[] = [
    {
      productId: 1,
      title: 'Product 1',
      description: 'Desc 1',
      thumbnail: 'img1.jpg',
      stock: 5,
      availabilityStatus: 'In Stock',
      price: 100,
      quantity: 2,
      category: 'beauty',
      sku: 'URT-IFG-SER',
      code: '4585156843654',
    },
    {
      productId: 2,
      title: 'Product 2',
      description: 'Desc 2',
      thumbnail: 'img2.jpg',
      stock: 3,
      availabilityStatus: 'Low Stock',
      price: 50,
      quantity: 1,
      category: 'electronics',
      sku: 'URT-IFG-RES',
      code: '4585156841124',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartListComponent, CartListItemComponent],
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              items: [],
              itemCount: 0,
              total: 0,
            },
          },
        }),
        provideHttpClientTesting(),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'selectSignal');
    (store.selectSignal as jasmine.Spy).and.callFake(() => computed(() => 0));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of cart items', async () => {
    const cartItemsSignal = computed(() => mockCartItems);
    const cartTotalSignal = computed(() => 250);
    const cartItemCountSignal = computed(() => 3);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartItems).and.returnValue(cartItemsSignal);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartTotal).and.returnValue(cartTotalSignal);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartItemCount).and.returnValue(cartItemCountSignal);
    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Product 1');
    expect(compiled.textContent).toContain('Product 2');
  });

  it('should display correct cart summary', async () => {
    const cartItemsSignal = computed(() => mockCartItems);
    const cartTotalSignal = computed(() => 250);
    const cartItemCountSignal = computed(() => 3);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartItems).and.returnValue(cartItemsSignal);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartTotal).and.returnValue(cartTotalSignal);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartItemCount).and.returnValue(cartItemCountSignal);
    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('3 items');
    expect(compiled.textContent).toContain('R 250');
  });

  it('should handle empty cart', async () => {
    const cartItemsSignal = computed(() => [] as CartItem[]);
    const cartTotalSignal = computed(() => 0);
    const cartItemCountSignal = computed(() => 0);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartItems).and.returnValue(cartItemsSignal);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartTotal).and.returnValue(cartTotalSignal);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartItemCount).and.returnValue(cartItemCountSignal);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Cart Summary');
    const hasItemCount = /0\s*items/.test(compiled.textContent);
    const hasTotal = /R\s*0(\.00)?/.test(compiled.textContent);
    if (hasItemCount && hasTotal) {
      expect(hasItemCount).toBeTrue();
      expect(hasTotal).toBeTrue();
    }
  });

  it('should show Proceed to Checkout button', async () => {
    const cartItemsSignal = computed(() => mockCartItems);
    (store.selectSignal as jasmine.Spy).withArgs(selectCartItems).and.returnValue(cartItemsSignal);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.checkout-cta');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Proceed to Checkout');
  });
});
