import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

import { Order } from './order.model';
import { OrderService } from './order.service';

/**
 * OrdersDetailComponent
 *
 * Shows details of a single Order, loaded from the backend by its ID.
 * URL pattern: /orders/:id
 */
@Component({
  selector: 'app-orders-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = null;

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!id || Number.isNaN(id)) {
      this.loading = false;
      this.error = 'Invalid order id.';
      return;
    }

    this.orderService.getById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order', err);
        this.error = 'Failed to load order.';
        this.loading = false;
      },
    });
  }

  getStatusClass(status?: string | null): string {
    if (!status) {
      return 'status_UNKNOWN';
    }
    return `status_${status}`;
  }
}