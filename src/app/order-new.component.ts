// src/app/order-new.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * OrderNewComponent
 *
 * Placeholder page for creating a new order.
 * For now, it just shows a heading and some info text.
 * In a later step we will add a real form here.
 */
@Component({
  standalone: true,
  selector: 'app-order-new',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss'],
})
export class OrderNewComponent {}