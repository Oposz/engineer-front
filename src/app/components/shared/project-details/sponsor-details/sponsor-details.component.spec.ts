import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorDetailsComponent } from './sponsor-details.component';

describe('SponsorDetailsComponent', () => {
  let component: SponsorDetailsComponent;
  let fixture: ComponentFixture<SponsorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
