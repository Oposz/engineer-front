import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitiesPanelComponent } from './universities-panel.component';

describe('UniversitiesPanelComponent', () => {
  let component: UniversitiesPanelComponent;
  let fixture: ComponentFixture<UniversitiesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversitiesPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversitiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
