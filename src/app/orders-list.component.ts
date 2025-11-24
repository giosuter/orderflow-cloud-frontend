import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.model';

/**
 * OrdersListComponent
 *
 * Displays a table of orders with:
 *  - loading & error messages
 *  - filter by code and status
 *  - link to a detail page (/orders/:id)
 */
@Component({
  standalone: true,
  selector: 'app-orders-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  // Raw list from backend
  orders: Order[] = [];

  // Filtered list for display
  filteredOrders: Order[] = [];

  // UI state
  loading = false;
  error: string | null = null;

  // Filter model
  filterCode = '';
  filterStatus: OrderStatus | '' = '';

  // Available status options (adapt to your actual enum values)
  statusOptions: OrderStatus[] = [
    'NEW' as OrderStatus,
    'OPEN' as OrderStatus,
    'COMPLETED' as OrderStatus,
    'CANCELLED' as OrderStatus,
  ];

  constructor(private readonly orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Load all orders from backend via OrderService.
   */
  private loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.orders = orders ?? [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.error = 'Failed to load orders.';
        this.orders = [];
        this.filteredOrders = [];
        this.loading = false;
      },
    });
  }

  /**
   * Apply filterCode + filterStatus to orders array
   * and update filteredOrders.
   */
  applyFilters(): void {
    const codeFilter = this.filterCode.trim().toLowerCase();
    const statusFilter = this.filterStatus;

    this.filteredOrders = this.orders.filter((order) => {
      let matchesCode = true;
      let matchesStatus = true;

      if (codeFilter) {
        const code = (order.code ?? '').toLowerCase();
        matchesCode = code.includes(codeFilter);
      }

      if (statusFilter) {
        matchesStatus = order.status === statusFilter;
      }

      return matchesCode && matchesStatus;
    });
  }
}