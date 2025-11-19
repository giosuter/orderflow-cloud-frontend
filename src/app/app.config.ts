// Application-wide providers for Angular 19 standalone setup.
// We enable:
//   • Routing support
//   • HttpClient (required for calling the OrderFlow API)
//   • Standard browser animations
//
// NOTE: This file remains deliberately small.
//       All feature-specific providers belong to feature modules/components.

import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Enables router functionality for the entire application.
     * Routes are defined in app.routes.ts.
     */
    provideRouter(routes),

    /**
     * Use the modern HttpClient based on the Fetch API.
     * This avoids CORS preflight issues and integrates well with backend APIs.
     */
    provideHttpClient(withFetch()),

    /**
     * Enables Angular animations (optional but recommended).
     * Many UI components rely on this by default.
     */
    provideAnimations(),
  ],
};