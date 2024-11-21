import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonProjectModalComponent } from './abandon-project-modal.component';

describe('AbandonProjectModalComponent', () => {
  let component: AbandonProjectModalComponent;
  let fixture: ComponentFixture<AbandonProjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbandonProjectModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbandonProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
