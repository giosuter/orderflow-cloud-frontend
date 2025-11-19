// Standalone component that displays a simple list of orders.
// It uses OrderService.getAll() to load data from the OrderFlow API.
//
// Responsibilities:
//   • Trigger loading on init
//   • Show a loading indicator while waiting
//   • Show a table of orders on success
//   • Show a simple error message on failure

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Order } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Load all orders from the backend via OrderService.
   * Keeps UI state in sync: loading, data, error.
   */
  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
      },
    });
  }
}