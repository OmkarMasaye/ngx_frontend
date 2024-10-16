import { Injectable } from '@angular/core';
import { Lead } from './lead.model';

@Injectable({
  providedIn: 'root'
})
export class LeadAnalyticsService {
  private leads: Lead[] = [];

  constructor() { }

  getLeads(): Lead[] {
    return this.leads;  // Fetch from a backend in a real-world app
  }

  addLead(lead: Lead): void {
    this.leads.push(lead);
  }
}
