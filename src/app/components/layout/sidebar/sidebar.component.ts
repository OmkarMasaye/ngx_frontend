import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  activeItem: string | null = null;
  activeVisItem: string| null = null;
  constructor(private router: Router){}
  isExploreDataOpen = false;
  isVisualizeDataOpen: boolean = false;
  private routerSubscription: Subscription | undefined;

  toggleExploreData(): void {
    this.isExploreDataOpen = !this.isExploreDataOpen;
    // Optional: Close other dropdown when opening this one
    if (this.isExploreDataOpen) {
      this.isVisualizeDataOpen = false;
    }
  }

  toggleVisualizeData(): void {
    this.isVisualizeDataOpen = !this.isVisualizeDataOpen;
    // Optional: Close other dropdown when opening this one
    if (this.isVisualizeDataOpen) {
      this.isExploreDataOpen = false;
    }
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      if (this.isSidebarOpen && window.innerWidth <= 768) {
        this.toggleSidebar.emit();
      }
    });
    this.toggleExploreData();
    this.navigateToData('loan'); // Navigate to Tata on initialization
  }
  
  navigateToData(dataName: string): void {
    this.router.navigate(['/layout/viewdata', dataName]);
    this.activeItem = dataName;
  }

  navigateToVisualize(item: string) {
    
    this.router.navigate(['/layout/visualizedata', item]);
    this.activeVisItem = item;
    // Add your visualization navigation logic here
  }
}
