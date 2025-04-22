import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule, NbLayoutModule, NbChatModule, NbMenuModule, NbSidebarModule } from '@nebular/theme';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { NbEvaIconsModule } from '@nebular/eva-icons';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,  // ✅ Correct way to import HttpClientModule
      NbThemeModule.forRoot({ name: 'default' }),
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot(),
      NbLayoutModule,
      NbChatModule,
      NbEvaIconsModule
    ),
    ...(appConfig.providers || []),

    provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
