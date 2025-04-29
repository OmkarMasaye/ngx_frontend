import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
interface DashboardData {
  totalLeads: number;
  modelDistribution: { [key: string]: number };
  status: { Approved: number; Pending: number; Rejected: number };
  geographicDistribution: { [key: string]: number };
  recentActivity: { name: string; model: string; city: string; state: string; dealer_details: string; reason: string; status: string; time: string }[];
}

@Component({
  selector: 'app-skodadashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skodadashboard.component.html',
  styleUrl: './skodadashboard.component.css'
})
export class SkodadashboardComponent {
  dashboardData: DashboardData = {
    totalLeads: 0,
    modelDistribution: {},
    status: { Approved: 0, Pending: 0, Rejected: 0 },
    geographicDistribution: {},
    recentActivity: []
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.http.get<DashboardData>('http://localhost:5000/api/skoda-dashboard').subscribe(
      (data: DashboardData) => {
        this.dashboardData = data;
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
  }
}