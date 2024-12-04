import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeadersPanelComponent} from './leaders-panel.component';

describe('CardsPanelComponent', () => {
  let component: LeadersPanelComponent;
  let fixture: ComponentFixture<LeadersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadersPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
