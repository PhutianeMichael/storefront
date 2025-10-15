import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ProductReviewsDialogComponent } from './product-reviews-dialog.component';
import { ProductReviewsDialogData } from '../../models/product.model';

describe('ProductReviewsDialogComponent', () => {
    let component: ProductReviewsDialogComponent;
    let fixture: ComponentFixture<ProductReviewsDialogComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ProductReviewsDialogComponent>>;

    const mockDialogData: ProductReviewsDialogData = {
        rating: 4.2,
        reviews: [
            {
                reviewerName: 'User1',
                reviewerEmail: 'user1@example.com',
                date: '2024-01-01',
                rating: 5,
                comment: 'Great!',
            },
            {reviewerName: 'User2', reviewerEmail: 'user2@example.com', date: '2024-01-02', rating: 4, comment: 'Good'},
            {
                reviewerName: 'User3',
                reviewerEmail: 'user3@example.com',
                date: '2024-01-03',
                rating: 3,
                comment: 'Average',
            },
            {
                reviewerName: 'User4',
                reviewerEmail: 'user4@example.com',
                date: '2024-01-04',
                rating: 5,
                comment: 'Excellent',
            },
            {reviewerName: 'User5', reviewerEmail: 'user5@example.com', date: '2024-01-05', rating: 2, comment: 'Poor'},
        ],
    };

    beforeEach(async () => {
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'backdropClick']);

        await TestBed.configureTestingModule({
            imports: [ProductReviewsDialogComponent, NoopAnimationsModule],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: mockDialogData},
                {provide: MatDialogRef, useValue: dialogRefSpy},
            ],
        }).compileComponents();

        dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ProductReviewsDialogComponent>>;
        dialogRef.backdropClick.and.returnValue(of(new MouseEvent('click')));

        fixture = TestBed.createComponent(ProductReviewsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Component Creation and Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with provided data', () => {
            expect(component.data).toEqual(mockDialogData);
        });

        it('should handle empty reviews data', () => {
            const emptyData: ProductReviewsDialogData = {rating: 0, reviews: []};
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [ProductReviewsDialogComponent, NoopAnimationsModule],
                providers: [
                    {provide: MAT_DIALOG_DATA, useValue: emptyData},
                    {provide: MatDialogRef, useValue: dialogRef},
                ],
            }).compileComponents();

            const emptyFixture = TestBed.createComponent(ProductReviewsDialogComponent);
            const emptyComponent = emptyFixture.componentInstance;
            emptyFixture.detectChanges();

            expect(emptyComponent.data).toEqual(emptyData);
        });
    });

    describe('Template Rendering', () => {
        it('should display correct average rating', () => {
            const averageRatingElement = fixture.debugElement.query(By.css('.average-rating'));
            expect(averageRatingElement.nativeElement.textContent).toContain('4.2');
        });

        it('should display correct number of reviews', () => {
            const reviewsCountElement = fixture.debugElement.query(By.css('.stars-container span'));
            expect(reviewsCountElement.nativeElement.textContent).toContain('5 Reviews');
        });

        it('should display star rating breakdown bars', () => {
            const barRows = fixture.debugElement.queryAll(By.css('.bar-row'));
            expect(barRows.length).toBe(5);
        });

        it('should display progress bars for each rating level', () => {
            const progressBars = fixture.debugElement.queryAll(By.css('mat-progress-bar'));
            expect(progressBars.length).toBe(5);
        });
    });

    describe('getRatingsPerBar Method', () => {
        it('should return correct count for each rating', () => {
            expect(component.getRatingsPerBar(mockDialogData.reviews, 5)).toBe(2);
            expect(component.getRatingsPerBar(mockDialogData.reviews, 4)).toBe(1);
            expect(component.getRatingsPerBar(mockDialogData.reviews, 3)).toBe(1);
            expect(component.getRatingsPerBar(mockDialogData.reviews, 2)).toBe(1);
            expect(component.getRatingsPerBar(mockDialogData.reviews, 1)).toBe(0);
        });

        it('should handle empty reviews array', () => {
            expect(component.getRatingsPerBar([], 5)).toBe(0);
        });

        it('should handle undefined reviews', () => {
            expect(component.getRatingsPerBar(undefined as any, 5)).toBe(0);
        });
    });

    describe('getBarClass Method', () => {
        it('should return correct CSS class for each star rating', () => {
            expect(component.getBarClass(5)).toBe('five-star-bar');
            expect(component.getBarClass(4)).toBe('four-star-bar');
            expect(component.getBarClass(3)).toBe('three-star-bar');
            expect(component.getBarClass(2)).toBe('two-star-bar');
            expect(component.getBarClass(1)).toBe('one-star-bar');
            expect(component.getBarClass(0)).toBe('one-star-bar');
        });
    });

    describe('trackStarBar Method', () => {
        it('should return the star value for tracking', () => {
            expect(component.trackStarBar(0, 5)).toBe(5);
            expect(component.trackStarBar(1, 4)).toBe(4);
            expect(component.trackStarBar(2, 3)).toBe(3);
        });
    });

    describe('Dialog Actions', () => {
        it('should close dialog with showReviews true when Show Reviews is clicked', () => {
            const showReviewsButton = fixture.debugElement.query(By.css('button:not(.danger)'));
            showReviewsButton.triggerEventHandler('click', null);

            expect(dialogRef.close).toHaveBeenCalledWith({showReviews: true});
        });

        it('should call onShowReviews method when Show Reviews button is clicked', () => {
            spyOn(component, 'onShowReviews');
            const showReviewsButton = fixture.debugElement.query(By.css('button:not(.danger)'));
            showReviewsButton.triggerEventHandler('click', null);

            expect(component.onShowReviews).toHaveBeenCalled();
        });

        it('should close dialog with showReviews false when Cancel is clicked', () => {
            const cancelButton = fixture.debugElement.query(By.css('button.danger'));
            cancelButton.triggerEventHandler('click', null);

            expect(dialogRef.close).toHaveBeenCalledWith({showReviews: false});
        });

        it('should call onCancel method when Cancel button is clicked', () => {
            spyOn(component, 'onCancel');
            const cancelButton = fixture.debugElement.query(By.css('button.danger'));
            cancelButton.triggerEventHandler('click', null);

            expect(component.onCancel).toHaveBeenCalled();
        });

        it('should close dialog with showReviews false on backdrop click', () => {
            dialogRef.backdropClick().subscribe(() => {
                expect(dialogRef.close).toHaveBeenCalledWith({showReviews: false});
            });
        });
    });

    describe('Progress Bar Values', () => {
        it('should calculate correct percentage values for progress bars', () => {
            const fiveStarBar = fixture.debugElement.queryAll(By.css('mat-progress-bar'))[0];
            expect(fiveStarBar.attributes['ng-reflect-value']).toBe('40');
        });

        it('should handle zero reviews gracefully', () => {
            const zeroData: ProductReviewsDialogData = {rating: 0, reviews: []};
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [ProductReviewsDialogComponent, NoopAnimationsModule],
                providers: [
                    {provide: MAT_DIALOG_DATA, useValue: zeroData},
                    {provide: MatDialogRef, useValue: dialogRef},
                ],
            }).compileComponents();

            const zeroFixture = TestBed.createComponent(ProductReviewsDialogComponent);
            const zeroComponent = zeroFixture.componentInstance;
            zeroFixture.detectChanges();

            const progressBars = zeroFixture.debugElement.queryAll(By.css('mat-progress-bar'));
            progressBars.forEach(bar => {
                expect(bar.attributes['ng-reflect-value']).toBe('0');
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle single review correctly', () => {
            const singleReviewData: ProductReviewsDialogData = {
                rating: 5,
                reviews: [{
                    reviewerName: 'Single',
                    reviewerEmail: 'single@example.com',
                    date: '2024-01-06',
                    rating: 5,
                    comment: 'Great',
                }],
            };

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [ProductReviewsDialogComponent, NoopAnimationsModule],
                providers: [
                    {provide: MAT_DIALOG_DATA, useValue: singleReviewData},
                    {provide: MatDialogRef, useValue: dialogRef},
                ],
            }).compileComponents();

            const singleFixture = TestBed.createComponent(ProductReviewsDialogComponent);
            const singleComponent = singleFixture.componentInstance;
            singleFixture.detectChanges();

            expect(singleComponent.getRatingsPerBar(singleReviewData.reviews, 5)).toBe(1);
        });

        it('should handle reviews with only one rating type', () => {
            const sameRatingData: ProductReviewsDialogData = {
                rating: 4,
                reviews: [
                    {
                        reviewerName: 'User1',
                        reviewerEmail: 'user1@example.com',
                        date: '2024-01-07',
                        rating: 4,
                        comment: 'Good',
                    },
                    {
                        reviewerName: 'User2',
                        reviewerEmail: 'user2@example.com',
                        date: '2024-01-08',
                        rating: 4,
                        comment: 'Good',
                    },
                    {
                        reviewerName: 'User3',
                        reviewerEmail: 'user3@example.com',
                        date: '2024-01-09',
                        rating: 4,
                        comment: 'Good',
                    },
                ],
            };

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [ProductReviewsDialogComponent, NoopAnimationsModule],
                providers: [
                    {provide: MAT_DIALOG_DATA, useValue: sameRatingData},
                    {provide: MatDialogRef, useValue: dialogRef},
                ],
            }).compileComponents();

            const sameFixture = TestBed.createComponent(ProductReviewsDialogComponent);
            const sameComponent = sameFixture.componentInstance;
            sameFixture.detectChanges();

            expect(sameComponent.getRatingsPerBar(sameRatingData.reviews, 4)).toBe(3);
            expect(sameComponent.getRatingsPerBar(sameRatingData.reviews, 5)).toBe(0);
        });
    });

    describe('UI Interactions', () => {
        it('should have correct button texts', () => {
            const buttons = fixture.debugElement.queryAll(By.css('button'));
            expect(buttons[0].nativeElement.textContent).toContain('Show Reviews');
            expect(buttons[1].nativeElement.textContent).toContain('Cancel');
        });

        it('should apply correct CSS classes to buttons', () => {
            const cancelButton = fixture.debugElement.query(By.css('button.danger'));
            const showReviewsButton = fixture.debugElement.query(By.css('button:not(.danger)'));

            expect(cancelButton).toBeTruthy();
            expect(showReviewsButton).toBeTruthy();
        });
    });
});
