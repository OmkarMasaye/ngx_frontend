import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadDataService {
  private apiUrl = 'http://localhost:5000/api/lead-summary'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  getLeadData(
    dataName: string,
    dateRange: string = 'thisWeek',
    customStartDate?: string | null,
    customEndDate?: string | null
  ): Observable<any> {
    let url = `${this.apiUrl}/${dataName}?dateRange=${dateRange}`;
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      url += `&customStartDate=${customStartDate}&customEndDate=${customEndDate}`;
    }
    return this.http.get<any>(url);
  }gettLeadData(
    dataName: string,
    dateRange: string = 'thisWeek',
    customStartDate?: string | null,
    customEndDate?: string | null
  ): Observable<any> {
    let url = `${this.apiUrl}/${dataName}?dateRange=${dateRange}`;
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      url += `&customStartDate=${customStartDate}&customEndDate=${customEndDate}`;
    }
    return this.http.get<any>(url);
  }

  // Format date to YYYY-MM-DD in IST
  formatISTDate(date: Date | null): string | null {
    if (!date) return null;
    // Adjust to IST (UTC+5:30)
    const istOffset = 5.5 * 60; // IST offset in minutes
    const localDate = new Date(date.getTime() + istOffset * 60 * 1000);
    localDate.setUTCHours(0, 0, 0, 0); // Set to midnight IST
    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  getLeadsOverTime(
    dataSource: string,
    dateRange: string,
    startDate?: string | null,
    endDate?: string | null
  ): Observable<any> {
    let url = `http://localhost:5000/leads-over-time?dateRange=${dateRange}`;
    if (dateRange === 'custom' && startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get(url);
  }

  // Format date to YYYY-MM-DD in IST
  formatiSTDate(date: Date): string {
    const offsetIST = 5.5 * 60; // IST is UTC+5:30
    const istDate = new Date(date.getTime() + offsetIST * 60 * 1000);
    return istDate.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }

  getleadsOverTime(
    dataSource: string,
    dateRange: string,
    startDate?: string | null,
    endDate?: string | null
  ): Observable<any> {
    let url = `http://localhost:5000/lead-over-time?dateRange=${dateRange}`;
    if (dateRange === 'custom' && startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get(url);
  }

  getCreditDistribution(dataName: string, dateRange: string = 'today', startDate?: string | null,
    endDate?: string | null): Observable<any> {
    let url = `http://localhost:5000/api/credit-distribution/${dataName}?dateRange=${dateRange}`;
    if (dateRange === 'custom' && startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get<any>(url);
  }
  formattISTDate(date: Date | string | null): string | null {
    if (!date) return null;
  
    // Convert to Date if it's a string
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
    const istOffset = 5.5 * 60; // IST offset in minutes
    const localDate = new Date(parsedDate.getTime() + istOffset * 60 * 1000);
    localDate.setUTCHours(0, 0, 0, 0); // Set to midnight IST
  
    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localDate.getUTCDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
 

}