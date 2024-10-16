import { Routes } from '@angular/router';
import { LeadAnalyticsComponent } from './lead-analytics/lead-analytics.component';
import { LeadProcessingComponent } from './lead-processing/lead-processing.component';

export const routes: Routes = [
  { path: 'lead-analytics/:id', component: LeadAnalyticsComponent },
  { path: 'lead-processing', component: LeadProcessingComponent },
  { path: '', redirectTo: 'lead-processing', pathMatch: 'full' },  // Default route
];
