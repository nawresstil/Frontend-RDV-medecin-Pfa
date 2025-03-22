import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorUpdatePasswordComponent } from './doctor-update-password.component';

describe('DoctorUpdatePasswordComponent', () => {
  let component: DoctorUpdatePasswordComponent;
  let fixture: ComponentFixture<DoctorUpdatePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorUpdatePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorUpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
