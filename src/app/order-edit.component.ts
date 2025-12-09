import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterModule,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

/**
 * 
 * Edit an existing order:
 *  - Loads the order by ID from the route param (:id)
 *  - Copies values into a "draft" object that is bound to the form
 *  - Saves changes via OrderService.update(id, payload)
 *
 * NOTE:
 *  We use Partial<Order> for the draft/payload so that TypeScript
 *  does not complain if some fields (like status) are temporarily
 *  missing/undefined while the user is editing.
 */
@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
})
export class OrderEditComponent implements OnInit, OnDestroy {
  /**
   * The original loaded order (read-only reference).
   * We keep it mainly for:
   *  - the technical id
   *  - possible display of createdAt / updatedAt in the template
   */
  order: Order | null = null;

  /**
   * Editable "draft" object bound to the form.
   *
   * We intentionally use Partial<Order> instead of
   * Omit<Order, 'id' | 'createdAt' | 'updatedAt'> because:
   *  - during form editing, some fields may be temporarily undefined
   *  - this avoids TypeScript errors related to required fields
   *  - the backend remains the source of truth for validation
   */
  draft: Partial<Order> = {
    code: '',
    status: 'NEW',       // default status in the form
    customerName: '',
    total: 0,
  };

  /** Loading state when fetching the order from the backend */
  loading = true;

  /** Saving state when sending the update to the backend */
  saving = false;

  /** Error message to display in the template, if any */
  error: string | null = null;

  /**
   * Options for the status dropdown.
   * These MUST match the backend enum:
   *   NEW, PROCESSING, PAID, SHIPPED, CANCELLED
   */
  statusOptions: OrderStatus[] = [
    'NEW',
    'PROCESSING',
    'PAID',
    'SHIPPED',
    'CANCELLED',
  ];

  /** Subscription to route parameters, so we can clean up on destroy */
  private routeSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly orderService: OrderService,
  ) {}

  ngOnInit(): void {
    // Subscribe to route params and load the order when :id changes
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

      this.loadOrder(id);
    });
  }

  /**
   * Load the order from the backend by ID,
   * then populate the editable draft.
   */
  private loadOrder(id: number): void {
    this.loading = true;
    this.error = null;

    this.orderService.getById(id).subscribe({
      next: (ord: Order) => {
        this.order = ord;

        // Fill the editable draft from the loaded order.
        // We use sensible defaults for optional fields.
        this.draft = {
          code: ord.code,
          status: ord.status ?? 'NEW',
          customerName: ord.customerName ?? '',
          total: ord.total ?? 0,
        };

        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load order', err);
        this.error = 'Failed to load order.';
        this.loading = false;
      },
    });
  }

  /**
   * Save button handler:
   *  - Performs minimal validation
   *  - Builds the payload (Partial<Order>)
   *  - Calls OrderService.update(id, payload)
   *  - Navigates back to the detail page on success
   */
  onSave(): void {
    if (!this.order) {
      this.error = 'No order loaded.';
      return;
    }

    // Simple form validation in the component.
    // You can enhance this later with proper Angular forms validation.
    if (!this.draft.code || !this.draft.customerName) {
      this.error = 'Code and customer name are required.';
      return;
    }

    this.saving = true;
    this.error = null;

    const id = this.order.id;

    // Build the payload to send to the backend.
    // Type is Partial<Order> so status may still be optional.
    const payload: Partial<Order> = {
      code: this.draft.code,
      status: this.draft.status,
      customerName: this.draft.customerName ?? '',
      total: this.draft.total ?? 0,
    };

    this.orderService.update(id, payload).subscribe({
      next: () => {
        this.saving = false;
        // Navigate back to the order detail view with the same ID
        this.router.navigate(['/orders', id]);
      },
      error: (err: unknown) => {
        console.error('Failed to update order', err);
        this.error = 'Failed to update order. Please try again.';
        this.saving = false;
      },
    });
  }

  /**
   * Cancel button handler:
   *  - If the order is loaded, go back to its detail view
   *  - Otherwise, go back to the orders list
   */
  onCancel(): void {
    if (this.order) {
      this.router.navigate(['/orders', this.order.id]);
    } else {
      this.router.navigate(['/orders']);
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}