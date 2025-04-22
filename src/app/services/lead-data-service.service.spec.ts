import { TestBed } from '@angular/core/testing';

import { LeadDataServiceService } from './lead-data-service.service';

describe('LeadDataServiceService', () => {
  let service: LeadDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
