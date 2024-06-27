import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UniversityViewComponent} from './university-view.component';

describe('UniveristyViewComponent', () => {
  let component: UniversityViewComponent;
  let fixture: ComponentFixture<UniversityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityViewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UniversityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
