import { TestBed } from '@angular/core/testing';

import { LeadAnalyticsService } from './lead-analytics.service';

describe('LeadAnalyticsService', () => {
  let service: LeadAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
