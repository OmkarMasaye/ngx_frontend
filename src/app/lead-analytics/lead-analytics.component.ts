import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { LineChartComponent } from './line-chart.component';
import { PieChartComponent } from './pie-chart.component';
import { RadarChartComponent } from './radar-chart.component';
import { BarChartComponent } from './bar-chart.component';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-lead-analytics',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    RouterOutlet,
    CommonModule,
    NbCardModule,
    NbLayoutModule,
    LineChartComponent,
    PieChartComponent,
    RadarChartComponent,
    BarChartComponent,
    LayoutComponent
  ],
  templateUrl: './lead-analytics.component.html',
  styleUrls: ['./lead-analytics.component.css'],
})
export class LeadAnalyticsComponent implements OnInit {
  userId!: string; // User ID from route params
  lineChartData!: { labels: string[], values: number[] };
  pieChartData!: { labels: string[], values: number[], colors: string[], borderColors: string[] };
  radarChartData!: { labels: string[], values: number[] };
  barChartData!: { labels: string[], values: number[] };

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      console.log('User ID from route:', this.userId); // Should log the correct userId
      if (this.userId) {
        this.fetchChartData(this.userId);
      } else {
        console.error('User ID is undefined, cannot fetch chart data');
      }
    });
  }
  
  

  fetchChartData(userId: string): void { // Accept userId as a parameter
    console.log(`Fetching chart data for user ID: ${userId}`); // Log userId
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found, user might not be authenticated.');
    return;
  }

    this.http.get(`http://localhost:5000/api/chartdata/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
      
    }).subscribe(
      (data: any) => {
        console.log('API response:', data);

        if (data) {
          // Ensure the data from the API is assigned correctly
          this.lineChartData = {
            labels: data.lineData.labels || [],
            values: data.lineData.values || []
          };

          this.pieChartData = {
            labels: data.pieData.labels || [],
            values: data.pieData.values || [],
            colors: data.pieData.colors || [],
            borderColors: data.pieData.borderColors || []
          };

          this.radarChartData = {
            labels: data.radarData.labels || [],
            values: data.radarData.values || []
          };

          this.barChartData = {
            labels: data.barData.labels || [],
            values: data.barData.values || []
          };
        } else {
          console.error('Chart data not found in the response');
        }
      },
      (error) => {
        console.error('Error fetching chart data:', error);
      }
    );
  }
}
