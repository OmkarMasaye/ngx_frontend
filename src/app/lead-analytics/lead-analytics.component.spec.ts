import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAnalyticsComponent } from './lead-analytics.component';

describe('LeadAnalyticsComponent', () => {
  let component: LeadAnalyticsComponent;
  let fixture: ComponentFixture<LeadAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
