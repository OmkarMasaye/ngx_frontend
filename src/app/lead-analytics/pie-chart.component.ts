import { Component, OnInit, Input } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  template: `<canvas id="pieChart"></canvas>`,
  styleUrls: ['./lead-analytics.component.css'],
})
export class PieChartComponent implements OnInit {
  @Input() data!: { labels: string[]; values: number[]; colors: string[]; borderColors: string[] }; // Accept data from parent

  constructor() {
    Chart.register(...registerables); // Register chart.js components
  }

  ngOnInit(): void {
    this.createPieChart(); // Create the chart on initialization
  }

  createPieChart(): void {
    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: {
        labels: this.data.labels, // Use labels from the input data
        datasets: [{
          label: 'Votes',
          data: this.data.values, // Use values from the input data
          backgroundColor: this.data.colors, // Use background colors from the input data
          borderColor: this.data.borderColors, // Use border colors from the input data
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true
      }
    };
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    new Chart(ctx, config);
  }
}
