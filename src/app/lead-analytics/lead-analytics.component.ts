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
  userId!: number;
  lineChartData!: { labels: string[], values: number[] }; // Data for Line Chart
  pieChartData!: { labels: string[], values: number[], colors: string[], borderColors: string[] }; // Data for Pie Chart
  radarChartData!: { labels: string[], values: number[] }; // Data for Radar Chart
  barChartData!: { labels: string[], values: number[] }; // Data for Bar Chart

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!; // Ensure this is correct
    if (!this.userId) {
      console.error('User ID is undefined or invalid');
      return; // Early return if userId is invalid
    }
    this.fetchChartData(); // Call the API to fetch data
  }

  fetchChartData(): void {
    // Fetch all the necessary data for the charts from the API
    this.http.get(`http://localhost:5000/api/chartdata/${this.userId}`).subscribe((data: any) => {
      this.lineChartData = { labels: data.lineData.labels, values: data.lineData.values };
      this.pieChartData = { 
        labels: data.pieData.labels, 
        values: data.pieData.values, 
        colors: data.pieData.colors, 
        borderColors: data.pieData.borderColors 
      };
      this.radarChartData = { labels: data.radarData.labels, values: data.radarData.values };
      this.barChartData = { labels: data.barData.labels, values: data.barData.values };

      // Update the charts with the fetched data
      this.updateCharts();
    }, (error) => {
      console.error('Error fetching chart data:', error);
    });
  }

  updateCharts(): void {
    // Here you can pass the fetched data to the child components (charts)
    // For example, you can use a service to communicate or directly pass data via Input properties
    // Since you have defined the inputs in your child components, you can assign the data like this:

    // This assumes you have template variables defined for your chart components in your template file.
    // Example:
    // <app-line-chart [userId]="userId" [data]="lineChartData"></app-line-chart>
    // <app-pie-chart [userId]="userId" [data]="pieChartData"></app-pie-chart>
    // <app-radar-chart [userId]="userId" [data]="radarChartData"></app-radar-chart>
    // <app-bar-chart [userId]="userId" [data]="barChartData"></app-bar-chart>
  }
}
