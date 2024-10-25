import { Component, OnInit, Input } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `<canvas id="barChart"></canvas>`,
  styleUrls: ['./lead-analytics.component.css'],
})
export class BarChartComponent implements OnInit {
  @Input() data!: { labels: string[]; values: number[] }; // Accept data from parent

  constructor() {
    Chart.register(...registerables); // Register chart.js components
  }

  ngOnInit(): void {
    this.createBarChart(); // Create the chart on initialization
  }

  createBarChart(): void {
    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: this.data.labels, // Use labels from the input data
        datasets: [{
          label: 'Sales',
          data: this.data.values, // Use values from the input data
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctx, config);
  }
}
