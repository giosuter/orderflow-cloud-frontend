import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

/**
 * OrderEditComponent
 *
 * Edit an existing order.
 * - Reads :id from the route.
 * - Loads the order from the backend.
 * - Allows the user to change fields and save.
 */
@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
})
export class OrderEditComponent {
  /** ID of the order being edited (from route) */
  orderId!: number;

  /**
   * Draft object bound to the form.
   * Matches the payload we send to update(...) on the service.
   */
  draft: {
    code: string;
    status: '' | OrderStatus;
    customerName: string;
    total: number | null;
  } = {
    code: '',
    status: '',
    customerName: '',
    total: 0,
  };

  /** UI state flags */
  loading = true;
  saving = false;
  error: string | null = null;

  /** Status select options (adapt to your real enum values) */
  statusOptions: ('' | OrderStatus)[] = ['', 'NEW', 'PAID', 'CANCELLED'];

  private routeSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    // Subscribe to route params to get the order ID
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : NaN;

      if (!idParam || Number.isNaN(id)) {
        this.error = 'Invalid order ID.';
        this.loading = false;
        return;
      }

      this.orderId = id;
      this.loadOrder(id);
    });
  }

  /**
   * Load the existing order from the backend and fill the form.
   */
  private loadOrder(id: number): void {
    this.loading = true;
    this.error = null;

    this.orderService.getById(id).subscribe({
      next: (order) => {
        // Fill draft with existing values
        this.draft = {
          code: order.code ?? '',
          status: (order.status ?? '') as '' | OrderStatus,
          customerName: order.customerName ?? '',
          total: order.total ?? 0,
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order for edit', err);
        this.error = 'Failed to load order.';
        this.loading = false;
      },
    });
  }

  /**
   * Save changes to the backend via OrderService.update(...)
   */
  onSubmit(): void {
    if (!this.draft.code || !this.draft.customerName) {
      this.error = 'Code and customer name are required.';
      return;
    }

    this.saving = true;
    this.error = null;

    const payload: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      code: this.draft.code,
      // If status is empty string, send undefined -> backend can treat as "no status"
      status: this.draft.status || undefined,
      customerName: this.draft.customerName,
      total: this.draft.total ?? 0,
    };

    this.orderService.update(this.orderId, payload).subscribe({
      next: () => {
        this.saving = false;
        // Go back to the detail page for the order
        this.router.navigate(['/orders', this.orderId]);
      },
      error: (err) => {
        console.error('Failed to update order', err);
        this.error = 'Failed to update order. Please try again.';
        this.saving = false;
      },
    });
  }

  /**
   * Cancel editing and go back to the order detail page.
   */
  onCancel(): void {
    this.router.navigate(['/orders', this.orderId]);
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}