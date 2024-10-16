import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';  // Correct route import
import { appConfig } from './app/app.config';  // Import appConfig
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule , NbLayoutModule} from '@nebular/theme'; // Import NbThemeModule

// Merge appConfig with routing configuration
bootstrapApplication(AppComponent, {
  ...appConfig,  // Spread existing appConfig
  providers: [
    provideRouter(routes),  // Add routing providers here
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'default' }) ,// Configure the default theme
      NbLayoutModule,
      // NbLayoutModule.forRoot(),  
    ),
    ...(appConfig.providers || [])  // Include other providers from appConfig
  ]
}).catch(err => console.error(err));
