import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

/**
 * Unit tests for the root AppComponent.
 *
 * We import RouterTestingModule so that:
 *  - routerLink / routerLinkActive / router-outlet
 *    directives have all required providers (Router, ActivatedRoute, etc.).
 *
 * We keep the tests simple:
 *  - app gets created
 *  - title property has the expected value
 *  - template contains a <router-outlet>
 */
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // For standalone components, we list AppComponent in imports.
      imports: [RouterTestingModule, AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have the 'orderflow-cloud-frontend' title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as AppComponent;
    expect(app.title).toEqual('orderflow-cloud-frontend');
  });

  it('should contain a router-outlet in the template', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});