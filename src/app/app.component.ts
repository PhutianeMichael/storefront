import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { AppState } from './app.state';
import { appAuthInit } from './feature/auth/state/auth.actions';
import { Store } from '@ngrx/store';
import { appCartInit } from './feature/cart/state/cart.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'storefront';
  private store = inject(Store<AppState>)

  /**
   * Initializes the application state by dispatching auth, cart, and wishlist init actions.
   */
  ngOnInit() {
    this.store.dispatch(appAuthInit());
    this.store.dispatch(appCartInit());
  }
}
