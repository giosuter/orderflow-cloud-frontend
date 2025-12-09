// OrdersListComponent
// - Loads all orders from the backend
// - Provides simple client-side filtering by code + status
// - Integrates i18n labels via ngx-translate
// - Offers navigation to view, edit and create pages

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  /** All orders loaded from the backend. */
  orders: Order[] = [];

  /** Orders after applying filters (bound to the UI). */
  filteredOrders: Order[] = [];

  /** Simple loading + error flags. */
  loading = false;
  error: string | null = null;

  /** Filter fields bound to the template. */
  filterCode = '';
  filterStatus: '' | OrderStatus = '';

  /** Status options for the status filter dropdown (no empty here). */
  statusOptions: OrderStatus[] = ['NEW', 'PAID', 'SHIPPED', 'CANCELLED'];

  constructor(
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Load orders from the backend API.
   */
  private loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.error = 'Failed to load orders.';
        this.loading = false;
      },
    });
  }

  /**
   * Apply the current filterCode + filterStatus to the in-memory list.
   */
  private applyFilters(): void {
    const term = this.filterCode.trim().toLowerCase();
    const statusFilter = this.filterStatus;

    this.filteredOrders = this.orders.filter((order) => {
      const matchesCode =
        !term ||
        (order.code ?? '').toLowerCase().includes(term) ||
        (order.customerName ?? '').toLowerCase().includes(term);

      const matchesStatus =
        !statusFilter || order.status === statusFilter;

      return matchesCode && matchesStatus;
    });
  }

  /**
   * Called when the filter form is submitted.
   */
  onSearch(): void {
    this.applyFilters();
  }

  /**
   * Reset filters to their default values.
   */
  onResetFilters(): void {
    this.filterCode = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  /**
   * Navigate to the "New order" page.
   */
  onCreate(): void {
    this.router.navigate(['/orders/new']);
  }

  /**
   * Navigate to the details view for a given order.
   */
  onView(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }

  /**
   * Navigate to the edit view for a given order.
   */
  onEdit(order: Order): void {
    this.router.navigate(['/orders', order.id, 'edit']);
  }

  /**
   * Delete an order after confirmation, then reload the list.
   */
  onDelete(order: Order): void {
    const confirmed = window.confirm(
      `Do you really want to delete order "${order.code}"?`,
    );
    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.orderService.delete(order.id).subscribe({
      next: () => {
        // Re-load from backend (keeps logic simple and robust)
        this.loadOrders();
      },
      error: (err) => {
        console.error('Failed to delete order', err);
        this.error = 'Failed to delete order.';
        this.loading = false;
      },
    });
  }
}