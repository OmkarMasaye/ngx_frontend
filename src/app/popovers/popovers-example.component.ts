import { Component } from '@angular/core';
import { NbCardModule, NbTabsetModule, NbPopoverModule, NbButtonModule, NbThemeModule } from '@nebular/theme'; // Import the necessary Nebular modules

// Popover Tabs Component
@Component({
  selector: 'ngx-popover-tabs',
  standalone: true,
  imports: [NbTabsetModule],  // Only include NbTabsetModule here
  template: `
    <nb-tabset>
      <nb-tab tabTitle="What's up?">
        <div class="p-4">
          Such a wonderful day!
        </div>
      </nb-tab>
      <nb-tab tabTitle="Second Tab">
        <div class="p-4">
          Indeed!
        </div>
      </nb-tab>
    </nb-tabset>
  `,
})
export class NgxPopoverTabsComponent {}

// Popover Form Component
@Component({
  selector: 'ngx-popover-form',
  standalone: true,
  imports: [NbButtonModule],  // Import necessary modules for the form component
  template: `
    <div class="p-4">
      <form>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Recipients" />
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Subject" />
        </div>
        <div class="form-group">
          <textarea class="form-control" placeholder="Message"></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-100">Send</button>
      </form>
    </div>
  `,
})
export class NgxPopoverFormComponent {}

// Popover Card Component
@Component({
  selector: 'ngx-popover-card',
  standalone: true,
  imports: [NbCardModule],  // Import necessary modules for the card component
  template: `
    <nb-card class="popover-card">
      <nb-card-header status="warning">
        Hello!
      </nb-card-header>
      <nb-card-body>
        Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,
        there live the blind texts.
        Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
      </nb-card-body>
    </nb-card>
  `,
  styles: [
    `
      .popover-card {
        margin: 0;
        max-width: 20rem;
      }
    `,
  ],
})
export class NgxPopoverCardComponent {}

