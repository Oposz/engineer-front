import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectNewUniversityComponent } from './connect-new-university.component';

describe('ConnectNewUniversityComponent', () => {
  let component: ConnectNewUniversityComponent;
  let fixture: ComponentFixture<ConnectNewUniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectNewUniversityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectNewUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
