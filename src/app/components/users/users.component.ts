import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: any[] = [];
  isMasterAdmin: boolean = false;
  searchQuery: string = '';

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
    this.checkMasterAdmin();
  }

  loadUsers(search: string = '') {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.userService.getUsers(headers, search).subscribe(
      (data) => {
        this.users = data;
      },
      (error) => console.error('Error loading users', error)
    );
  }

  checkMasterAdmin() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      this.isMasterAdmin = decoded && decoded.role === 'master-admin';
    }
  }

  decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  onSearch() {
    this.loadUsers(this.searchQuery);
  }

  resetSearch() {
    this.searchQuery = '';
    this.loadUsers();
  }

  onRoleChange(event: Event, email: string) {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value;
    this.changeRole(email, newRole);
  }

  changeRole(email: string, newRole: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    if (this.isMasterAdmin) {
      this.userService.updateRole(email, newRole, headers).subscribe(
        () => {
          const user = this.users.find(u => u.email === email);
          if (user) user.usertype = newRole;
        },
        (error) => console.error('Error updating role', error)
      );
    }
  }
}