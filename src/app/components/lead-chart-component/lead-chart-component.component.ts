import { Component, OnInit } from '@angular/core';
import { LeadDataService } from '../../services/lead-data-service.service';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common'; // For *ngIf
import { FormsModule } from '@angular/forms'; // For ngModel
import { ChartConfiguration } from 'chart.js'; // For chartOptions typing
import { HttpClient } from '@angular/common/http';

import { Color, NgxChartsModule, ScaleType ,LegendPosition} from '@swimlane/ngx-charts';
interface ChartLabel {
  label: string;
  value: number;
}
@Component({
  selector: 'ngx-lead-chart',
  standalone: true,
  imports: [
    NbLayoutModule,
    NgxChartsModule,
    NbCardModule,
    // NgxChartsModule,
    NgChartsModule,
    CommonModule, // Added for *ngIf
    FormsModule, // Added for ngModel
  ],
  templateUrl:'./lead-chart-component.component.html',
  styleUrl:'./lead-chart-component.component.css'
})
export class LeadChartComponent implements OnInit {
  chartData: any = { labels: [], datasets: [] };

  
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const index = context.dataIndex;
            const percentage = this.chartData.datasets[0].percentageChanges[index];
            return `${value} (${percentage > 0 ? '+' : ''}${percentage}%)`;
          },
        },
      },
    },
  };

  selectedDateRange: string = 'thisWeek';
  customStartDate: Date | null = null; // Changed to Date type for input binding
  customEndDate: Date | null = null; // Changed to Date type for input binding

  constructor(private leadDataService: LeadDataService,private http: HttpClient) {}

  ngOnInit() {
    this.loadChartData();
    this.fetchModelPopularity();
    this.loadchartData();
    
  }

  onDateRangeChange() {
    if (this.selectedDateRange !== 'custom') {
      this.customStartDate = null;
      this.customEndDate = null;
      this.loadChartData(); 
      
    }
    // For 'custom', wait for user to input dates
  }


  
  loadChartData() {
    if (this.selectedDateRange === 'custom' && (!this.customStartDate || !this.customEndDate)) {
      console.log('Waiting for both custom dates to be set');
      return;
    }
  
    const formattedStartDate = this.customStartDate
      ? this.leadDataService.formatISTDate(new Date(this.customStartDate))
      : null;
    const formattedEndDate = this.customEndDate
      ? this.leadDataService.formatISTDate(new Date(this.customEndDate))
      : null;
  
    this.leadDataService
      .getLeadData('skoda', this.selectedDateRange, formattedStartDate, formattedEndDate)
      .subscribe({
        next: (response: any) => {
          const responseLabels = response.data.labels; // Mon, Tue...
          const responseCounts = response.data.counts;
          const responseChanges = response.data.changes;
  
          // Use default full week
          const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
          // Map the response data for quick lookup
          const countMap = new Map<string, number>();
          const changeMap = new Map<string, number>();
  
          responseLabels.forEach((day: string, index: number) => {
            countMap.set(day, responseCounts[index]);
            changeMap.set(day, responseChanges[index]);
          });
  
          // Build chartData using full week, even if data missing
          this.chartData = {
            labels: weekDays,
            datasets: [
              {
                label: 'Leads',
                data: weekDays.map(day => countMap.get(day) ?? 0),
                backgroundColor: weekDays.map(day =>
                  (changeMap.get(day) ?? 0) >= 0 ? '#ff6384' : '#36a2eb'
                ),
                borderColor: '#fff',
                borderWidth: 1,
                percentageChanges: weekDays.map(day => changeMap.get(day) ?? 0),
              },
            ],
          };
        },
        error: (error) => {
          console.error('Error fetching lead data:', error);
        },
      });
  }
  
  
  charrtData: any[] = [];
  view: [number, number] = [400, 400]; // [width, height]

  // ngx-charts options for pie chart
  labels = true;          // Show labels on the pie slices (corrected from showLabels)
  explodeSlices = false;  // Whether to explode the slices
  doughnut = false;       // Set to true if you want a doughnut chart
  gradient = false;       // Apply gradient to the chart
  legend = true;          // Show the legend (corrected from showLegend)
  legendTitle = 'Models'; // Title for the legend
  
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C'] // Colors for each slice
  };



  fetchModelPopularity(): void {
    this.http.get<any[]>('http://localhost:5000/model-popularity') // Replace with your API URL
      .subscribe(
        (data) => {
          console.log(data);
          this.charrtData = this.transformToPercentage(data);
        },
        (error) => {
          console.error('Error fetching model popularity:', error);
        }
      );
  }

  // Transform raw data into percentage format
  transformToPercentage(data: any[]): any[] {
    const total = data.reduce((sum, item) => sum + item.value, 0); // Calculate total value
    return data.map(item => ({
      name: item.name,
      value: total > 0 ? Math.round((item.value / total) * 100) : 0 // Convert to percentage
    }));
  }
  
  selecteddateRange: string = 'thisWeek';
  customstartDate: Date | null = null; // Changed to Date type for input binding
  customendDate: Date | null = null;
  chartdata: any = { labels: [], datasets: [] };
  ondateRangeChange() {
    if (this.selecteddateRange !== 'custom') {
      this.customstartDate = null;
      this.customendDate = null;
      this.loadchartData(); 
      
    }
    // For 'custom', wait for user to input dates
  }
  chartoptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Date (IST)' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Leads' },
      },
    },
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true },
    },
  };

  loadchartData() {
    if (this.selecteddateRange === 'custom' && (!this.customstartDate || !this.customendDate)) {
      console.log('Waiting for both custom dates to be set');
      return;
    }

    const formattedStartDate = this.customstartDate
      ? this.leadDataService.formatiSTDate(new Date(this.customstartDate))
      : null;
    const formattedEndDate = this.customendDate
      ? this.leadDataService.formatiSTDate(new Date(this.customendDate))
      : null;

    this.leadDataService
      .getLeadsOverTime('skoda', this.selecteddateRange, formattedStartDate, formattedEndDate)
      .subscribe({
        next: (response: any) => {
          this.chartdata = {
            labels: response.labels,
            datasets: [
              {
                label: 'Leads',
                data: response.counts,
                borderColor: '#ff6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true, // For area chart effect
                tension: 0.4, // Smooth line
              },
            ],
          };
        },
        error: (error) => {
          console.error('Error fetching leads over time:', error);
        },
      });
  }
}

 
