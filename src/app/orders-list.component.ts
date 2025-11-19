import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

/**
 * OrdersListComponent
 *
 * This component:
 *  - calls the REST API via OrderService.getAll()
 *  - shows a loading state while the HTTP call is in progress
 *  - shows an error message if loading fails
 *  - renders a simple HTML table with all orders when data is available
 *
 * The actual HTTP base URL is controlled centrally via:
 *   src/environments/environment.ts (dev)
 *   src/environments/environment.prod.ts (prod)
 */
@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  /**
   * All orders returned by the backend.
   */
  orders: Order[] = [];

  /**
   * True while the HTTP request is running.
   */
  isLoading = false;

  /**
   * Non-null if an error occurred while loading.
   */
  errorMessage: string | null = null;

  constructor(private readonly orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Triggers a refresh of the orders list from the backend.
   *
   * Currently just called on init, but we can later wire it to
   * a "Refresh" button.
   */
  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.orders = orders;
        // In the happy-path we keep isLoading true until complete()
        // is called below. That ensures a consistent lifecycle.
      },
      error: (err) => {
        console.error('Failed to load orders', err);

        this.errorMessage =
          'Failed to load orders from the server. Please try again.';

        // IMPORTANT:
        // When an observable errors, complete() is NOT called.
        // We MUST reset isLoading here, otherwise the template
        // condition `!isLoading && errorMessage` never becomes true
        // and the error state is never displayed.
        this.isLoading = false;
      },
      complete: () => {
        // For a successful request, complete() is called and we
        // can safely turn off the loading indicator here.
        this.isLoading = false;
      },
    });
  }

  /**
   * Small helper for the template to render the enum as a string.
   * (Useful later if we ever store numeric enum values instead of strings.)
   */
  asStatusLabel(status: OrderStatus): string {
    return status;
  }
}