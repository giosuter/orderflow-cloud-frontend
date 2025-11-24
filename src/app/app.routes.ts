import { Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list.component';
import { OrderDetailComponent } from './order-detail.component';

/**
 * Application routes:
 *  - ''          → redirect to '/orders'
 *  - '/orders'   → list of all orders
 *  - '/orders/:id' → details of a single order
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
  { path: 'orders', component: OrdersListComponent },
  { path: 'orders/:id', component: OrderDetailComponent },

  // Fallback route (optional)
  { path: '**', redirectTo: 'orders' },
];