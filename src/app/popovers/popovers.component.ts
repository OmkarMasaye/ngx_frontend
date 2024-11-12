import { Component } from '@angular/core';
import { NgxPopoverTabsComponent, NgxPopoverFormComponent, NgxPopoverCardComponent } from './popovers-example.component';
import { NbCardModule, NbTabsetModule, NbPopoverModule, NbButtonModule, NbThemeModule, NbLayoutModule, NbActionsModule } from '@nebular/theme';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-popovers',
  standalone: true,
  imports: [
    // Nebular Modules
    NbLayoutModule,      // For layout components
    NbActionsModule,     // For actions like buttons, icons, etc.
    NbCardModule,
    NbTabsetModule,
    NbPopoverModule,
    NbButtonModule,
    NbThemeModule,
    RouterLink,
    RouterOutlet,
    RouterModule, // Directly importing without .forRoot()
    
    // Your custom components
    NgxPopoverTabsComponent,
    NgxPopoverFormComponent,
    NgxPopoverCardComponent,
    LayoutComponent
  ],
  templateUrl: './popovers.component.html',
  styleUrls: ['./popovers.component.css'],
})
export class PopoversComponent {
  tabsComponent = NgxPopoverTabsComponent;
  formComponent = NgxPopoverFormComponent;
  cardComponent = NgxPopoverCardComponent;
}
