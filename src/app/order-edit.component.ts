import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
})
export class OrderEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  id!: number;

  loading = false;
  saving = false;
  errorMsg = '';

  form: Partial<Order> = {
    code: '',
    customerName: '',
    total: 0,
    status: 'NEW',
    description: '',
  };

  readonly statuses: OrderStatus[] = ['NEW', 'PROCESSING', 'PAID', 'SHIPPED', 'CANCELLED'];

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    this.id = Number(rawId);

    if (!Number.isFinite(this.id)) {
      this.errorMsg = 'Invalid order id.';
      return;
    }

    this.loadOrder();
  }

  private loadOrder(): void {
    this.errorMsg = '';
    this.loading = true;

    this.orderService.findById(this.id).subscribe({
      next: (o) => {
        this.form = {
          code: o.code,
          customerName: o.customerName ?? '',
          total: o.total,
          status: o.status,
          description: o.description ?? '',
        };
      },
      error: (err: unknown) => {
        console.error('Load order failed', err);
        this.errorMsg = 'Failed to load order.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  save(): void {
    this.errorMsg = '';
    this.saving = true;

    const payload: Partial<Order> = {
      code: String(this.form.code ?? '').trim(),
      customerName: String(this.form.customerName ?? '').trim() || undefined,
      total: Number(this.form.total ?? 0),
      status: (this.form.status ?? 'NEW') as OrderStatus,
      description: String(this.form.description ?? '').trim() || undefined,
    };

    this.orderService.update(this.id, payload).subscribe({
      next: () => this.router.navigate(['/orders']),
      error: (err: unknown) => {
        console.error('Update failed', err);
        this.errorMsg = 'Update failed.';
        this.saving = false;
      },
      complete: () => {
        this.saving = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }
}