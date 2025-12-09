// OrderEditComponent
//
// Edit an existing order:
//  - Loads the order by ID from the route param (:id)
//  - Copies values into a "draft" object
//  - Saves changes via OrderService.update(...)

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
import { OrderService, UpdateOrderPayload } from './order.service';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
})
export class OrderEditComponent implements OnInit, OnDestroy {
  /** The original loaded order, used for ID + createdAt/updatedAt display */
  order: Order | null = null;

  /**
   * Editable "draft" object.
   *
   * We mirror the editable fields from the backend:
   *  - code: string
   *  - status?: OrderStatus
   *  - customerName?: string
   *  - total?: number
   */
  draft: {
    code: string;
    status?: OrderStatus;
    customerName?: string;
    total?: number;
  } = {
    code: '',
    status: undefined,
    customerName: '',
    total: 0,
  };

  loading = true;
  saving = false;
  error: string | null = null;

  /** Options for the status dropdown */
  statusOptions: OrderStatus[] = ['NEW', 'PAID', 'CANCELLED'];

  private routeSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly orderService: OrderService,
  ) {}

  ngOnInit(): void {
    // Subscribe to route params and load order
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

  private loadOrder(id: number): void {
    this.loading = true;
    this.error = null;

    this.orderService.getById(id).subscribe({
      next: (ord) => {
        this.order = ord;

        // Fill the editable draft from the loaded order
        this.draft = {
          code: ord.code,
          status: ord.status,
          customerName: ord.customerName ?? '',
          total: ord.total ?? 0,
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order', err);
        this.error = 'Failed to load order.';
        this.loading = false;
      },
    });
  }

  onSave(): void {
    if (!this.order) {
      this.error = 'No order loaded.';
      return;
    }

    // Simple validation: required fields
    if (!this.draft.code || !this.draft.customerName) {
      this.error = 'Code and customer name are required.';
      return;
    }

    this.saving = true;
    this.error = null;

    const id = this.order.id;

    // Build the payload expected by OrderService.update(...)
    const payload: UpdateOrderPayload = {
      code: this.draft.code,
      customerName: this.draft.customerName ?? '',
      total: this.draft.total ?? 0,
    };

    if (this.draft.status) {
      payload.status = this.draft.status;
    }

    this.orderService.update(id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/orders', id]);
      },
      error: (err) => {
        console.error('Failed to update order', err);
        this.error = 'Failed to update order. Please try again.';
        this.saving = false;
      },
    });
  }

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