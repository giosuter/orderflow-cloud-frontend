import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

/**
 * OrderNewComponent
 *
 * Simple "create new order" page using template-driven forms.
 * It calls OrderService.create(...) and then navigates back to /orders.
 */
@Component({
  selector: 'app-order-new',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss'],
})
export class OrderNewComponent {
  /**
   * Local draft model for the form.
   *
   * We deliberately allow `status` to be either:
   *  - an actual OrderStatus value, or
   *  - '' (empty string) meaning "no status selected yet".
   *
   * Before sending to the backend we normalize '' -> undefined.
   */
  draft: {
    code: string;
    status: OrderStatus | '';
    customerName: string;
    total: number;
  } = {
    code: '',
    status: '',
    customerName: '',
    total: 0,
  };

  saving = false;
  error: string | null = null;

  // Reuse the same status options as the list, adapt to your real enum/union values
  // NOTE: these are plain string literals compatible with the OrderStatus type.
  statusOptions: (OrderStatus | '')[] = ['', 'NEW', 'PAID', 'CANCELLED'];

  constructor(
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  onSubmit(): void {
    if (!this.draft.code || !this.draft.customerName) {
      this.error = 'Code and customer name are required.';
      return;
    }

    this.saving = true;
    this.error = null;

    // Normalize '' -> undefined so it matches Order.status?: OrderStatus
    const normalizedStatus: OrderStatus | undefined =
      this.draft.status === '' ? undefined : this.draft.status;

    // Build payload exactly matching Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
    const payload: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      code: this.draft.code,
      customerName: this.draft.customerName,
      total: this.draft.total,
      status: normalizedStatus,
    };

    this.orderService.create(payload).subscribe({
      next: () => {
        this.saving = false;
        // After successful creation, go back to the orders list
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Failed to create order', err);
        this.error = 'Failed to create order. Please try again.';
        this.saving = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/orders']);
  }
}