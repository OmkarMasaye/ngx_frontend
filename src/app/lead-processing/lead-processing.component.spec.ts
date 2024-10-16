import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadProcessingComponent } from './lead-processing.component';

describe('LeadProcessingComponent', () => {
  let component: LeadProcessingComponent;
  let fixture: ComponentFixture<LeadProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadProcessingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
