import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialitiesAdminComponent } from './specialities-admin.component';

describe('SpecialitiesAdminComponent', () => {
  let component: SpecialitiesAdminComponent;
  let fixture: ComponentFixture<SpecialitiesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialitiesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialitiesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
