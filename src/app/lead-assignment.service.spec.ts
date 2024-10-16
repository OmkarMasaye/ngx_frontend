import { TestBed } from '@angular/core/testing';

import { LeadAssignmentService } from './lead-assignment.service';

describe('LeadAssignmentService', () => {
  let service: LeadAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
