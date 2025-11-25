import { Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list.component';
import { OrderDetailComponent } from './order-detail.component';
import { OrderNewComponent } from './order-new.component';

/**
 * Application routes for OrderFlow Cloud frontend.
 *
 * /orders         -> list of orders
 * /orders/new     -> create new order
 * /orders/:id     -> order detail view
 * /               -> redirect to /orders
 */
export const routes: Routes = [
  {
    path: 'orders',
    component: OrdersListComponent,
  },
  {
    path: 'orders/new',
    component: OrderNewComponent,
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: '**',
    redirectTo: 'orders',
  },
];