import { Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list.component';
import { OrdersDetailComponent } from './orders-detail.component';

/**
 * Global application routes for OrderFlow Cloud frontend.
 * Export the constant as `routes` because `app.config.ts`
 * imports it like this:
 *
 *   import { routes } from './app.routes';
 *
 * So the name MUST be exactly 'routes'.
 */
export const routes: Routes = [
  // Redirect empty path to /orders
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },

  // Main list page
  {
    path: 'orders',
    component: OrdersListComponent,
  },

  // Placeholder for "create new order" (we will implement later)
  {
    path: 'orders/new',
    component: OrdersDetailComponent,
  },

  // Details for a given order ID (e.g. /orders/42)
  {
    path: 'orders/:id',
    component: OrdersDetailComponent,
  },

  // Fallback: anything unknown → /orders
  {
    path: '**',
    redirectTo: 'orders',
  },
];