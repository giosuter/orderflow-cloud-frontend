import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { OrderService } from './order.service';
import { Order } from './order.model';

type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  // full dataset from backend (because backend currently returns an array)
  private allOrders: Order[] = [];

  // what the table displays (current page slice)
  orders: Order[] = [];

  q = '';
  page = 0; // 0-based
  size = 10;

  totalElements = 0;
  totalPages = 0;

  sortBy: keyof Order | 'customerName' | 'createdAt' | 'status' | 'total' | 'code' | 'id' = 'id';
  sortDir: SortDir = 'desc';

  loading = false;

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    const safePage = Number.isFinite(page) && page >= 0 ? page : 0;
    this.page = safePage;

    this.loading = true;

    // Backend currently returns an array even when page/size are passed.
    // So we fetch the array and paginate in the UI.
    this.orderService
      .list(0, 1000000, String(this.sortBy), this.sortDir)
      .subscribe({
        next: (data: Order[]) => {
          this.allOrders = Array.isArray(data) ? data : [];

          // optional: quick client-side filter by q (code/customer/status)
          const filtered = this.applyFilter(this.allOrders, this.q);

          // client-side sort (keeps your sort header working)
          const sorted = this.applySort(filtered, this.sortBy, this.sortDir);

          this.totalElements = sorted.length;
          this.totalPages = Math.max(1, Math.ceil(this.totalElements / this.size));

          // clamp page if needed
          if (this.page > this.totalPages - 1) {
            this.page = this.totalPages - 1;
          }
          if (this.page < 0) {
            this.page = 0;
          }

          const start = this.page * this.size;
          const end = start + this.size;

          this.orders = sorted.slice(start, end);
        },
        error: (err: unknown) => {
          console.error('Failed to load orders', err);
          this.allOrders = [];
          this.orders = [];
          this.totalElements = 0;
          this.totalPages = 0;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  setSort(field: any): void {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = 'asc';
    }
    this.loadPage(0);
  }

  goToFirstPage(): void {
    this.loadPage(0);
  }

  goToPreviousPage(): void {
    this.loadPage(this.page - 1);
  }

  goToNextPage(): void {
    this.loadPage(this.page + 1);
  }

  goToLastPage(): void {
    this.loadPage(this.totalPages - 1);
  }

  editOrder(id: number): void {
    this.router.navigate(['/orders', id, 'edit']);
  }

  deleteOrder(id: number): void {
    if (!confirm(`Delete order #${id}?`)) return;

    this.loading = true;
    this.orderService.delete(id).subscribe({
      next: () => this.loadPage(this.page),
      error: (err: unknown) => {
        console.error('Delete failed', err);
        this.loading = false;
      },
    });
  }

  // UI helpers
  formatMoney(value: any): string {
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';
    return n.toFixed(2);
  }

  formatDate(value: any): string {
    if (!value) return '-';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return '-';
      return d.toLocaleString();
    } catch {
      return '-';
    }
  }

  isCancelled(o: Order): boolean {
    return String((o as any).status || '').toUpperCase() === 'CANCELLED';
  }
  isPaid(o: Order): boolean {
    return String((o as any).status || '').toUpperCase() === 'PAID';
  }
  isShipped(o: Order): boolean {
    return String((o as any).status || '').toUpperCase() === 'SHIPPED';
  }
  isNew(o: Order): boolean {
    return String((o as any).status || '').toUpperCase() === 'NEW';
  }

  private applyFilter(items: Order[], q: string): Order[] {
    const s = (q || '').trim().toLowerCase();
    if (!s) return items;

    return items.filter((o) => {
      const code = String((o as any).code ?? '').toLowerCase();
      const customer = String((o as any).customerName ?? '').toLowerCase();
      const status = String((o as any).status ?? '').toLowerCase();
      return code.includes(s) || customer.includes(s) || status.includes(s);
    });
  }

  private applySort(items: Order[], sortBy: any, sortDir: SortDir): Order[] {
    const dir = sortDir === 'asc' ? 1 : -1;

    const getVal = (o: any) => {
      const v = o?.[sortBy];
      if (v === null || v === undefined) return '';
      return v;
    };

    return [...items].sort((a: any, b: any) => {
      const va = getVal(a);
      const vb = getVal(b);

      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;

      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return -1 * dir;
      if (sa > sb) return 1 * dir;
      return 0;
    });
  }
}