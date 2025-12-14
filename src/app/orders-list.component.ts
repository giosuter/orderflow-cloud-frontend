// Path: src/app/orders-list.component.ts
//
// OrdersListComponent
// - Uses the paged backend endpoint (OrdersPageResponse)
// - Provides pagination controls
// - Uses ngx-translate for labels
//
// IMPORTANT behavior fix:
// Angular may reuse this component instance when navigating back from
// /orders/:id or /orders/:id/edit. In that case ngOnInit() might NOT re-run,
// so the list would still show stale data.
// We therefore listen to Router NavigationEnd events and reload the current page
// whenever we land on "/orders".
//
// IMPORTANT template compatibility:
// Your HTML currently calls goToFirstPage/goToPreviousPage/goToNextPage/goToLastPage
// and reads hasPreviousPage/hasNextPage/fromIndex/toIndex.
// We provide these methods/properties so the template compiles.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, filter } from 'rxjs';

import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';
import { OrdersPageResponse } from './orders-page-response.model';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];

  loading = false;
  error: string | null = null;

  // Your filter input in HTML uses [(ngModel)]="filterCode" and [(ngModel)]="filterStatus"
  // Keep those names to match the template.
  filterCode = '';
  filterStatus: '' | OrderStatus = '';

  statusOptions: OrderStatus[] = [
    'NEW',
    'PROCESSING',
    'PAID',
    'SHIPPED',
    'CANCELLED',
  ];

  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;

  private routerSub?: Subscription;

  constructor(
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPage(0);

    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects || e.url;
        if (url === '/orders' || url.startsWith('/orders?')) {
          this.loadPage(this.page);
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  loadPage(page: number): void {
    this.loading = true;
    this.error = null;

    const term =
      this.filterCode.trim() === '' ? null : this.filterCode.trim();
    const status =
      this.filterStatus === '' ? null : this.filterStatus;

    this.orderService.searchPaged(term, status, page, this.size).subscribe({
      next: (res: OrdersPageResponse) => {
        this.orders = res.content;
        this.page = res.page;
        this.size = res.size;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load orders page', err);
        this.error = 'Failed to load orders.';
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    this.loadPage(0);
  }

  onResetFilters(): void {
    this.filterCode = '';
    this.filterStatus = '';
    this.loadPage(0);
  }

  onCreate(): void {
    this.router.navigate(['/orders/new']);
  }

  onView(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }

  onEdit(order: Order): void {
    this.router.navigate(['/orders', order.id, 'edit']);
  }

  onDelete(order: Order): void {
    const confirmed = window.confirm(
      `Do you really want to delete order "${order.code}"?`,
    );
    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.orderService.delete(order.id).subscribe({
      next: () => this.loadPage(this.page),
      error: (err: unknown) => {
        console.error('Failed to delete order', err);
        this.error = 'Failed to delete order.';
        this.loading = false;
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Template compatibility (your HTML expects these)
  // ---------------------------------------------------------------------------

  get hasPreviousPage(): boolean {
    return !this.loading && this.page > 0;
  }

  get hasNextPage(): boolean {
    return !this.loading && this.page < this.totalPages - 1;
  }

  get fromIndex(): number {
    if (this.totalElements === 0) {
      return 0;
    }
    return this.page * this.size + 1;
  }

  get toIndex(): number {
    const raw = (this.page * this.size) + this.orders.length;
    return Math.min(raw, this.totalElements);
  }

  goToFirstPage(): void {
    if (this.hasPreviousPage) {
      this.loadPage(0);
    }
  }

  goToPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.loadPage(this.page - 1);
    }
  }

  goToNextPage(): void {
    if (this.hasNextPage) {
      this.loadPage(this.page + 1);
    }
  }

  goToLastPage(): void {
    if (this.hasNextPage && this.totalPages > 0) {
      this.loadPage(this.totalPages - 1);
    }
  }

    /**
   * Template compatibility:
   * Older template uses `filteredOrders`.
   * With server-side paging, the "current page slice" is `orders`.
   */
  get filteredOrders(): Order[] {
    return this.orders;
  }
}