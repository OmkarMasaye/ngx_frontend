import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild ,ViewEncapsulation} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule,MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { saveAs } from 'file-saver';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-viewdata',
  standalone: true,
  imports: [CommonModule,MatSelectModule,MatDialogModule,MatProgressSpinnerModule,MatDatepickerModule,MatNativeDateModule,  MatFormFieldModule, MatSortModule, MatInputModule, HttpClientModule, FormsModule, MatTableModule, MatPaginatorModule,MatButtonModule,MatIconModule],
  templateUrl: './viewdata.component.html',
  styleUrls: ['./viewdata.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ViewdataComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataName?: string;
  paginatedData = new MatTableDataSource<any>();
  loading=false;
  dialogRef: MatDialogRef<any> | null = null;

  
  // Search criteria and other variables
  searchCriteria: { [key: string]: { name: string; email: string; mobile: string | null; app_id: string | null } } = {
    skoda: { name: '', email: '', mobile: '', app_id: '' },
    tata: { name: '', email: '', mobile: '', app_id: '' },
    loan: { name: '', email: '', mobile: '', app_id: '' },
  };

  displayedColumns: string[] = [];
  sortBy: string = 'createdAt'; // Default sort field
  sortOrder: string = 'desc'; // Default sort order (descending)
  originalData: any[] = []; // Store original data

  searchName: string = '';
  searchEmail: string = '';
  searchMobile: string = '';
  searchAppId: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 20; // Default items per page
  totalRecords: number = 0;
  dropdownOpen = false;
  selectedFormat: 'json' | 'csv' | null = null;
  isDownloading=false;

  selectedDateRange: string = 'all';
  customStartDate: Date | null =null;
  customEndDate: Date | null = null;
  



  constructor(private route: ActivatedRoute, private http: HttpClient,private dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.dataName = params.get('dataName')!;
      if (this.dataName) {
        this.setSearchCriteriaForDataset(this.dataName);
        this.setDisplayedColumns(this.dataName);
        this.resetSort();
        this.loadData(1);
      }
    });
  }
  

  setDisplayedColumns(datasetName: string): void {
    if (datasetName === 'skoda') {
      this.displayedColumns = ['name', 'email', 'mobile', 'createdAt', 'modifiedAt'];
    } else {
      this.displayedColumns = ['name', 'email', 'mobile', 'data.credit_score','app_id', 'createdAt', 'updatedAt'];
    }
  }
  resetSort(): void {
    this.sortBy = ''; // Set to default sort field or empty if you don't want a default
    this.sortOrder = '';   // Set to default sort order or empty
    if (this.sort) {
      this.sort.active = '';
      this.sort.direction = '';
      this.sort.sortChange.emit(); // Emit the sort change event to update the UI
    }

    // Reset data in MatTableDataSource
    this.paginatedData.sort = this.sort;  // Optionally, reload data after resetting sort
  }





  // Method to apply date filter when dropdown changes
  applyDateFilter(): void {
    this.loading=true
    // If "All" is selected, clear any custom date range and reset page to 1
    if (this.selectedDateRange === 'all') {
      this.customStartDate = null;
      this.customEndDate = null;
      this.currentPage = 1;
      this.loadData(this.currentPage).finally(() => {
        this.loading = false; // Stop spinner after loading data
      });
      return; // No further filtering required
    }
  
    // For custom date range, check if dates are set
    if (this.selectedDateRange === 'custom') {
      if (!this.customStartDate || !this.customEndDate) {
        this.loading = false;
        return; // Do not apply filter if dates are incomplete
      }
    }
  
    // Reset to the first page and load data with the new filter
    this.currentPage = 1;
    this.loadData(this.currentPage).finally(() => {
      this.loading = false; // Hide spinner after data is loaded
    });
  }

  formatLocalDate(date: Date): string {
    // Create a new date object to avoid mutations
    const localDate = new Date(date);
  
    // Manually set the date to midnight local time
    localDate.setHours(0, 0, 0, 0); 
  
    // Use local date components to avoid time zone shifts
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = String(localDate.getDate()).padStart(2, '0'); // Ensure 2 digits for day
  
    // Return in 'YYYY-MM-DD' format
    return `${year}-${month}-${day}`;
  }
  


  ngAfterViewInit(): void {
    // Subscribe to sort change after view is initialized
    this.sort.sortChange.subscribe(() => {
      this.handleSort();
      
    });
  }

  loadData(page: number = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      if (this.dataName && token) {
        const headers = { Authorization: `Bearer ${token}` };
        const limit = this.itemsPerPage;
  
        const trimmedSearchName = this.searchName.trim();
        const trimmedSearchEmail = this.searchEmail.trim();
        const trimmedSearchMobile = this.searchMobile.trim();
        const trimmedSearchAppId = this.searchAppId.trim();
  
        const params: any = {
          page: page.toString(),
          limit: limit.toString(),
          name: trimmedSearchName,
          email: trimmedSearchEmail,
          mobile: trimmedSearchMobile,
          app_id: trimmedSearchAppId,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          dateRange: this.selectedDateRange
        };
        if (this.selectedDateRange === 'custom' && this.customStartDate && this.customEndDate) {
          params.customStartDate = this.formatLocalDate(this.customStartDate);
          params.customEndDate = this.formatLocalDate(this.customEndDate);
        }
  
        this.http.get<any>(`http://localhost:5000/viewdata/${this.dataName}`, { headers, params })
          .subscribe(
            (response) => {
              const { data, totalRecords } = response;
              this.originalData = data;
              this.paginatedData.data = data;
              this.totalRecords = totalRecords;
              resolve(); // Resolve the promise when done
            },
            (error) => {
              console.error('Failed to load data:', error);
              reject(error); // Reject the promise on error
            }
          );
      } else {
        resolve(); // Resolve immediately if no data or token
      }
    });
  }

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}
downloadCSV(): void {
  this.isDownloading = true;
  this.loading=true;
  const token = localStorage.getItem('token');
  if (this.dataName && token) {
      const headers = { Authorization: `Bearer ${token}` };
      const trimmedSearchName = this.searchName.trim();
      const trimmedSearchEmail = this.searchEmail.trim();
      const trimmedSearchMobile = this.searchMobile.trim();
      const trimmedSearchAppId = this.searchAppId.trim();

      const params: any = {
          name: trimmedSearchName,
          email: trimmedSearchEmail,
          mobile:trimmedSearchMobile,
          app_id:trimmedSearchAppId,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          dateRange: this.selectedDateRange
      };
      if (this.selectedDateRange === 'custom' && this.customStartDate && this.customEndDate) {
        params.customStartDate = this.formatLocalDate(this.customStartDate);
        params.customEndDate = this.formatLocalDate(this.customEndDate);
      }


      this.http
          .get(
              `http://localhost:5000/viewdata/${this.dataName}?format=csv`, 
              { headers, params, responseType: 'blob' }
          )
          .subscribe(
              (blob) => {
                  const fileName = `${this.dataName}.csv`;
                  saveAs(blob, fileName);
                  this.loading = false;
              },
              (error) => {
                  this.loading = false;
                  console.error('Failed to download CSV data:', error);
              }
          );
  } else {
      console.error('Data name or token is null or undefined, cannot download data');
  }
}


