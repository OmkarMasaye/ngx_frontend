import { Component, Input } from '@angular/core'; // Ensure Input is imported
import { NewsPost } from '../news.service'; // Correctly import the NewsPost type
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule], // Keep this for ngFor, ngIf, etc.
  templateUrl: './new-post.component.html',
  // styleUrl: './new-post.component.css' // Ensure the file exists at this location
})
export class NewPostComponent {
  @Input() post!: NewsPost;  // Use non-null assertion operator
}
