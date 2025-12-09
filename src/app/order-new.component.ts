import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { OrderStatus } from './order.model';
import { OrderService } from './order.service';

/**
 *
 * Internal type for the "create new order" form.
 * - status can be:
 *    - ''  → no selection yet (placeholder in the dropdown)
 *    - one of the real OrderStatus values
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
 * Responsibilities:
 *  - Manage the form model (draft)
 *  - Perform minimal validation
 *  - Call OrderService.create(...) on submit
 *  - Navigate back to the orders list on success
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
   * Form model bound to the template.
   * Default:
   *  - status: '' → no status selected initially
   */
  draft: NewOrderDraft = {
    code: '',
    status: '',
    customerName: '',
    total: 0,
  };

  /** Flag to indicate a save operation is in progress */
  saving = false;

  /** Error message shown in the template if something goes wrong */
  error: string | null = null;

  /**
   * Status options for the dropdown.
   * These MUST match the backend enum:
   *   NEW, PROCESSING, PAID, SHIPPED, CANCELLED
   *
   * The placeholder ("no selection") is handled separately in the template.
   */
  statusOptions: OrderStatus[] = [
    'NEW',
    'PROCESSING',
    'PAID',
    'SHIPPED',
    'CANCELLED',
  ];

  constructor(
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  /**
   * Submit handler:
   *  - Validates required fields (code + customerName)
   *  - Builds a payload compatible with the backend DTO
   *  - Calls OrderService.create(...)
   *  - Navigates back to /orders on success
   */
  onSubmit(): void {
    // Very basic validation (can be improved later with Angular validation)
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

    // Only include status if the user actually chose something
    if (this.draft.status !== '') {
      payload.status = this.draft.status;
    }

    this.orderService.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/orders']);
      },
      error: (err: unknown) => {
        console.error('Failed to create order', err);
        this.error = 'Failed to create order. Please try again.';
        this.saving = false;
      },
    });
  }

  /**
   * Cancel handler:
   *  - Simply navigates back to the orders list.
   */
  onCancel(): void {
    this.router.navigate(['/orders']);
  }
}