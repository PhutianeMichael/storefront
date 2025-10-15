import { Component, inject, Signal } from '@angular/core';
import { Review } from '../../models/product.model';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError, of } from 'rxjs';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-product-reviews',
  imports: [MatListModule, DatePipe, MatIconModule, MatButton],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss'
})
export class ProductReviewsComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private router = inject(Router);

  reviews: Signal<Review[]> = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.productService.getProductById(id).pipe(
          map(product => Array.isArray(product?.reviews) ? product.reviews as Review[] : []),
          catchError(() => of([]))
        );
      })
    ),
    { initialValue: [] }
  );

  /**
   * Navigates back to the product details page.
   */
  goBackToProduct() {
    this.router.navigate([`../`], { relativeTo: this.route });
  }

  /**
   * Returns an array representing the number of stars for a given rating.
   * @param rating The rating value.
   * @returns An array of length equal to the rating.
   */
  getStars(rating: number): any[] {
    const safeRating = Math.max(0, rating);
    return Array(safeRating).fill(0);
  }
}
