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
 * OrderEditComponent
 *
 * Edit an existing order:
 *  - Loads the order by ID from the route param (:id)
 *  - Copies values into a "draft" object
 *  - Saves changes via OrderService.update(...)
 */
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
   * This must match Omit<Order, 'id' | 'createdAt' | 'updatedAt'>:
   *  - code: string (required)
   *  - status?: OrderStatus
   *  - customerName?: string
   *  - total?: number
   */
  draft: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
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

    // Simple validation
    if (!this.draft.code || !this.draft.customerName) {
      this.error = 'Code and customer name are required.';
      return;
    }

    this.saving = true;
    this.error = null;

    const id = this.order.id;

    // Send ALL editable fields, including customerName
    const payload: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      code: this.draft.code,
      status: this.draft.status,
      customerName: this.draft.customerName ?? '',
      total: this.draft.total ?? 0,
    };

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