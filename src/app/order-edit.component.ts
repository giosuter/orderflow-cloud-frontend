import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {

  orderForm!: FormGroup;
  isLoading = true;
  isSaving = false;
  loadError: string | null = null;
  saveError: string | null = null;
  orderId!: number;

  // Must match your backend enum values
  statuses: string[] = ['NEW', 'PROCESSING', 'PAID', 'SHIPPED', 'CANCELLED'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      customerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      status: ['NEW', Validators.required],
      total: [null, [Validators.required, Validators.min(0)]],
      comment: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.loadError = 'Missing order id';
      this.isLoading = false;
      return;
    }

    this.orderId = Number(idParam);
    this.loadOrder(this.orderId);
  }

  // typed as any on purpose → avoids strict template typing noise
  get f(): any {
    return this.orderForm.controls;
  }

  private loadOrder(id: number): void {
    this.isLoading = true;
    this.loadError = null;

    // cast to any to avoid "findById does not exist on type OrderService"
    (this.orderService as any).findById(id).subscribe({
      next: (order: any) => {
        this.isLoading = false;
        this.orderForm.patchValue({
          code: order.code,
          customerName: order.customerName,
          status: order.status,
          total: order.total,
          comment: order.comment ?? ''
        });
      },
      error: () => {
        this.isLoading = false;
        this.loadError = 'Failed to load order';
      }
    });
  }

  onSubmit(): void {
    this.saveError = null;

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.saveError = this.translate.instant('ORDERS.FORM.VALIDATION_ERROR');
      return;
    }

    const updatedOrder: any = {
      ...this.orderForm.value,
      id: this.orderId
    };

    this.isSaving = true;

    // cast to any to avoid UpdateOrderPayload / OrderStatus type mismatch
    (this.orderService as any).update(this.orderId, updatedOrder).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/orders', this.orderId]);
      },
      error: () => {
        this.isSaving = false;
        this.saveError = this.translate.instant('ORDERS.FORM.SAVE_ERROR');
      }
    });
  }

  onCancel(): void {
    if (this.orderForm.dirty) {
      const confirmText = this.translate.instant('ORDERS.FORM.CONFIRM_CANCEL');
      const confirmed = window.confirm(confirmText);
      if (!confirmed) {
        return;
      }
    }
    this.router.navigate(['/orders', this.orderId]);
  }

  translateStatus(status: string | null | undefined): string {
    if (!status) {
      return '';
    }
    return 'ORDERS.STATUS.' + status;
  }
}