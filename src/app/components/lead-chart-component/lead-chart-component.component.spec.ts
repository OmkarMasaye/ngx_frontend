import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadChartComponentComponent } from './lead-chart-component.component';

describe('LeadChartComponentComponent', () => {
  let component: LeadChartComponentComponent;
  let fixture: ComponentFixture<LeadChartComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadChartComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadChartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
