import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NbThemeModule } from '@nebular/theme';
export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(NbThemeModule.forRoot({name: 'default'})),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
