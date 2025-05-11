import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsAdminComponent } from './patients-admin.component';

describe('PatientsAdminComponent', () => {
  let component: PatientsAdminComponent;
  let fixture: ComponentFixture<PatientsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
