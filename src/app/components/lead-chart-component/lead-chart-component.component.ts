import { Component, OnInit } from '@angular/core';
import { LeadDataService } from '../../services/lead-data-service.service';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common'; // For *ngIf
import { FormsModule } from '@angular/forms'; // For ngModel
import { ChartConfiguration, ChartOptions } from 'chart.js'; // For chartOptions typing
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
    this.fetchModelUserCounts();
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
  
  
  


  formatISTDate(date: Date | null): string | null {
    if (!date) return null;
    const istOffset = 5.5 * 60; // IST offset in minutes
    const localDate = new Date(date.getTime() + istOffset * 60 * 1000);
    localDate.setUTCHours(0, 0, 0, 0); // Set to midnight IST
    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  modelSelectedDateRange: string = 'today';
  modelCustomStartDate: string | null = null;
  modelCustomEndDate: string | null = null;
  modelChartData: any = {
    labels: ['Kushaq', 'Slavia', 'Kodiaq'],
    datasets: []
  };
  modelChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Users'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Model'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `Users: ${value}`;
          }
        }
      }
    }
  };

  private dataName = 'skoda';
  onModelDateRangeChange(): void {
    if (this.modelSelectedDateRange !== 'custom') {
      this.modelCustomStartDate = null;
      this.modelCustomEndDate = null;
      this.fetchModelUserCounts();
    }
  }

  fetchModelUserCounts(): void {
    if (this.modelSelectedDateRange === 'custom' && (!this.modelCustomStartDate || !this.modelCustomEndDate)) {
      console.log('Waiting for both custom dates to be set');
      return;
    }
  
    // Validate custom dates for 'custom' range
    let formattedStartDate: string | null = null;
    let formattedEndDate: string | null = null;
  
    if (this.modelSelectedDateRange === 'custom') {
      if (!this.modelCustomStartDate || !this.modelCustomEndDate) {
        console.error('Invalid custom dates');
        return;
      }
      const startDate = new Date(this.modelCustomStartDate);
      const endDate = new Date(this.modelCustomEndDate);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date format for custom dates');
        return;
      }
      formattedStartDate = this.leadDataService.formatISTDate(startDate);
      formattedEndDate = this.leadDataService.formatISTDate(endDate);
    }
  
    this.leadDataService
      .getModelUserCounts(this.dataName, this.modelSelectedDateRange, formattedStartDate, formattedEndDate)
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.modelChartData = {
              labels: response.data.labels, // ['Kushaq', 'Slavia', 'Kodiaq']
              datasets: [
                {
                  label: 'Model User Counts',
                  data: response.data.counts,
                  backgroundColor: ['#5AA454', '#A10A28', '#C7B42C'],
                  borderColor: ['#4A8A44', '#910A18', '#B7A41C'],
                  borderWidth: 1,
                },
              ],
            };
          }
        },
        error: (error) => {
          console.error('Error fetching model user counts:', error);
        },
      });
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

 
