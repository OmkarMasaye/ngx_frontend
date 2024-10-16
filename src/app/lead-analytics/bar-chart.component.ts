import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `<canvas id="barChart"></canvas>`,
  styleUrls: ['./lead-analytics.component.css'],
})
export class BarChartComponent implements OnInit {
  @Input() data!: { labels: string[], values: number[] };

  ngOnInit(): void {
    this.createBarChart();
  }

  constructor() {
    Chart.register(...registerables);
  }

  createBarChart(): void {
    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
          label: 'Sales',
          data: this.data.values, // Use dynamic data
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
