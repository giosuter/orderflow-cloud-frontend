// Root component for OrderFlow Cloud frontend.
// - Renders the top bar with navigation + language switch
// - Hosts the <router-outlet> for all pages
// - Integrates ngx-translate and allows EN/DE switching

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslateModule, // makes the | translate pipe available in the template
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   * Currently selected language for the UI.
   * Must match one of the languages registered with TranslateService.
   */
  currentLang: 'en' | 'de' = 'en';

  constructor(private readonly translate: TranslateService) {
    // Register supported languages
    this.translate.addLangs(['en', 'de']);

    // Default language
    this.translate.setDefaultLang('en');

    // Start with English
    this.translate.use(this.currentLang);
  }

  /**
   * Switch the active language, used by the buttons in app.component.html.
   */
  switchLang(lang: 'en' | 'de'): void {
    if (this.currentLang === lang) {
      return; // Nothing to do
    }

    this.currentLang = lang;
    this.translate.use(lang);
  }
}