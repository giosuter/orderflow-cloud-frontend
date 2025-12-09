// Angular bootstrap file for OrderFlow Cloud frontend.
// - Standalone AppComponent + routes
// - @ngx-translate/core configured with a custom Http-based loader
//   that reads /assets/i18n/<lang>.json.
//
// This implementation matches the strict typings of ngx-translate
// (TranslateLoader -> getTranslation(): Observable<TranslationObject>).

import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import {
  TranslateLoader,
  TranslateModule,
  TranslationObject,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * JsonTranslateLoader
 *
 * Concrete implementation of TranslateLoader that:
 *   - Uses Angular HttpClient
 *   - Loads JSON files from /assets/i18n/<lang>.json
 */
export class JsonTranslateLoader implements TranslateLoader {
  constructor(private readonly http: HttpClient) {}

  /**
   * Load the translation object for a given language.
   *
   * Example for lang = 'en':
   *   GET /assets/i18n/en.json
   */
  getTranslation(lang: string): Observable<TranslationObject> {
    // IMPORTANT: backticks, not plain slashes
    return this.http.get<TranslationObject>(`/assets/i18n/${lang}.json`);
  }
}

/**
 * Factory used by ngx-translate to create the loader.
 */
export function httpLoaderFactory(http: HttpClient): TranslateLoader {
  return new JsonTranslateLoader(http);
}

bootstrapApplication(AppComponent, {
  providers: [
    // Router configuration
    provideRouter(routes),

    // HttpClient + TranslateModule configuration
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
  ],
}).catch((err) => console.error(err));