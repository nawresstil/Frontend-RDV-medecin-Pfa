import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAdminComponent } from './doctors-admin.component';

describe('DoctorsAdminComponent', () => {
  let component: DoctorsAdminComponent;
  let fixture: ComponentFixture<DoctorsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
