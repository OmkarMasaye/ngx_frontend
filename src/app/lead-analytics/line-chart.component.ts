import { Component, OnInit, Input } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `<canvas id="lineChart"></canvas>`,
  styleUrls: ['./lead-analytics.component.css'],
})
export class LineChartComponent implements OnInit {
  @Input() data!: { labels: string[]; values: number[] }; // Accept data from parent

  constructor() {
    Chart.register(...registerables); // Register chart.js components
  }

  ngOnInit(): void {
    this.createLineChart(); // Create the chart on initialization
  }

  createLineChart(): void {
    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: this.data.labels, // Use labels from the input data
        datasets: [{
          label: 'Revenue',
          data: this.data.values, // Use values from the input data
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: false,
          tension: 0.1
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
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    new Chart(ctx, config);
  }
}
