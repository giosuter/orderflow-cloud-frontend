import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

/**
 * OrdersListComponent
 *
 * Responsibilities:
 *  - On init, load all orders from the backend via OrderService.
 *  - Show loading state while the HTTP call is in progress.
 *  - Show a simple error message if the HTTP call fails.
 *  - Render the list of orders in a basic HTML table.
 *
 * This component is intentionally kept simple:
 *  - No pagination yet
 *  - No filtering or sorting yet
 * Those can be added safely in later steps.
 */
@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
})
export class OrdersListComponent implements OnInit {
  /**
   * The list of orders returned by the backend.
   */
  orders: Order[] = [];

  /**
   * True while we are waiting for the HTTP response.
   */
  loading = false;

  /**
   * Holds a simple user-friendly error message when something goes wrong.
   */
  errorMessage: string | null = null;

  constructor(private readonly orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Load all orders from the backend.
   *
   * We keep this in a separate method so we can:
   *  - Call it from ngOnInit()
   *  - Potentially call it from a "Refresh" button later
   */
  loadOrders(): void {
    this.loading = true;
    this.errorMessage = null;

    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.errorMessage = 'Failed to load orders. Please try again later.';
        this.loading = false;
      },
    });
  }

  /**
   * trackBy function used by *ngFor to avoid re-rendering
   * unchanged rows when the array changes.
   */
  trackByOrderId(index: number, order: Order): number | undefined {
    return order.id ?? index;
  }

  /**
   * Optional helper for rendering: convert enum to a human-readable label.
   * For now we just reuse the enum value, but we keep this method in case we
   * want to map NEW -> "New", PAID -> "Paid", etc.
   */
  displayStatus(status: OrderStatus): string {
    return status;
  }
}