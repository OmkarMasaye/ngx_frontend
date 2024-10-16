import { Component, OnInit, Input } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  template: `<canvas id="radarChart"></canvas>`,
  styleUrls: ['./lead-analytics.component.css'],
})
export class RadarChartComponent implements OnInit {
  @Input() data!: { labels: string[]; values: number[] }; // Accept data from parent

  constructor() {
    Chart.register(...registerables); // Register chart.js components
  }

  ngOnInit(): void {
    this.createRadarChart(); // Create the chart on initialization
  }

  createRadarChart(): void {
    const config: ChartConfiguration = {
      type: 'radar' as ChartType,
      data: {
        labels: this.data.labels, // Use labels from the input data
        datasets: [{
          label: 'Activity',
          data: this.data.values, // Use values from the input data
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: { beginAtZero: true }
        }
      }
    };
    const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
    new Chart(ctx, config);
  }
}
