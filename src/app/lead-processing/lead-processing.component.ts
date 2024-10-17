import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NbCardModule } from '@nebular/theme';
import * as Papa from 'papaparse';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router'; // Ensure Router is imported

@Component({
  selector: 'app-lead-processing',
  standalone: true,
  imports: [NbCardModule, MatTableModule, MatButtonModule, RouterLink],
  templateUrl: './lead-processing.component.html',
  styleUrls: ['./lead-processing.component.css'],
})
export class LeadProcessingComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'age', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(private http: HttpClient, private router: Router) {}  // Inject the Router here

  ngOnInit(): void {
    this.fetchLeads();
  }

  fetchLeads(): void {
    this.http.get<any[]>('http://localhost:5000/api/leads')
      .subscribe(
        (data) => {
          console.log('Leads:', data);
          this.dataSource.data = data;
        },
        (error) => {
          console.error('Error fetching leads:', error);
        }
      );
  }

  onUserClick(userId: number): void {
    console.log('Navigating with User ID:', userId);
    if (userId) {
      this.router.navigate(['/lead-analytics', userId]);
    } else {
      console.error('User ID is undefined');
    }
  }
  
  

  onDeleteConfirm(id: number): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.dataSource.data = this.dataSource.data.filter((item: any) => item.id !== id);
    }
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        console.log(result.data);
      }
    });
  }
}
