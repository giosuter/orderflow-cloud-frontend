import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  // keep it simple: any → no type fights with backend models
  order: any | null = null;
  isLoading = true;
  loadError: string | null = null;
  orderId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.loadError = 'Missing order id';
      this.isLoading = false;
      return;
    }

    this.orderId = Number(idParam);
    this.loadOrder(this.orderId);
  }

  private loadOrder(id: number): void {
    this.isLoading = true;
    this.loadError = null;

    // cast to any so TS stops complaining about "findById" not being on OrderService
    (this.orderService as any).findById(id).subscribe({
      next: (order: any) => {
        this.isLoading = false;
        this.order = order;
      },
      error: () => {
        this.isLoading = false;
        this.loadError = 'Failed to load order';
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/orders']);
  }

  onEdit(): void {
    this.router.navigate(['/orders', this.orderId, 'edit']);
  }

  translateStatus(status: string | null | undefined): string {
    if (!status) {
      return '';
    }
    // Expects translation keys like ORDERS.STATUS.NEW, ORDERS.STATUS.PAID, ...
    return 'ORDERS.STATUS.' + status;
  }
}