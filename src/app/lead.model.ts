export interface Lead {
  lead_id: string;
  name: string;
  email: string;
  phone: string;
  source: string;  // e.g., "Google Ads", "Facebook Ads", etc.
  status: string;  // e.g., "new", "qualified", "closed"
  score: number;   // Lead quality score, e.g., 1 to 100
  assigned_team: string;  // "Team A", "Team B"
  created_at: Date;
  updated_at: Date;
}

// Sample Data
export const SAMPLE_LEADS: Lead[] = [
  { lead_id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890', source: 'Google Ads', status: 'new', score: 80, assigned_team: '', created_at: new Date(), updated_at: new Date() },
  { lead_id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210', source: 'Facebook Ads', status: 'qualified', score: 90, assigned_team: '', created_at: new Date(), updated_at: new Date() },
  { lead_id: '3', name: 'Robert Brown', email: 'robert@example.com', phone: '5556667770', source: 'Email Campaign', status: 'new', score: 60, assigned_team: '', created_at: new Date(), updated_at: new Date() }
];
