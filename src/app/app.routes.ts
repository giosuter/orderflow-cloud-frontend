import { Routes } from '@angular/router';

import { OrdersListComponent } from './orders-list.component';
import { OrderEditComponent } from './order-edit.component';
import { OrderNewComponent } from './order-new.component';

export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },

  { path: 'orders', component: OrdersListComponent },
  { path: 'orders/new', component: OrderNewComponent },
  { path: 'orders/:id/edit', component: OrderEditComponent },

  { path: '**', redirectTo: 'orders' },
];