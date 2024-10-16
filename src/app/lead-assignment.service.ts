import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeadAssignmentService {

  constructor() { }

  assignLeads(leads: { source: string, assignedTeam?: string }[]): void {
    leads.forEach(lead => {
      if (lead.source === 'Facebook Ads') {
        lead.assignedTeam = 'Team A';
      } else if (lead.source === 'Google Ads') {
        lead.assignedTeam = 'Team B';
      } else {
        lead.assignedTeam = 'Unassigned'; // Handle unknown sources
      }
    });
  }
}
