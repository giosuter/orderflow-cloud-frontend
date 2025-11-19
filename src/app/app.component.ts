import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root shell component.
 *
 * - Contains a simple header
 * - Hosts the Angular router via <router-outlet>
 * - All feature views (e.g. OrdersListComponent) are displayed inside
 *   the <main> element.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Keep a title for potential use in the browser tab or tests.
  title = 'orderflow-cloud-frontend';
}