import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-new',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss'],
})
export class OrderNewComponent {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  saving = false;
  errorMsg = '';

  // Form model
  form: Partial<Order> = {
    code: '',
    customerName: '',
    total: 0,
    status: 'NEW',
    description: '',
  };

  readonly statuses: OrderStatus[] = ['NEW', 'PROCESSING', 'PAID', 'SHIPPED', 'CANCELLED'];

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

    this.orderService.create(payload).subscribe({
      next: () => this.router.navigate(['/orders']),
      error: (err: unknown) => {
        console.error('Create failed', err);
        this.errorMsg = 'Create failed. Check console/network.';
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