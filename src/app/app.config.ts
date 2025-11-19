// Global Angular application configuration.
// This is used by main.ts via bootstrapApplication(..., appConfig).
//
// Responsibilities:
//   • Register the Angular Router with our app routes
//   • Register HttpClient so services like OrderService can call the backend

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router with our route definitions
    provideRouter(routes),

    // HttpClient with DI-based interceptors (future-proof)
    provideHttpClient(withInterceptorsFromDi()),
  ],
};