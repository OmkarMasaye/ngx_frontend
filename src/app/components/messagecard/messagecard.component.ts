import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-messagecard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messagecard.component.html',
  styleUrl: './messagecard.component.css'
})
export class MessagecardComponent {
  @Input() message: string = '';
  @Input() isVisible: boolean = false;
  @Output() okClicked: EventEmitter<void> = new EventEmitter<void>(); // Changed from close to okClicked

  closeCard(): void {
    this.okClicked.emit(); // Emit okClicked event
  }
}
