import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { LineChartComponent } from './line-chart.component';
import { PieChartComponent } from './pie-chart.component';
import { RadarChartComponent } from './radar-chart.component';
import { BarChartComponent } from './bar-chart.component';
import { CommonModule } from '@angular/common';

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
    BarChartComponent
  ],
  templateUrl: './lead-analytics.component.html',
  styleUrls: ['./lead-analytics.component.css'],
})
export class LeadAnalyticsComponent implements OnInit {
  userId: string =''; // Keep userId as a string
  lineChartData!: { labels: string[], values: number[] };
  pieChartData!: { labels: string[], values: number[], colors: string[], borderColors: string[] };
  radarChartData!: { labels: string[], values: number[] };
  barChartData!: { labels: string[], values: number[] };

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Get the userId from the route as a string
    this.userId = this.route.snapshot.paramMap.get('id')!; // Ensure this fetches correctly
    if (!this.userId) {
      console.error('User ID is undefined or invalid');
      return;
    }
    this.fetchChartData();
  }

  fetchChartData(): void {
    // Fetching data using userId as a string
    this.http.get(`http://localhost:5000/api/chartdata/${this.userId}`).subscribe(
      (data: any) => {
        console.log('Fetching chart data for userId:', this.userId);
        // Ensure the fetched data exists before assigning
        if (data) {
          if (data.chartData) { // Adjusted to ensure you are accessing the right structure
            if (data.chartData.lineData) {
              this.lineChartData = { 
                labels: data.chartData.lineData.labels || [], 
                values: data.chartData.lineData.values || [] 
              };
            }
            if (data.chartData.pieData) {
              this.pieChartData = { 
                labels: data.chartData.pieData.labels || [], 
                values: data.chartData.pieData.values || [], 
                colors: data.chartData.pieData.colors || [], 
                borderColors: data.chartData.pieData.borderColors || [] 
              };
            }
            if (data.chartData.radarData) {
              this.radarChartData = { 
                labels: data.chartData.radarData.labels || [], 
                values: data.chartData.radarData.values || [] 
              };
            }
            if (data.chartData.barData) {
              this.barChartData = { 
                labels: data.chartData.barData.labels || [], 
                values: data.chartData.barData.values || [] 
              };
            }
            this.updateCharts();  // Call the chart update function
          } else {
            console.error('Chart data not found in the response');
          }
        } else {
          console.error('Fetched data is undefined');
        }
      },
      (error) => {
        console.error('Error fetching chart data:', error);
      }
    );
  }

  updateCharts(): void {
    // Here you can pass the fetched data to the child components (charts)
    // Pass data to chart components via Input properties
  }
}