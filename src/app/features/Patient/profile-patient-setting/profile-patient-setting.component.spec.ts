import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePatientSettingComponent } from './profile-patient-setting.component';

describe('ProfilePatientSettingComponent', () => {
  let component: ProfilePatientSettingComponent;
  let fixture: ComponentFixture<ProfilePatientSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePatientSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePatientSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
