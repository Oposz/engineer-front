import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyToProjectModalComponent } from './apply-to-project-modal.component';

describe('ApplyToProjectModalComponent', () => {
  let component: ApplyToProjectModalComponent;
  let fixture: ComponentFixture<ApplyToProjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyToProjectModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyToProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
