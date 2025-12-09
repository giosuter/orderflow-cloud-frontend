// Responsibilities:
//  - Fetch and display the list of orders
//  - Navigate to detail/edit pages
//  - Allow deleting an order (with a confirmation prompt)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { Order } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  /** All orders currently loaded from the backend */
  orders: Order[] = [];

  /** Loading flag for the list */
  loading = false;

  /** Error message shown in the template, if any */
  error: string | null = null;

  constructor(
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Load all orders from the backend.
   */
  private loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getAll().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load orders', err);
        this.error = 'Failed to load orders.';
        this.loading = false;
      },
    });
  }

  /**
   * Navigate to the detail page of an order.
   */
  onView(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }

  /**
   * Navigate to the edit page of an order.
   */
  onEdit(order: Order): void {
    this.router.navigate(['/orders', order.id, 'edit']);
  }

  /**
   * Delete an order after user confirmation.
   */
  onDelete(order: Order): void {
    const confirmed = window.confirm(
      `Do you really want to delete order "${order.code}"?`,
    );

    if (!confirmed) {
      return;
    }

    // Optional: you could show a "deleting" flag or a spinner here
    this.error = null;

    this.orderService.delete(order.id).subscribe({
      next: () => {
        // Simple approach: reload the list from the backend
        this.loadOrders();
      },
      error: (err: unknown) => {
        console.error('Failed to delete order', err);
        this.error = 'Failed to delete order. Please try again.';
      },
    });
  }

  /**
   * Navigate to the "new order" page.
   */
  onCreate(): void {
    this.router.navigate(['/orders/new']);
  }
}