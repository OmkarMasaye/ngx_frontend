// import * as Papa from 'papaparse'
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lead-processing',
  standalone: true,
  imports: [NbLayoutModule, NbCardModule, MatTableModule, MatButtonModule, MatSortModule, MatPaginator],
  templateUrl: './lead-processing.component.html',
  styleUrls: ['./lead-processing.component.css'],
})
export class LeadProcessingComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'email', 'age', 'actions'];
  dataSource = new MatTableDataSource<any>();
  sortDirection: 'asc' | 'desc' = 'asc';

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchLeads();

    // Uncomment this to test with hardcoded data
    // this.dataSource.data = [
    //   { firstName: 'John', lastName: 'Doe', userName: 'jdoe', email: 'jdoe@example.com', age: 25, _id: '1', userId: 'u1' },
    //   { firstName: 'Jane', lastName: 'Doe', userName: 'jadoe', email: 'jadoe@example.com', age: 28, _id: '2', userId: 'u2' }
    // ];
    // console.log('Hardcoded Table Data:', this.dataSource.data);
  }

  fetchLeads(): void {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!token) {
      console.error('No token found, user might not be authenticated.');
      this.router.navigate(['/login']); // Redirect to login if no token
      return;
    }

    // Decode the token to retrieve the user's role (optional if you use it for the API switch)
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userRole = tokenPayload.role; // Assuming the role is stored in the 'role' field

    // Define the API URL based on user role
    const apiUrl = userRole === 'admin' ? 'http://localhost:5000/api/leads' : 'http://localhost:5000/api/leads/me';

    this.http.get<any[]>(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}` // Include the token in the request headers
      }
    })
      .subscribe(
        (data) => {
          console.log('Fetched Leads:', data);

          // Normalize the response to always be an array
          if (!Array.isArray(data)) {
            data = [data]; // Wrap single object in an array
          }

          this.dataSource.data = data; // Set the data to the data source

          // Log the table data to check if it's assigned correctly
          console.log('Table Data:', this.dataSource.data);

          // Set paginator and sort after data is loaded
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          // Detect changes to refresh the UI
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching leads:', error);
        }
      );
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  sortByAge(): void {
    const sortedData = this.dataSource.data.slice().sort((a, b) => {
      return this.sortDirection === 'asc' ? a.age - b.age : b.age - a.age;
    });

    this.dataSource.data = sortedData;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  onDeleteConfirm(id: string): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.dataSource.data = this.dataSource.data.filter((item: any) => item._id !== id);
    }
  }

  onUserClick(userId: string): void {
    if (userId) {
      this.router.navigate(['/lead-analytics', userId]);
    }
  }
}
