// Orders list page:
//  - Shows a table of orders
//  - Allows filtering by code and status
//  - Links to view/edit/delete + create new order.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Order, OrderStatus } from './order.model';
import { OrderService, OrderSearchParams } from './order.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  /** All orders currently displayed in the table */
  orders: Order[] = [];

  /** Loading / error state */
  loading = false;
  error: string | null = null;

  /** Filters bound to the search form */
  filterCode = '';
  filterStatus: '' | OrderStatus = '';

  /** Options for the status dropdown in the filters */
  statusOptions: OrderStatus[] = ['NEW', 'PAID', 'CANCELLED'];

  constructor(
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    // Initial load: all orders (no filters)
    this.loadOrders();
  }

  /**
   * Internal helper to load orders based on current filters.
   *
   *  - If filterCode is non-empty, it is sent as "code" query param.
   *  - If filterStatus is not empty (""), it is sent as "status" query param.
   */
  private loadOrders(): void {
    this.loading = true;
    this.error = null;

    const params: OrderSearchParams = {};

    if (this.filterCode.trim() !== '') {
      params.code = this.filterCode.trim();
    }

    if (this.filterStatus !== '') {
      // here filterStatus is guaranteed to be a real OrderStatus
      params.status = this.filterStatus as OrderStatus;
    }

    this.orderService.search(params).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.error = 'Failed to load orders.';
        this.loading = false;
      },
    });
  }

  /** Called by (ngSubmit)="onSearch()" on the filter form */
  onSearch(): void {
    this.loadOrders();
  }

  /** Called by the "Reset" button in the filter bar */
  onResetFilters(): void {
    this.filterCode = '';
    this.filterStatus = '';
    this.loadOrders();
  }

  /** Called by the "New order" button in the header */
  onCreate(): void {
    this.router.navigate(['/orders', 'new']);
  }

  /** Called by the "View" action in the table */
  onView(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }

  /** Called by the "Edit" action in the table */
  onEdit(order: Order): void {
    this.router.navigate(['/orders', order.id, 'edit']);
  }

  /** Called by the "Delete" action in the table */
  onDelete(order: Order): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete order "${order.code}"?`,
    );
    if (!confirmed) {
      return;
    }

    this.orderService.delete(order.id).subscribe({
      next: () => {
        // Remove the deleted order from the local array
        this.orders = this.orders.filter((o) => o.id !== order.id);
      },
      error: (err) => {
        console.error('Failed to delete order', err);
        this.error = 'Failed to delete order.';
      },
    });
  }
}