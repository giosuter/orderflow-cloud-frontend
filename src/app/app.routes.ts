import { Routes } from '@angular/router';

import { OrdersListComponent } from './orders-list.component';
import { OrdersDetailComponent } from './orders-detail.component';

/**
 * Application routes:
 *  - ''          → redirect to '/orders'
 *  - '/orders'   → list of orders
 *  - '/orders/:id' → order detail page
 *  - '**'        → wildcard redirect to '/orders'
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
  { path: 'orders', component: OrdersListComponent },
  { path: 'orders/:id', component: OrdersDetailComponent },
  { path: '**', redirectTo: 'orders' },
];