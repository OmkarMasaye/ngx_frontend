import { Routes } from '@angular/router';
import { LeadAnalyticsComponent } from './lead-analytics/lead-analytics.component';
import { LeadProcessingComponent } from './lead-processing/lead-processing.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { AuthGuard } from './auth/auth.guard';  // Import your AuthGuard

export const routes: Routes = [
  { path: 'lead-analytics/:id', component: LeadAnalyticsComponent}, // not Protected for now  canActivate: [AuthGuard] 
  { path: 'lead-processing', component: LeadProcessingComponent},  // not Protected for now
  { path: 'login', component: LoginSignupComponent },  // No guard for login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
