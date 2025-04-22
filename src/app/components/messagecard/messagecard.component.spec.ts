import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagecardComponent } from './messagecard.component';

describe('MessagecardComponent', () => {
  let component: MessagecardComponent;
  let fixture: ComponentFixture<MessagecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagecardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
