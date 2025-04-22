import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

import { authGuard } from './auth.guard';
import { LoginnComponent } from './components/loginn/loginn.component';
import { OneColumnLayoutComponent } from './components/one-column-layout/one-column-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginnComponent },
  
  {
    path: 'lay',
    component: OneColumnLayoutComponent,
    canActivate: [authGuard],
    children:[
      {
        path: 'viewdata/:dataName',
        loadComponent: () => import('./components/viewdata/viewdata.component').then(m => m.ViewdataComponent)
      },{
        path: 'visualizedata/skoda',
        loadComponent: () => import('./components/lead-chart-component/lead-chart-component.component').then(m => m.LeadChartComponent)
      },
      {
        path: 'visualizedata/loan',
        loadComponent: () => import('./components/bar/bar.component').then(m => m.BarComponent)
      },

      
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