handleSort(): void {
  // Check if sorting has a direction (asc/desc); if so, update sortBy and sortOrder
  if (this.sort.direction) {
    this.sortBy = this.sort.active;
    this.sortOrder = this.sort.direction === 'desc' ? 'desc' : 'asc';
  } else {
    // Reset sortBy and sortOrder when no direction is selected
    this.sortBy = '';
    this.sortOrder = '';
    // Restore original data to remove sorting
    this.paginatedData.data = this.originalData;
  }

  // Always load data from the first page after sorting or resetting
  this.currentPage = 1;
  this.loadData(this.currentPage);
}



  

onSearch(): void {
  this.loading = true; // Show spinner
  this.saveSearchCriteriaForDataset();
  this.currentPage = 1;
  this.loadData(this.currentPage).finally(() => {
    this.loading = false; // Hide spinner after data is loaded
  });
}


  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.loadData(this.currentPage);
  }

  saveSearchCriteriaForDataset(): void {
    if (this.dataName) {
      this.searchCriteria[this.dataName] = {
        name: this.searchName.trim(),
        email: this.searchEmail.trim(),
        mobile: this.searchMobile ? this.searchMobile : null,
        app_id: this.searchAppId ? this.searchAppId : null,
      };
    }
  }

  setSearchCriteriaForDataset(datasetName: string): void {
    this.loading = true; // Show spinner
    const criteria = this.searchCriteria[datasetName] || { name: '', email: '', mobile: '', app_id: '' };
    this.searchName = criteria.name;
    this.searchEmail = criteria.email;
    this.searchMobile = criteria.mobile || '';
    this.searchAppId = criteria.app_id || '';
  
    this.selectedDateRange = 'all';
    this.customStartDate = null;
    this.customEndDate = null;
  
    this.loadData(1).finally(() => {
      this.loading = false; // Hide spinner after switching dataset and loading data
    });
  }
  


  showAll(): void {
    this.loading = true; // Show spinner
  this.searchName = '';
  this.searchEmail = '';
  this.searchMobile = '';
  this.searchAppId = ''; // Clear the search fields
  this.itemsPerPage = 10;
  this.currentPage = 1;
  this.saveSearchCriteriaForDataset(); // Save the cleared search criteria
  this.loadData(this.currentPage).finally(() => {
    this.loading = false; // Hide spinner after reset and data is loaded
  });
  }
}
