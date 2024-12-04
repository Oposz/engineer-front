import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLeaderModalComponent } from './add-edit-leader-modal.component';

describe('AddEditLeaderModalComponent', () => {
  let component: AddEditLeaderModalComponent;
  let fixture: ComponentFixture<AddEditLeaderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditLeaderModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditLeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
