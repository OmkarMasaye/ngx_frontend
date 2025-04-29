import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
interface DashboardData {
  totalApplications: number;
  totalApplicationsChange: number;
  averageCreditScore: number;
  averageCreditScoreChange: number;
  status: { Approved: number; Pending: number; Rejected: number };
  geographicDistribution: { [key: string]: number };
  recentActivity: { name: string; email: string; date: string }[];
}
@Component({
  selector: 'app-loandashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loandashboard.component.html',
  styleUrl: './loandashboard.component.css'
})
export class LoandashboardComponent {
  dashboardData: DashboardData = {
    totalApplications: 0,
    totalApplicationsChange: 0,
    averageCreditScore: 0,
    averageCreditScoreChange: 0,
    status: { Approved: 0, Pending: 0, Rejected: 0 },
    geographicDistribution: {},
    recentActivity: []
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.http.get<DashboardData>('http://localhost:5000/api/dashboard').subscribe(
      (data: DashboardData) => {
        this.dashboardData = data;
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
  }
}