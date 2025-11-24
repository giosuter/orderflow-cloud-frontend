// src/app/orders-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Order } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  loading = false;
  errorMessage = '';

  codeFilter = '';

  constructor(private readonly orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getAll().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.errorMessage = 'Failed to load orders. Please try again.';
        this.orders = [];
        this.filteredOrders = [];
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const filter = this.codeFilter.trim().toLowerCase();

    if (!filter) {
      this.filteredOrders = [...this.orders];
      return;
    }

    this.filteredOrders = this.orders.filter(order =>
      (order.code ?? '').toLowerCase().includes(filter)
    );
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  onReload(): void {
    this.loadOrders();
  }
}