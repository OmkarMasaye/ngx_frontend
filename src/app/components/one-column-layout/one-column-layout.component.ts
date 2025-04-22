import { Component } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NbLayoutModule, NbSidebarModule, NbMenuModule, NbIconModule } from '@nebular/theme';

@Component({
  selector: 'app-one-column-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule,
    NbIconModule
  ],
  templateUrl: './one-column-layout.component.html',
  styleUrl: './one-column-layout.component.css'
})
export class OneColumnLayoutComponent {

  isExploreDataOpen = false;
  isVisualizeDataOpen = false;

  activeItem: string | null = null;
  activeVisItem: string | null = null;

  menuItems: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/dashboard',
      home: true
    },
    {
      title: 'Explore Data',
      icon: 'bar-chart-outline',
      expanded: this.isExploreDataOpen, // Bind to state
      children: [
        { title: 'Skoda', link: '/lay/viewdata/skoda', data: 'skoda' },
        { title: 'Loan', link: '/lay/viewdata/loan', data: 'loan' }
      ]
    },
    {
      title: 'Visualize Data',
      icon: 'bar-chart-outline',
      expanded: this.isVisualizeDataOpen, // Bind to state
      children: [
        { title: 'Skoda', link: '/lay/visualizedata/skoda', data: 'skoda' },
        { title: 'Loan', link: '/lay/visualizedata/loan', data: 'loan' }
      ]
    },
    {
      title: 'Users',
      icon: 'people-outline',
      link: '/users'
    },
    
    
  ];

  constructor(private sidebarService: NbSidebarService,private router:Router) {}

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  // Toggle Explore Data dropdown
  toggleExploreData() {
    this.isExploreDataOpen = !this.isExploreDataOpen;
    this.updateMenuItems();
  }

  // Toggle Visualize Data dropdown
  toggleVisualizeData() {
    this.isVisualizeDataOpen = !this.isVisualizeDataOpen;
    this.updateMenuItems();
  }

  // Update menu items to reflect dropdown state
  private updateMenuItems() {
    this.menuItems = this.menuItems.map(item => {
      if (item.title === 'Explore Data') {
        return { ...item, expanded: this.isExploreDataOpen };
      }
      if (item.title === 'Visualize Data') {
        return { ...item, expanded: this.isVisualizeDataOpen };
      }
      return item;
    });
  }

  // Navigate to Explore Data
  navigateToData(dataName: string): void {
    this.router.navigate(['/lay/viewdata', dataName]);
    this.activeItem = dataName;
  }

  // Navigate to Visualize Data
  navigateToVisualize(item: string): void {
    this.router.navigate(['/lay/visualizedata', item]);
    this.activeVisItem = item;
  }

  // Handle menu item click
  onMenuItemClick(item: any) {
    const menuItem = item as NbMenuItem;
    if (menuItem.title === 'Explore Data' && menuItem.children) {
      this.toggleExploreData();
    } else if (menuItem.title === 'Visualize Data' && menuItem.children) {
      this.toggleVisualizeData();
    } else if (menuItem.data) {
      if (menuItem.link?.includes('viewdata')) {
        this.navigateToData(menuItem.data);
      } else if (menuItem.link?.includes('visualizedata')) {
        this.navigateToVisualize(menuItem.data);
      }
    }
  }



}