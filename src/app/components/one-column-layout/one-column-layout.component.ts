import { Component, OnInit } from '@angular/core';
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
export class OneColumnLayoutComponent implements OnInit {
  isExploreDataOpen = false;
  isVisualizeDataOpen = false;
  isDashboardOpen = true; // Set to true to expand Dashboard by default

  activeItem: string | null = null;
  activeVisItem: string | null = null;

  menuItems: NbMenuItem[] = [];

  private allMenuItems: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      expanded: this.isDashboardOpen,
      children: [
        { title: 'Skoda', link: '/lay/dashboard/skoda', data: 'skoda' },
        { title: 'Loan', link: '/lay/dashboard/loan', data: 'loan' }
      ]
    },
    {
      title: 'Explore Data',
      icon: 'bar-chart-outline',
      expanded: this.isExploreDataOpen,
      children: [
        { title: 'Skoda', link: '/lay/viewdata/skoda', data: 'skoda' },
        { title: 'Loan', link: '/lay/viewdata/loan', data: 'loan' }
      ]
    },
    {
      title: 'Visualize Data',
      icon: 'bar-chart-outline',
      expanded: this.isVisualizeDataOpen,
      children: [
        { title: 'Skoda', link: '/lay/visualizedata/skoda', data: 'skoda' },
        { title: 'Loan', link: '/lay/visualizedata/loan', data: 'loan' }
      ]
    },
    {
      title: 'Users',
      icon: 'people-outline',
      link: '/lay/users'
    }
  ];
  displayText: string | null = null;
  username: any;

  constructor(private sidebarService: NbSidebarService, private router: Router) {}

  ngOnInit() {
    this.initializeMenuItems();
    this.loadUserInfo()
    // Navigate to Skoda Dashboard on initial load
    if (!this.router.url.includes('/lay/dashboard')) {
      this.router.navigate(['/lay/dashboard/skoda']);
    }
    this.activeItem = 'skoda'; // Set Skoda as active item
  }

  private initializeMenuItems() {
    const userRole = localStorage.getItem('role');
    const isMasterAdmin = userRole === 'master-admin';

    this.menuItems = this.allMenuItems.filter(item => {
      if (item.title === 'Users') {
        return isMasterAdmin;
      }
      return true;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  toggleExploreData() {
    this.isExploreDataOpen = !this.isExploreDataOpen;
    this.updateMenuItems();
  }

  toggleVisualizeData() {
    this.isVisualizeDataOpen = !this.isVisualizeDataOpen;
    this.updateMenuItems();
  }

  toggleDashboard() {
    this.isDashboardOpen = !this.isDashboardOpen;
    this.updateMenuItems();
  }

  private updateMenuItems() {
    this.menuItems = this.menuItems.map(item => {
      if (item.title === 'Explore Data') {
        return { ...item, expanded: this.isExploreDataOpen };
      }
      if (item.title === 'Visualize Data') {
        return { ...item, expanded: this.isVisualizeDataOpen };
      }
      if (item.title === 'Dashboard') {
        return { ...item, expanded: this.isDashboardOpen };
      }
      return item;
    });
  }

  navigateToData(dataName: string): void {
    this.router.navigate(['/lay/viewdata', dataName]);
    this.activeItem = dataName;
  }

  navigateToVisualize(item: string): void {
    this.router.navigate(['/lay/visualizedata', item]);
    this.activeVisItem = item;
  }

  navigateToDashboard(item: string): void {
    this.router.navigate(['/lay/dashboard', item]);
    this.activeItem = item;
  }

  onMenuItemClick(item: any) {
    const menuItem = item as NbMenuItem;
    if (menuItem.title === 'Explore Data' && menuItem.children) {
      this.toggleExploreData();
    } else if (menuItem.title === 'Visualize Data' && menuItem.children) {
      this.toggleVisualizeData();
    } else if (menuItem.title === 'Dashboard' && menuItem.children) {
      this.toggleDashboard();
    } else if (menuItem.data) {
      if (menuItem.link?.includes('viewdata')) {
        this.navigateToData(menuItem.data);
      } else if (menuItem.link?.includes('visualizedata')) {
        this.navigateToVisualize(menuItem.data);
      } else if (menuItem.link?.includes('dashboard')) {
        this.navigateToDashboard(menuItem.data);
      }
    }
  }
  loadUserInfo() {
    const storedUsername = localStorage.getItem('name');
    
  
    this.username = storedUsername || 'User';
  
   
  
    this.displayText = `${this.username}`;
  }

}