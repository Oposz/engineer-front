import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEditUniversityModalComponent} from './add-edit-university-modal.component';

describe('AddUniversityModalComponent', () => {
  let component: AddEditUniversityModalComponent;
  let fixture: ComponentFixture<AddEditUniversityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditUniversityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUniversityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
