import { Component, Inject } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { ProductReviewsDialogData, Review } from '../../models/product.model';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgClass } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-product-reviews-dialog',
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatIconModule,
    MatProgressBarModule,
    NgClass,
    MatDivider,
  ],
  templateUrl: './product-reviews-dialog.component.html',
  styleUrl: './product-reviews-dialog.component.scss'
})
export class ProductReviewsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProductReviewsDialogData,
    private dialogRef: MatDialogRef<ProductReviewsDialogComponent>
  ) {
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close({ showReviews: false });
    });
  }

  /**
   * trackBy function for rendering star bars in ngFor.
   * @param i The index of the star bar.
   * @param star The star value.
   * @returns The star value for tracking.
   */
  trackStarBar(i: number, star: number) {
    return star;
  }

  /**
   * Gets the number of reviews for a specific star rating.
   * @param reviews Array of reviews.
   * @param star The star rating to count.
   * @returns Number of reviews with the given star rating.
   */
  getRatingsPerBar(reviews: Review[] | undefined, star: number): number {
    if (!Array.isArray(reviews)) return 0;
    return reviews.filter((review: Review) => review.rating === star).length ?? 0;
  }

  /**
   * Returns the CSS class for the star bar based on the star value.
   * @param star The star rating.
   * @returns The CSS class name for the star bar.
   */
  getBarClass(star: number) {
    switch (star) {
      case 5: return 'five-star-bar';
      case 4: return 'four-star-bar';
      case 3: return 'three-star-bar';
      case 2: return 'two-star-bar';
      default: return 'one-star-bar';
    }
  }

  /**
   * Calculates the percentage of reviews for a specific star rating.
   * @param reviews Array of reviews.
   * @param star The star rating to calculate percentage for.
   * @returns Percentage of reviews with the given star rating.
   */
  getRatingsPercentage(reviews: Review[], star: number): number {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    return Math.round((this.getRatingsPerBar(reviews, star) / reviews.length) * 100);
  }

  /**
   * Closes the dialog and signals to show reviews.
   */
  onShowReviews() {
    this.dialogRef.close({ showReviews: true });
  }

  /**
   * Closes the dialog and signals to cancel showing reviews.
   */
  onCancel() {
    this.dialogRef.close({ showReviews: false });
  }
}
