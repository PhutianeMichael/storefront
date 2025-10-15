import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { ProductReviewsComponent } from './product-reviews.component';
import { ProductService } from '../../services/product.service';
import { Product, Review } from '../../models/product.model';

describe('ProductReviewsComponent', () => {
  let component: ProductReviewsComponent;
  let fixture: ComponentFixture<ProductReviewsComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: { paramMap: BehaviorSubject<any> };

  const mockReviews: Review[] = [
    {
      reviewerName: 'John Doe',
      reviewerEmail: 'john@example.com',
      date: '2024-01-15',
      rating: 5,
      comment: 'Excellent product!'
    },
    {
      reviewerName: 'Jane Smith',
      reviewerEmail: 'jane@example.com',
      date: '2024-01-10',
      rating: 3,
      comment: 'Average product, could be better'
    }
  ];

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'A test product',
    category: 'Test Category',
    price: 100,
    discountPercentage: 0,
    rating: 4,
    stock: 10,
    tags: [],
    brand: 'TestBrand',
    sku: 'SKU123',
    weight: 1,
    dimensions: { width: 1, height: 1, depth: 1 },
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: 'Available',
    reviews: mockReviews,
    returnPolicy: '',
    meta: {
      createdAt: '2024-01-01', updatedAt: '2024-01-01', barcode: '123456',
      qrCode: 'PUI-JKN-LLP',
    },
    images: [],
    thumbnail: ''
  };

  beforeEach(async () => {
    const paramMap = new BehaviorSubject({
      get: (_key: string) => '1'
    });

    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById']);
    productServiceSpy.getProductById.and.returnValue(of(mockProduct));
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductReviewsComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap, snapshot: {}, outlet: 'primary', component: null } },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReviewsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as any;
  });

  describe('Component Creation and Initialization', () => {
    it('should create', () => {
      productService.getProductById.and.returnValue(of(mockProduct));
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize with empty reviews if no product found', () => {
      productService.getProductById.and.returnValue(of(undefined));
      fixture = TestBed.createComponent(ProductReviewsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.reviews()).toEqual([]);
    });

    it('should initialize with empty reviews if product has no reviews', () => {
      const productWithoutReviews: Product = { ...mockProduct, reviews: [] };
      productService.getProductById.and.returnValue(of(productWithoutReviews));
      fixture = TestBed.createComponent(ProductReviewsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.reviews()).toEqual([]);
    });
  });

  describe('Route Parameter Handling', () => {
    it('should fetch reviews based on route parameter', () => {
      productService.getProductById.and.returnValue(of(mockProduct));
      fixture.detectChanges();

      expect(productService.getProductById).toHaveBeenCalledWith(1);
      expect(component.reviews()).toEqual(mockReviews);
    });

    it('should handle different route parameters', () => {
      const paramMap = new BehaviorSubject({
        get: (_key: string) => '2'
      });
      activatedRoute.paramMap = paramMap as any;

      productService.getProductById.and.returnValue(of(mockProduct));
      fixture = TestBed.createComponent(ProductReviewsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(productService.getProductById).toHaveBeenCalledWith(2);
    });

    it('should handle invalid route parameter', () => {
      const paramMap = new BehaviorSubject({
        get: (_key: string) => 'invalid'
      });
      activatedRoute.paramMap = paramMap as any;
      productService.getProductById.and.returnValue(of(undefined));
      fixture = TestBed.createComponent(ProductReviewsComponent);
      component = fixture.componentInstance;
      paramMap.next({ get: (_key: string) => 'invalid' });
      fixture.detectChanges();
      expect(productService.getProductById).toHaveBeenCalledWith(NaN);
      expect(component.reviews()).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', () => {
      productService.getProductById.and.returnValue(throwError(() => new Error('Service error')));
      fixture = TestBed.createComponent(ProductReviewsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.reviews()).toEqual([]);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      productService.getProductById.and.returnValue(of(mockProduct));
      fixture.detectChanges();
    });

    it('should display reviews when available', () => {
      const reviewItems = fixture.debugElement.queryAll(By.css('mat-list-item'));
      expect(reviewItems.length).toBe(2);
    });

    it('should display reviewer names correctly', () => {
      const reviewerNames = fixture.debugElement.queryAll(By.css('.reviewer'));
      expect(reviewerNames[0].nativeElement.textContent).toContain('John Doe');
      expect(reviewerNames[1].nativeElement.textContent).toContain('Jane Smith');
    });

    it('should display review comments correctly', () => {
      const reviewComments = fixture.debugElement.queryAll(By.css('.review-comment'));
      expect(reviewComments[0].nativeElement.textContent).toContain('Excellent product!');
      expect(reviewComments[1].nativeElement.textContent).toContain('Average product, could be better');
    });

    it('should display correct number of stars for each rating', () => {
      const ratingContainers = fixture.debugElement.queryAll(By.css('.review-rating'));
      const firstRatingStars = ratingContainers[0].queryAll(By.css('mat-icon'));
      const secondRatingStars = ratingContainers[1].queryAll(By.css('mat-icon'));

      expect(firstRatingStars.length).toBe(5);
      expect(secondRatingStars.length).toBe(3);
    });

    it('should display formatted dates', () => {
      const reviewDates = fixture.debugElement.queryAll(By.css('.review-date'));
      expect(reviewDates[0].nativeElement.textContent).toBeTruthy();
      expect(reviewDates[1].nativeElement.textContent).toBeTruthy();
    });
  });

  describe('No Reviews State', () => {
    it('should display "No reviews yet" when there are no reviews', () => {
      const productWithoutReviews = { ...mockProduct, reviews: [] };
      productService.getProductById.and.returnValue(of(productWithoutReviews));
      fixture = TestBed.createComponent(ProductReviewsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const noReviewsMessage = fixture.debugElement.query(By.css('p'));
      expect(noReviewsMessage.nativeElement.textContent).toContain('No reviews yet.');
    });

    it('should not display review list when there are no reviews', () => {
      const productWithoutReviews = { ...mockProduct, reviews: [] };
      productService.getProductById.and.returnValue(of(productWithoutReviews));
      fixture = TestBed.createComponent(ProductReviewsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const reviewList = fixture.debugElement.query(By.css('mat-list'));
      expect(reviewList).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('should navigate back when back button is clicked', () => {
      const backButton = fixture.debugElement.query(By.css('button'));
      backButton.triggerEventHandler('click', null);

      expect(router.navigate).toHaveBeenCalledWith(['../'], { relativeTo: jasmine.any(Object) });
    });

    it('should call goBackToProduct method when back button is clicked', () => {
      spyOn(component, 'goBackToProduct');
      const backButton = fixture.debugElement.query(By.css('button'));
      backButton.triggerEventHandler('click', null);

      expect(component.goBackToProduct).toHaveBeenCalled();
    });
  });

  describe('getStars Method', () => {
    it('should return array of correct length for rating', () => {
      expect(component.getStars(5).length).toBe(5);
      expect(component.getStars(3).length).toBe(3);
      expect(component.getStars(0).length).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(component.getStars(-1).length).toBe(0);
      expect(component.getStars(10).length).toBe(10);
    });
  });

  describe('Component Lifecycle', () => {
    it('should update when route parameters change', () => {
      const newParamMap = new BehaviorSubject({
        get: (_key: string) => '3'
      });
      activatedRoute.paramMap = newParamMap as any;
      productService.getProductById.and.returnValue(of(mockProduct));
      fixture = TestBed.createComponent(ProductReviewsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(productService.getProductById).toHaveBeenCalledWith(3);
    });
  });
});
