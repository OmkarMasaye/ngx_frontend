import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPostPlaceholderComponent } from './new-post-placeholder.component';

describe('NewPostPlaceholderComponent', () => {
  let component: NewPostPlaceholderComponent;
  let fixture: ComponentFixture<NewPostPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPostPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPostPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
