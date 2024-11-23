import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewConversationModalComponent } from './create-new-conversation-modal.component';

describe('CreateNewConversationModalComponent', () => {
  let component: CreateNewConversationModalComponent;
  let fixture: ComponentFixture<CreateNewConversationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewConversationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewConversationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
