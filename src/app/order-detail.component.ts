import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { Order } from './order.model';
import { OrderService } from './order.service';

/**
 * OrderDetailComponent
 *
 * Shows the details of a single Order, loaded from the backend via OrderService.
 * URL: /orders/:id
 */
@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  loading = false;
  error: string | null = null;

  private routeSub: Subscription | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = null;

    // Subscribe to :id route parameter
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');

      if (!idParam) {
        this.error = 'No order id provided in URL.';
        this.loading = false;
        return;
      }

      const id = Number(idParam);
      if (Number.isNaN(id)) {
        this.error = `Invalid order id: ${idParam}`;
        this.loading = false;
        return;
      }

      // Call backend to fetch order
      this.fetchOrder(id);
    });
  }

  private fetchOrder(id: number): void {
    this.loading = true;
    this.error = null;
    this.order = null;

    this.orderService.getById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order', err);
        this.error = 'Failed to load order. Please try again.';
        this.loading = false;
      },
    });
  }

  backToList(): void {
    this.router.navigate(['/orders']);
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}