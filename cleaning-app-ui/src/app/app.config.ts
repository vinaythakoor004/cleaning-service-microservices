import { ApplicationConfig, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {provideTranslateService, TranslateFakeLoader, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { isPlatformBrowser } from '@angular/common';

// const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient, platformId: Object) => {
//   // new TranslateHttpLoader(http, './i18n/', '.json');
//   if (isPlatformBrowser(platformId)) {
//     return new TranslateHttpLoader(http, './i18n/', '.json');
//   } else {
//     return new TranslateFakeLoader(); // Prevents real HTTP call during SSR
//   }
// }

export function HttpLoaderFactory(http: HttpClient, platformId: Object) {
  if (isPlatformBrowser(platformId)) {
    return new TranslateHttpLoader(http, './i18n/', '.json');
  } else {
    return new TranslateFakeLoader(); // Prevents real HTTP call during SSR
  }
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideHttpClient(),
    provideTranslateService({
       defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, PLATFORM_ID],
      },
    })
  ]
};
