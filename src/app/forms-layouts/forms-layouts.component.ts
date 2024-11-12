import { Component } from '@angular/core';
import { NbActionsModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbLayoutModule, NbRadioModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';
@Component({
  selector: 'app-forms-layouts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbCheckboxModule,
    NbRadioModule,
    NbActionsModule,
    NbIconModule,
    NbLayoutModule,
    LayoutComponent
  ],
  templateUrl: './forms-layouts.component.html',
  styleUrl: './forms-layouts.component.css'
})
export class FormsLayoutsComponent {

}
