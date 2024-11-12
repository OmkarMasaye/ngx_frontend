import { Routes } from '@angular/router';
import { LeadAnalyticsComponent } from './lead-analytics/lead-analytics.component';
import { LeadProcessingComponent } from './lead-processing/lead-processing.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { AuthGuard } from './auth/auth.guard';  // Import your AuthGuard
import { LayoutComponent } from './layout/layout.component';
import { PopoversComponent } from './popovers/popovers.component';
import { FormsLayoutsComponent } from './forms-layouts/forms-layouts.component';
import { ChatComponent } from './chat/chat.component';
import { InfiniteListComponent } from './infinite-list/infinite-list.component';
import { StepperComponent } from './stepper/stepper.component';

export const routes: Routes = [
  { path: 'lead-analytics/:id', component: LeadAnalyticsComponent}, // not Protected for now  canActivate: [AuthGuard] 
  { path: 'lead-processing', component: LeadProcessingComponent},  // not Protected for now
  { path: 'login', component: LoginSignupComponent },  // No guard for login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'layout', component: LayoutComponent},
  {path: 'popovers', component: PopoversComponent},
  {path: 'forms' , component: FormsLayoutsComponent},
  {path: 'chats', component: ChatComponent},
  {path : 'infinite-list', component: InfiniteListComponent},
  {path : 'stepper' ,component: StepperComponent}
];
