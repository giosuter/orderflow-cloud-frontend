import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent {
  order: Order | null = null;
  loading = true;
  error: string | null = null;

  private routeSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');

      if (!idParam) {
        this.error = 'Invalid order ID.';
        this.loading = false;
        return;
      }

      const id = Number(idParam);
      if (Number.isNaN(id)) {
        this.error = 'Invalid order ID.';
        this.loading = false;
        return;
      }

      this.fetchOrder(id);
    });
  }

  // NOTE: now id is a number, matching OrderService.getById(id: number)
  fetchOrder(id: number): void {
    this.loading = true;
    this.error = null;

    this.orderService.getById(id).subscribe({
      next: (ord) => {
        this.order = ord;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order', err);
        this.error = 'Failed to load order';
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}