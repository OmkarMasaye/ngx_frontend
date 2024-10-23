import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';  // Import your route configuration
import { appConfig } from './app/app.config';  // Import appConfig
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';  // Import animations
import { HTTP_INTERCEPTORS } from '@angular/common/http';  // For interceptors
import { AuthInterceptor } from './app/auth/auth.interceptor';  // Import your AuthInterceptor
import { AuthGuard } from './app/auth/auth.guard';  // Import your AuthGuard

// Merge appConfig with routing configuration
bootstrapApplication(AppComponent, {
  ...appConfig,  // Spread existing appConfig
  providers: [
    provideRouter(routes),  // Add routing providers here
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'default' }),  // Configure the default theme
      NbLayoutModule
    ),
    ...(appConfig.providers || []),  // Include other providers from appConfig
    
    // Register the AuthInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
    // Add the AuthGuard if needed (typically set in routes)
    // Note: AuthGuard does not need to be provided here if used directly in the route definitions.
    
    provideAnimationsAsync(),  // Add animations provider
  ]
}).catch(err => console.error(err));
