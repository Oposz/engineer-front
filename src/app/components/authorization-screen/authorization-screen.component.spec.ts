import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationScreenComponent } from './authorization-screen.component';

describe('AuthorizationScreenComponent', () => {
  let component: AuthorizationScreenComponent;
  let fixture: ComponentFixture<AuthorizationScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizationScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
