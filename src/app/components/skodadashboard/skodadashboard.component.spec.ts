import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkodadashboardComponent } from './skodadashboard.component';

describe('SkodadashboardComponent', () => {
  let component: SkodadashboardComponent;
  let fixture: ComponentFixture<SkodadashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkodadashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkodadashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
