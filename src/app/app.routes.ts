import { Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list.component';

/**
 * Global application routes.
 *
 * Canonical rule (aligned with backend URL.md):
 * - Frontend route for the orders list: `/orders`
 * - Default route `/` redirects to `/orders`
 * - No trailing slash in the route paths
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: 'orders',
    component: OrdersListComponent,
  },
  // Optional wildcard: later we can show a 404 page
  // { path: '**', redirectTo: 'orders' },
];