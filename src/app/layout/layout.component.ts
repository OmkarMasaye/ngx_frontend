import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; 
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MatIconModule, MatMenuModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  username = 'John Doe'; 
  initials = this.getInitials(this.username);
  isCompact = false; 
  currentRoute: string = '';
  userId: string | null = null; 

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url; 
      }
    });
    
    this.userId = localStorage.getItem('userId'); 
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkWindowSize();
  }

  checkWindowSize() {
    this.isCompact = window.innerWidth <= 768;
  }

  isActive(route: string): boolean {
    return this.currentRoute === route || 
           (route.includes(':id') && this.currentRoute.startsWith(route.split(':')[0]));
  }
}
