import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  loading = false;
  error: string | null = null;

  // Text filter
  filterCode = '';

  // IMPORTANT: default = null -> "All" is selected
  filterStatus: OrderStatus | null = null;

  // Available statuses for the dropdown (adapt to your real enum)
  statusOptions: OrderStatus[] = ['NEW', 'PAID', 'CANCELLED'];

  constructor(private readonly orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.orders = orders ?? [];
        // initial filter: show everything
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.error = 'Failed to load orders';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    const codeFilter = this.filterCode.trim().toLowerCase();
    const statusFilter = this.filterStatus;

    this.filteredOrders = this.orders.filter((order) => {
      const matchesCode =
        !codeFilter ||
        (order.code ?? '').toLowerCase().includes(codeFilter);

      const matchesStatus =
        statusFilter == null || order.status === statusFilter;

      return matchesCode && matchesStatus;
    });
  }
}