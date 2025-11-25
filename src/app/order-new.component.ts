import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderStatus } from './order.model';
import { OrderService } from './order.service';

/**
 * NewOrderDraft
 *
 * Internal type for the "create new order" form.
 * Matches the shape expected by OrderService.create(...),
 * but with a simple status field that allows "" (no selection yet)
 * or a real OrderStatus.
 */
type NewOrderDraft = {
  code: string;
  status: '' | OrderStatus;
  customerName: string;
  total: number;
};

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
  // Form model
  draft: NewOrderDraft = {
    code: '',
    status: '',
    customerName: '',
    total: 0,
  };

  saving = false;
  error: string | null = null;

  // Status options for the dropdown
  statusOptions: Array<'' | OrderStatus> = ['', 'NEW', 'PAID', 'CANCELLED'];

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

    // Build payload for the service (omit empty status)
    const payload: {
      code: string;
      status?: OrderStatus;
      customerName: string;
      total: number;
    } = {
      code: this.draft.code,
      customerName: this.draft.customerName,
      total: this.draft.total,
    };

    if (this.draft.status !== '') {
      payload.status = this.draft.status;
    }

    this.orderService.create(payload).subscribe({
      next: () => {
        this.saving = false;
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