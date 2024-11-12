import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-new-post-placeholder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-post-placeholder.component.html',
  styleUrls: ['./new-post-placeholder.component.css']
})
export class NewPostPlaceholderComponent {
  @HostBinding('attr.aria-label') label = 'Loading';
}
