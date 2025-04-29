import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-viewdata',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './viewdata.component.html',
  styleUrls: ['./viewdata.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewdataComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataName?: string;
  paginatedData = new MatTableDataSource<any>();
  loading = false;

  searchCriteria: { [key: string]: { name: string; email: string; mobile: string | null; app_id: string | null } } = {
    skoda: { name: '', email: '', mobile: '', app_id: '' },
    tata: { name: '', email: '', mobile: '', app_id: '' },
    loan: { name: '', email: '', mobile: '', app_id: '' }
  };

  displayedColumns: string[] = [];
  allColumns: { id: string; label: string; visible: boolean }[] = [];
  sortBy: string = 'createdAt';
  sortOrder: string = 'desc';
  originalData: any[] = [];

  searchName: string = '';
  searchEmail: string = '';
  searchMobile: string = '';
  searchAppId: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalRecords: number = 0;
  dropdownOpen = false;
  columnsDropdownOpen = false;
  isDownloading = false;

  selectedDateRange: string = 'all';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.dataName = params.get('dataName')!;
      if (this.dataName) {
        this.setSearchCriteriaForDataset(this.dataName);
        this.setDisplayedColumns(this.dataName);
        this.initializeColumns(this.dataName);
        this.loadColumnVisibility(); // Load saved visibility
        this.updateDisplayedColumns(); // Update displayed columns based on loaded visibility
        this.resetSort();
        this.loadData(1);
      }
    });
  }

  initializeColumns(datasetName: string): void {
    const columnDefinitions: { [key: string]: { id: string; label: string }[] } = {
      skoda: [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'mobile', label: 'Mobile' },
        { id: 'city', label: 'City' },
        { id: 'model', label: 'Model' },
        { id: 'dealer_details', label: 'Dealer Details' },
        { id: 'status', label: 'Status' },
        { id: 'createdAt', label: 'Created At' },
        { id: 'modifiedAt', label: 'Modified At' }
      ],
      tata: [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'mobile', label: 'Mobile' },
        { id: 'data.credit_score', label: 'Credit Score' },
        { id: 'app_id', label: 'App ID' },
        { id: 'createdAt', label: 'Created At' },
        { id: 'updatedAt', label: 'Updated At' }
      ],
      loan: [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'mobile', label: 'Mobile' },
        { id: 'data.credit_score', label: 'Credit Score' },
        { id: 'employment', label: 'Employment' },
        { id: 'salary', label: 'Salary' },
        { id: 'maritalStatus', label: 'Martial Status' },
        { id: 'gender', label: 'Gender' },
        { id: 'createdAt', label: 'Created At' },
        { id: 'updatedAt', label: 'Updated At' }
      ]
    };

    this.allColumns = columnDefinitions[datasetName].map(col => ({
      id: col.id,
      label: col.label,
      visible: this.displayedColumns.includes(col.id)
    }));
  }

  setDisplayedColumns(datasetName: string): void {
    if (datasetName === 'skoda') {
      this.displayedColumns = ['name', 'email', 'mobile', 'createdAt', 'modifiedAt'];
    } else {
      this.displayedColumns = ['name', 'email', 'mobile', 'data.credit_score', 'app_id', 'createdAt', 'updatedAt'];
    }
  }

  updateDisplayedColumns(): void {
    const visibleColumns = this.allColumns.filter(col => col.visible).map(col => col.id);
    if (visibleColumns.length === 0) {
      const nameColumn = this.allColumns.find(col => col.id === 'name');
      if (nameColumn) {
        nameColumn.visible = true;
        visibleColumns.push('name');
      }
    }
    this.displayedColumns = visibleColumns;
    this.saveColumnVisibility(); // Save visibility state to local storage
  }

  // Save column visibility to local storage
  saveColumnVisibility(): void {
    if (this.dataName) {
      const visibilityState = this.allColumns.reduce((acc, col) => {
        acc[col.id] = col.visible;
        return acc;
      }, {} as { [key: string]: boolean });
      localStorage.setItem(`columnVisibility_${this.dataName}`, JSON.stringify(visibilityState));
    }
  }

  // Load column visibility from local storage
  loadColumnVisibility(): void {
    if (this.dataName) {
      const savedState = localStorage.getItem(`columnVisibility_${this.dataName}`);
      if (savedState) {
        const visibilityState = JSON.parse(savedState);
        this.allColumns.forEach(col => {
          if (visibilityState[col.id] !== undefined) {
            col.visible = visibilityState[col.id];
          }
        });
      }
    }
  }

  toggleColumnsDropdown(): void {
    this.columnsDropdownOpen = !this.columnsDropdownOpen;
    this.dropdownOpen = false;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.columnsDropdownOpen = false;
  }

  resetSort(): void {
    this.sortBy = '';
    this.sortOrder = '';
    if (this.sort) {
      this.sort.active = '';
      this.sort.direction = '';
      this.sort.sortChange.emit();
    }
    this.paginatedData.sort = this.sort;
  }

  applyDateFilter(): void {
    this.loading = true;
    if (this.selectedDateRange === 'all') {
      this.customStartDate = null;
      this.customEndDate = null;
      this.currentPage = 1;
      this.loadData(this.currentPage).finally(() => {
        this.loading = false;
      });
      return;
    }

    if (this.selectedDateRange === 'custom' && (!this.customStartDate || !this.customEndDate)) {
      this.loading = false;
      return;
    }

    this.currentPage = 1;
    this.loadData(this.currentPage).finally(() => {
      this.loading = false;
    });
  }

  formatLocalDate(date: Date): string {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngAfterViewInit(): void {
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
              resolve();
            },
            (error) => {
              console.error('Failed to load data:', error);
              reject(error);
            }
          );
      } else {
        resolve();
      }
    });
  }

  downloadData(format: 'json' | 'csv'): void {
    this.isDownloading = true;
    this.loading = true;
    this.dropdownOpen = false;

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

      const url = `http://localhost:5000/viewdata/${this.dataName}?format=${format}`;
      const fileExtension = format === 'csv' ? 'csv' : 'json';

      if (format === 'csv') {
        this.http
          .get(url, {
            headers,
            params,
            responseType: 'blob'
          })
          .subscribe(
            (blob: Blob) => {
              const fileName = `${this.dataName}.csv`;
              saveAs(blob, fileName);
              this.loading = false;
              this.isDownloading = false;
            },
            (error) => {
              this.loading = false;
              this.isDownloading = false;
              console.error('Failed to download CSV data:', error);
            }
          );
      } else {
        this.http
          .get(url, {
            headers,
            params,
            responseType: 'json'
          })
          .subscribe(
            (response: any) => {
              const jsonString = JSON.stringify(response.data, null, 2);
              const blob = new Blob([jsonString], { type: 'application/json' });
              const fileName = `${this.dataName}.json`;
              saveAs(blob, fileName);
              this.loading = false;
              this.isDownloading = false;
            },
            (error) => {
              this.loading = false;
              this.isDownloading = false;
              console.error('Failed to download JSON data:', error);
            }
          );
      }
    } else {
      console.error('Data name or token is null or undefined, cannot download data');
      this.loading = false;
      this.isDownloading = false;
    }
  }

  handleSort(): void {
    if (this.sort.direction) {
      this.sortBy = this.sort.active;
      this.sortOrder = this.sort.direction === 'desc' ? 'desc' : 'asc';
    } else {
      this.sortBy = '';
      this.sortOrder = '';
      this.paginatedData.data = this.originalData;
    }

    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  onSearch(): void {
    this.loading = true;
    this.saveSearchCriteriaForDataset();
    this.currentPage = 1;
    this.loadData(this.currentPage).finally(() => {
      this.loading = false;
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
        app_id: this.searchAppId ? this.searchAppId : null
      };
    }
  }

  setSearchCriteriaForDataset(datasetName: string): void {
    this.loading = true;
    const criteria = this.searchCriteria[datasetName] || { name: '', email: '', mobile: '', app_id: '' };
    this.searchName = criteria.name;
    this.searchEmail = criteria.email;
    this.searchMobile = criteria.mobile || '';
    this.searchAppId = criteria.app_id || '';

    this.selectedDateRange = 'all';
    this.customStartDate = null;
    this.customEndDate = null;

    this.loadData(1).finally(() => {
      this.loading = false;
    });
  }

  showAll(): void {
    this.loading = true;
    this.searchName = '';
    this.searchEmail = '';
    this.searchMobile = '';
    this.searchAppId = '';
    this.itemsPerPage = 10;
    this.currentPage = 1;
    this.saveSearchCriteriaForDataset();
    this.loadData(this.currentPage).finally(() => {
      this.loading = false;
    });
  }
}