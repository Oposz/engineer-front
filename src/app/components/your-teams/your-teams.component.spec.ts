import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourTeamsComponent } from './your-teams.component';

describe('YourTeamsComponent', () => {
  let component: YourTeamsComponent;
  let fixture: ComponentFixture<YourTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
