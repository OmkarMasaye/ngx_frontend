import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { LeadDataService } from '../../services/lead-data-service.service';
import { ChartConfiguration } from 'chart.js';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import * as L from 'leaflet';
@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [  NbLayoutModule,
      NgxChartsModule,
      NbCardModule,
      // NgxChartsModule,
      NgChartsModule,
      CommonModule, // Added for *ngIf
      FormsModule,],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.css'
})
export class BarComponent {
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
      this.loadchartData();
      this.loaddChartData();
      
      
      
    }
  
    onDateRangeChange() {
      if (this.selectedDateRange !== 'custom') {
        this.customStartDate = null;
        this.customEndDate = null;
        this.loadChartData(); // Call immediately for predefined ranges
      }
      // For 'custom', wait for user to input dates
    }
  
    loadChartData() {
      // If custom range is selected, ensure both dates are provided
      if (this.selectedDateRange === 'custom' && (!this.customStartDate || !this.customEndDate)) {
        console.log('Waiting for both custom dates to be set');
        return; // Do not proceed until both dates are set
      }
  
      const formattedStartDate = this.customStartDate
        ? this.leadDataService.formatISTDate(new Date(this.customStartDate))
        : null;
      const formattedEndDate = this.customEndDate
        ? this.leadDataService.formatISTDate(new Date(this.customEndDate))
        : null;
  
      console.log('Fetching data with:', {
        selectedDateRange: this.selectedDateRange,
        formattedStartDate,
        formattedEndDate,
      });
  
      this.leadDataService
        .getLeadData('loan', this.selectedDateRange, formattedStartDate, formattedEndDate)
        .subscribe({
          next: (response: any) => {
            this.chartData = {
              labels: response.data.labels,
              datasets: [
                {
                  label: 'Leads',
                  data: response.data.counts,
                  backgroundColor: response.data.counts.map((_: any, index: number) =>
                    response.data.changes[index] >= 0 ? '#ff6384' : '#36a2eb'
                  ),
                  borderColor: '#fff',
                  borderWidth: 1,
                  percentageChanges: response.data.changes,
                },
              ],
            };
          },
          error: (error) => {
            console.error('Error fetching lead data:', error);
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
      .getleadsOverTime('loan', this.selecteddateRange, formattedStartDate, formattedEndDate)
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

  charttData: any = { labels: [], datasets: [] };
  charttOptions: ChartConfiguration['options'] = {
    responsive: true,
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
          text: 'Credit Score Ranges'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
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

  selecteddateeRange: string = 'today';
  customstarttDate: Date | null = null;
  customenddDate: Date | null = null;

  

  

  onDateeChange(): void {
    if (this.selecteddateeRange !== 'custom') {
      this.customstarttDate = null;
      this.customenddDate = null;
      this.loaddChartData();
    }
  }

  loaddChartData(): void {
    if (this.selecteddateeRange === 'custom' && (!this.customstarttDate || !this.customendDate)) {
      console.log('Waiting for both custom dates to be set');
      return;
    }
    const formattedStartDate = this.customstarttDate
      ? this.leadDataService.formatISTDate(new Date(this.customstarttDate))
      : null;
    const formattedEndDate = this.customenddDate
      ? this.leadDataService.formatISTDate(new Date(this.customenddDate))
      : null;

    this.leadDataService.getCreditDistribution('loan', this.selecteddateeRange, formattedStartDate, formattedEndDate).subscribe({
      next: (response: any) => {
        this.charttData = {
          labels: response.data.labels, // ['300-500', '501-700', '701-850']
          datasets: [
            {
              label: 'Credit Score Distribution',
              data: response.data.counts,
              backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
              borderColor: '#fff',
              borderWidth: 1
            }
          ]
        };
      },
      error: (error) => {
        console.error('Error fetching credit distribution:', error);
      }
    });
  }
  
}