import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNewNameModalComponent } from './chat-new-name-modal.component';

describe('ChatNewNameModalComponent', () => {
  let component: ChatNewNameModalComponent;
  let fixture: ComponentFixture<ChatNewNameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatNewNameModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatNewNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
