import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.model';

/**
 * OrderDetailComponent
 *
 * Shows details of a single order loaded from the backend
 * via GET /api/orders/{id}.
 */
@Component({
  standalone: true,
  selector: 'app-order-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  loading = false;
  error: string | null = null;

  private routeSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = null;

    // Read the ":id" parameter from the route and load the order
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : NaN;

      if (!id || isNaN(id)) {
        this.error = 'Invalid order id.';
        this.loading = false;
        return;
      }

      this.loadOrder(id);
    });
  }

  private loadOrder(id: number): void {
    this.loading = true;
    this.error = null;

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

  /**
   * Simple helper to render the status string nicely,
   * in case status is an enum value.
   */
  getStatusLabel(status: OrderStatus | undefined): string {
    if (!status) {
      return 'UNKNOWN';
    }
    return String(status);
  }

  goBackToList(): void {
    // Navigate back to the orders list
    this.router.navigate(['/orders']);
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}