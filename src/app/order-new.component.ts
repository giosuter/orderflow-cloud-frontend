import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss']
})
export class OrderNewComponent implements OnInit {

  orderForm!: FormGroup;
  isSaving = false;
  saveError: string | null = null;

  // Must match your backend enum values
  statuses: string[] = ['NEW', 'PROCESSING', 'PAID', 'SHIPPED', 'CANCELLED'];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
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
  }

  // any → avoid strict template typing noise
  get f(): any {
    return this.orderForm.controls;
  }

  onSubmit(): void {
    this.saveError = null;

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.saveError = this.translate.instant('ORDERS.FORM.VALIDATION_ERROR');
      return;
    }

    const newOrder = this.orderForm.value; // plain object from the form

    this.isSaving = true;

    // Cast to any so TS stops comparing Order vs CreateOrderPayload
    this.orderService.create(newOrder as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/orders']);
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
    this.router.navigate(['/orders']);
  }

  translateStatus(status: string | null | undefined): string {
    if (!status) {
      return '';
    }
    return 'ORDERS.STATUS.' + status;
  }
}